# Create a VPC
resource "aws_vpc" "vpc" {
  cidr_block           = "192.168.0.0/16"
  enable_dns_hostnames = "true"
  instance_tenancy     = "default"
  tags = {
    Name = "vpc-${var.aws_region}"
  }
}

# Create a public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "192.168.0.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet"
  }
}

# Create a private subnet
resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "192.168.1.0/24"
  availability_zone = "${var.aws_region}a"
  tags = {
    Name = "Private Subnet"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "igw-${var.aws_region}"
  }
}

# Create a public route table and associate it with the public subnet
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "Public route table"
  }
}

resource "aws_route_table_association" "public_route_table_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

# Create an EIP for the NAT gateway
# resource "aws_eip" "nat_eip" {
#   #   vpc = true
#   domain = "vpc"
# }

# # Create a NAT gateway
# resource "aws_nat_gateway" "nat_gateway" {
#   allocation_id = aws_eip.nat_eip.id
#   subnet_id     = aws_subnet.public_subnet.id

#   tags = {
#     Name = "ngw-${var.aws_region}"
#   }
# }


# # Create a private route table and associate it with the private subnet
# resource "aws_route_table" "private_route_table" {
#   vpc_id = aws_vpc.vpc.id

#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.nat_gateway.id
#   }
#   tags = {
#     Name = "Private route table"
#   }
# }

# resource "aws_route_table_association" "private_route_table_association" {
#   subnet_id      = aws_subnet.private_subnet.id
#   route_table_id = aws_route_table.private_route_table.id
# }

# Create a security group for the EC2 instance
resource "aws_security_group" "instance_security_group" {
  name_prefix = "instance-sg"
  vpc_id      = aws_vpc.vpc.id
  description = "security group for the EC2 instance"


  ingress {
    description = "Konga"
    from_port   = 1337
    to_port     = 1337
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "http"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ssh"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "micorservices"
    from_port   = 5000
    to_port     = 5003
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }


  tags = {
    Name = "EC2 Instance security group"
  }
}

# Security group for VPC Endpoints
resource "aws_security_group" "vpc_endpoint_security_group" {
  name_prefix = "vpc-endpoint-sg"
  vpc_id      = aws_vpc.vpc.id
  description = "security group for VPC Endpoints"

  # Allow inbound HTTPS traffic
  ingress {
    from_port = 443
    to_port   = 443
    # from_port   = 0
    # to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
    description = "Allow HTTPS traffic from VPC"
  }

  tags = {
    Name = "VPC Endpoint security group"
  }
}

locals {
  endpoints = {
    "endpoint-ssm" = {
      name = "ssm"
    },
    "endpoint-ssmm-essages" = {
      name = "ssmmessages"
    },
    "endpoint-ec2-messages" = {
      name = "ec2messages"
    }
  }
}

resource "aws_vpc_endpoint" "endpoints" {
  vpc_id            = aws_vpc.vpc.id
  for_each          = local.endpoints
  vpc_endpoint_type = "Interface"
  service_name      = "com.amazonaws.${var.aws_region}.${each.value.name}"
  # Add a security group to the VPC endpoint
  security_group_ids = [aws_security_group.vpc_endpoint_security_group.id]
}

# Create IAM role for EC2 instance
resource "aws_iam_role" "ec2_role" {
  name = "EC2_SSM_Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Attach AmazonSSMManagedInstanceCore policy to the IAM role
resource "aws_iam_role_policy_attachment" "ec2_role_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.ec2_role.name
}

# Create an instance profile for the EC2 instance and associate the IAM role
resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "EC2_SSM_Instance_Profile"
  role = aws_iam_role.ec2_role.name
}

# Get the latest Amazon Linux 2023 AMI ID
data "aws_ami" "latest_amazon_linux_2023" {
  most_recent = true
  owners      = ["137112412989"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-kernel-6.1-x86_64"]
  }
  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "SBRP_instance" {
  ami           = data.aws_ami.latest_amazon_linux_2023.id
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [
    aws_security_group.instance_security_group.id
  ]
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
  key_name             = aws_key_pair.my_key_pair.key_name
  user_data            = data.cloudinit_config.user_data_config.rendered

  tags = {
    Name = "SBRP_instance"
  }
}

locals {
  cloud_config_config = <<-END
    #cloud-config
    ${jsonencode({
  write_files = [
    {
      path        = "/home/ec2-user/docker-compose.yml"
      permissions = "0644"
      owner       = "root:root"
      encoding    = "b64"
      content     = filebase64("../docker-compose.yml")
    },
    {
      path        = "/home/ec2-user/db.env"
      permissions = "0644"
      owner       = "root:root"
      encoding    = "b64"
      content     = filebase64("../db.env")
    },
    {
      path        = "/home/ec2-user/kong.env"
      permissions = "0644"
      owner       = "root:root"
      encoding    = "b64"
      content     = filebase64("../kong.env")
    },
  ]
})}
  END
}


data "cloudinit_config" "user_data_config" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/cloud-config"
    filename     = "cloud-config.yaml"
    content      = local.cloud_config_config
  }

  part {
    content_type = "text/x-shellscript"
    filename     = "example.sh"
    content      = <<-EOF
        #!/bin/bash
        yum update -y
        yum install -y docker
        service docker start
        usermod -a -G docker ec2-user
        sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        cd /home/ec2-user

        cat <<EOT > /etc/systemd/system/docker-compose.service
        [Unit]
        Description=Docker Compose Service
        Requires=docker.service
        After=docker.service

        [Service]
        Type=oneshot
        RemainAfterExit=yes
        WorkingDirectory=/home/ec2-user
        ExecStart=/usr/local/bin/docker-compose up -d
        ExecStop=/usr/local/bin/docker-compose down

        [Install]
        WantedBy=multi-user.target
        EOT

        systemctl daemon-reload
        systemctl enable docker-compose.service
        systemctl start docker-compose.service
    EOF
  }
}

resource "aws_key_pair" "my_key_pair" {
  key_name   = "id_rsa"
  public_key = file("~/.ssh/id_rsa.pub")
}
