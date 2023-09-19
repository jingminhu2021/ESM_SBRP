resource "aws_db_instance" "default" {
  allocated_storage    = 10
  auto_minor_version_upgrade  = false
  db_name              = "mydb"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t3.micro"
  username             = "test"
  password             = "test"
  parameter_group_name = "default.mysql5.7"
  skip_final_snapshot  = true
}

resource "aws_db_instance" "default-replica" {
    replicate_source_db = aws_db_instance.default.id
    instance_class = aws_db_instance.default.instance_class
    auto_minor_version_upgrade = false
    backup_retention_period = 7
    skip_final_snapshot = true
    storage_encrypted = true

    timeouts {
        create = "3h"
        delete = "3h"
        update = "3h"
    }
}