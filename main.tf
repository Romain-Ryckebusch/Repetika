terraform {
  required_version = ">= 1.10.0"

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "repetika"
    workspaces {
      name = "repetika-doks"
    }
  }

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.32"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.13"
    }
  }
}

########################
# Root-level variables
########################

variable "do_token" {
  type      = string
  sensitive = true
}

variable "cluster_name" {
  type = string
}

variable "image_registry" {
  type = string
}

variable "image_tag" {
  type = string
}

variable "django_secret_key" {
  type      = string
  sensitive = true
}

variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "grafana_admin_password" {
  type      = string
  sensitive = true
}

variable "namespace" {
  type    = string
  default = "repetika"
}

########################
# Providers + cluster
########################

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_kubernetes_cluster" "this" {
  name = var.cluster_name
}

provider "kubernetes" {
  host = data.digitalocean_kubernetes_cluster.this.endpoint

  token                  = data.digitalocean_kubernetes_cluster.this.kube_config[0].token
  cluster_ca_certificate = base64decode(
    data.digitalocean_kubernetes_cluster.this.kube_config[0].cluster_ca_certificate
  )
}

provider "helm" {
  kubernetes {
    host = data.digitalocean_kubernetes_cluster.this.endpoint

    token                  = data.digitalocean_kubernetes_cluster.this.kube_config[0].token
    cluster_ca_certificate = base64decode(
      data.digitalocean_kubernetes_cluster.this.kube_config[0].cluster_ca_certificate
    )
  }
}

########################
# DOKS app module
########################

module "doks" {
  source = "./infra/doks"

  namespace          = var.namespace
  image_registry     = var.image_registry
  image_tag          = var.image_tag
  django_secret_key  = var.django_secret_key
  postgres_password  = var.postgres_password
  grafana_admin_password = var.grafana_admin_password
}
