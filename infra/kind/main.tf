terraform {
  required_version = ">= 1.10.0"

  required_providers {
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

###########################################################
# Inputs
###########################################################

variable "kubeconfig_path" {
  type    = string
  default = "~/.kube/config"
}

variable "kubeconfig_context" {
  type    = string
  default = "kind-repetika"
}

# Namespace where Repetika will be deployed
variable "namespace" {
  type    = string
  default = "repetika"
}

###########################################################
# Providers (pointing at existing cluster)
###########################################################

provider "kubernetes" {
  config_path    = pathexpand(var.kubeconfig_path)
  config_context = var.kubeconfig_context
}

provider "helm" {
  kubernetes {
    config_path    = pathexpand(var.kubeconfig_path)
    config_context = var.kubeconfig_context
  }
}

###########################################################
# Namespace
###########################################################

resource "kubernetes_namespace" "repetika" {
  metadata {
    name = var.namespace
  }
}

###########################################################
# Helm release for the existing Repetika chart
###########################################################

resource "helm_release" "repetika" {
  name      = "repetika"
  namespace = kubernetes_namespace.repetika.metadata[0].name

  # Local chart
  chart = "${path.module}/../../charts/repetika"

  # Namespace is created above
  create_namespace = false

  # Base values (existing values.yaml)
  values = [
    file("${path.module}/../../charts/repetika/values.yaml")
  ]

  # Ensure global.namespace inside the chart matches the k8s namespace
  set {
    name  = "global.namespace"
    value = var.namespace
  }

  # For local dev: don't block waiting for pods to become Ready
  wait    = false
  timeout = 300
}
