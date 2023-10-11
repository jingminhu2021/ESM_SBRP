# # Create a VPC
# resource "aws_vpc" "vpc" {
#   cidr_block = "10.0.0.0/16"
#   tags = {
#     Name = "vpc-${var.aws_region}"
#   }
# }

# # Create an internet gateway
# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.vpc.id
#   tags = {
#     Name = "igw-${var.aws_region}"
#   }
# }

# # Create a public subnet
# resource "aws_subnet" "public_subnet" {
#   vpc_id            = aws_vpc.vpc.id
#   cidr_block        = "10.0.1.0/24"
#   availability_zone = "${var.aws_region}a"
#   tags = {
#     Name = "Public Subnet"
#   }
# }

# # Create a private subnet
# resource "aws_subnet" "private_subnet" {
#   vpc_id            = aws_vpc.vpc.id
#   cidr_block        = "10.0.2.0/24"
#   availability_zone = "${var.aws_region}a"
#   tags = {
#     Name = "Private Subnet"
#   }
# }

# # Create a NAT gateway
# resource "aws_nat_gateway" "nat_gateway" {
#   allocation_id = aws_eip.nat_eip.id
#   subnet_id     = aws_subnet.public_subnet.id
#   tags = {
#     Name = "ngw-${var.aws_region}"
#   }
# }

# # Create an EIP for the NAT gateway
# resource "aws_eip" "nat_eip" {
#   #   vpc = true
#   domain = "vpc"
# }

# # Create a public route table and associate it with the public subnet
# resource "aws_route_table" "public_route_table" {
#   vpc_id = aws_vpc.vpc.id
#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.gw.id
#   }
#   tags = {
#     Name = "Public route table"
#   }
# }

# resource "aws_route_table_association" "public_route_table_association" {
#   subnet_id      = aws_subnet.public_subnet.id
#   route_table_id = aws_route_table.public_route_table.id
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

# # Create a security group for the EC2 instance
# resource "aws_security_group" "instance_security_group" {
#   name_prefix = "instance-sg"
#   vpc_id      = aws_vpc.vpc.id
#   description = "security group for the EC2 instance"

#   # Allow outbound HTTPS traffic
#   egress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#     description = "Allow HTTPS outbound traffic"
#   }

#   tags = {
#     Name = "EC2 Instance security group"
#   }
# }

# # Security group for VPC Endpoints
# resource "aws_security_group" "vpc_endpoint_security_group" {
#   name_prefix = "vpc-endpoint-sg"
#   vpc_id      = aws_vpc.vpc.id
#   description = "security group for VPC Endpoints"

#   # Allow inbound HTTPS traffic
#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = [aws_vpc.vpc.cidr_block]
#     description = "Allow HTTPS traffic from VPC"
#   }

#   tags = {
#     Name = "VPC Endpoint security group"
#   }
# }

# locals {
#   endpoints = {
#     "endpoint-ssm" = {
#       name = "ssm"
#     },
#     "endpoint-ssmm-essages" = {
#       name = "ssmmessages"
#     },
#     "endpoint-ec2-messages" = {
#       name = "ec2messages"
#     }
#   }
# }

# resource "aws_vpc_endpoint" "endpoints" {
#   vpc_id            = aws_vpc.vpc.id
#   for_each          = local.endpoints
#   vpc_endpoint_type = "Interface"
#   service_name      = "com.amazonaws.${var.aws_region}.${each.value.name}"
#   # Add a security group to the VPC endpoint
#   security_group_ids = [aws_security_group.vpc_endpoint_security_group.id]
# }

# # Create IAM role for EC2 instance
# resource "aws_iam_role" "ec2_role" {
#   name = "EC2_SSM_Role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Principal = {
#           Service = "ec2.amazonaws.com"
#         }
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })
# }

# # Attach AmazonSSMManagedInstanceCore policy to the IAM role
# resource "aws_iam_role_policy_attachment" "ec2_role_policy" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
#   role       = aws_iam_role.ec2_role.name
# }

# # Create an instance profile for the EC2 instance and associate the IAM role
# resource "aws_iam_instance_profile" "ec2_instance_profile" {
#   name = "EC2_SSM_Instance_Profile"
#   role = aws_iam_role.ec2_role.name
# }

# # resource "aws_iam_policy_attachment" "ec2_role_policy" {
# #   name       = "SBRP_policy_attachment"
# #   policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
# #   roles      = [aws_iam_role.ec2_role.name]
# # }

# # Get the latest Amazon Linux 2023 AMI ID
# data "aws_ami" "latest_amazon_linux_2023" {
#   most_recent = true
#   owners      = ["137112412989"]
#   filter {
#     name   = "name"
#     values = ["al2023-ami-2023.*-kernel-6.1-x86_64"]
#   }
#   filter {
#     name   = "root-device-type"
#     values = ["ebs"]
#   }

#   filter {
#     name   = "virtualization-type"
#     values = ["hvm"]
#   }
# }

# resource "aws_instance" "SBRP_instance" {
#   ami           = data.aws_ami.latest_amazon_linux_2023.id
#   instance_type = "t2.micro"
#   subnet_id     = aws_subnet.private_subnet.id
#   vpc_security_group_ids = [
#     aws_security_group.instance_security_group.id,
#   ]
#   iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
#   key_name             = aws_key_pair.my_key_pair.key_name
#   tags = {
#     Name = "SBRP_instance"
#   }
# }

# resource "aws_key_pair" "my_key_pair" {
#   key_name   = "id_rsa"
#   public_key = file("~/.ssh/id_rsa.pub")
# }
