variable "profile" {
  description = "value of the AWS profile to use"
  type        = string
}
variable "aws_region" {
  description = "The AWS region to deploy to"
  type     = string
}

variable "service_name" {
  description = "The name of the service"
  type     = string
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}