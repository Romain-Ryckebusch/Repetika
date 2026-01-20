provider "aws" {
  region  = var.region
  profile = var.aws_profile
}

variable "region" {
  type    = string
  default = "eu-west-3"
}
variable "aws_profile" {
  type    = string
  default = "repetika"
}

variable "instance_type" {
  type    = string
  default = "t3.small" # t3.micro was unable to support load of microservices
}

data "http" "myip" {
  url = "https://checkip.amazonaws.com/" # Get IP of the machine running terraform. TODO: Adapt for CD pipeline
}

# Repetika settings (In terraform state for learning, later should be managed as secrets)
variable "secret_key" {
  type      = string
  sensitive = true
}
variable "postgres_password" {
  type      = string
  sensitive = true
}

locals {
  name                  = "repetika-dev"
  interpreter_public_ip = chomp(data.http.myip.response_body)
  allowed_http_cidr     = "${local.interpreter_public_ip}/32" # Restrict access to instance that ran the script
}

# --- Networking: minimal VPC with one public subnet ---
resource "aws_vpc" "main" {
  cidr_block           = "10.10.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = "${local.name}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${local.name}-igw" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.10.1.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "${var.region}a"
  tags                    = { Name = "${local.name}-public-subnet" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "${local.name}-public-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# --- Security group: allow connexions from runner IP only ---
resource "aws_security_group" "web" {
  name        = "${local.name}-sg"
  description = "Repetika web access"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [local.allowed_http_cidr]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [local.allowed_http_cidr]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [local.allowed_http_cidr]
  }

  ingress {
    description = "Repetika API"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = [local.allowed_http_cidr]
  }

  ingress {
    description = "Expo Metro dev server"
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = [local.allowed_http_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name}-sg" }
}

# --- IAM role for SSM (Session Manager) ---
resource "aws_iam_role" "ec2_role" {
  name = "${local.name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "ec2.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

# AWS managed policy that enables core Systems Manager functionality
resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${local.name}-profile"
  role = aws_iam_role.ec2_role.name
}

# --- Pick latest Amazon Linux 2023 AMI via SSM public parameter ---
# AWS documents these public SSM parameters for "latest AMIs".
data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "random_id" "suffix" {
  byte_length = 2
}

# --- user_data: install Docker + Compose plugin + run Repetika ---
data "template_file" "user_data" {
  template = file("${path.module}/templates/user_data.sh.tftpl")
  vars = {
    secret_key        = var.secret_key
    postgres_password = var.postgres_password
  }
}

resource "aws_instance" "repetika" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = data.template_file.user_data.rendered
  user_data_replace_on_change = true

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "${local.name}-${random_id.suffix.hex}"
  }
}

output "public_ip" {
  value = aws_instance.repetika.public_ip
}
