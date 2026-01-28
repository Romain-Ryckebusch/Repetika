terraform {
  required_version = ">= 1.10.0"

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
# Module inputs
########################

variable "namespace" {
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

########################
# Resources
########################

resource "kubernetes_namespace" "repetika" {
  metadata {
    name = var.namespace
  }
}

resource "helm_release" "repetika" {
  name      = "repetika"
  namespace = kubernetes_namespace.repetika.metadata[0].name

  chart = "${path.root}/charts/repetika"

  values = [
    file("${path.root}/charts/repetika/values.yaml")
  ]

  set {
    name  = "global.namespace"
    value = var.namespace
  }

  set {
    name  = "image.registry"
    value = var.image_registry
  }

  set {
    name  = "image.tag"
    value = var.image_tag
  }

  set {
    name  = "image.pullPolicy"
    value = "IfNotPresent"
  }

  set_sensitive {
    name  = "global.app.secretKey"
    value = var.django_secret_key
  }

  set_sensitive {
    name  = "global.postgres.password"
    value = var.postgres_password
  }

  timeout = 300
}
