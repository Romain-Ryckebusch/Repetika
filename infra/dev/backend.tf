terraform {
  required_version = ">= 1.10.0"

  backend "s3" {
    bucket       = "repetika-tf-state-0001"
    key          = "repetika/dev/terraform.tfstate"
    region       = "eu-west-3"
    profile      = "repetika"
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    http = {
      source  = "hashicorp/http"
      version = ">= 3.0.0"
    }
  }
}
