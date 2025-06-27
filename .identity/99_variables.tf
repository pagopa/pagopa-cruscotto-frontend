locals {
  github = {
    org        = "pagopa"
    repository = "pagopa-cruscotto-frontend"
  }

  prefix             = "pagopa"
  domain             = "crusc8"
  location_short_weu = "weu"
  location_short_itn = "itn"
  product            = "${var.prefix}-${var.env_short}"

            #  "github-pagopa-pagopa-api-config-fe-pagopa-apiconfig-<ENV_LONG>-aks"
  app_name = "github-${local.github.org}-${local.github.repository}-${var.prefix}-${local.domain}-${var.env}-aks"

  cdn = {
    name                = "${local.prefix}-${var.env_short}-crusc8-cdn-profile" # pagopa-<ENV>-crusc8-cdn-profile
    resource_group_name = "${local.prefix}-${var.env_short}-${local.location_short_weu}-crusc8-fe-rg" # pagopa-<ENV>-weu-crusc8-fe-rg

  }

  container_app_environment = {
    name           = "${local.prefix}-${var.env_short}-${local.location_short_weu}-github-runner-cae",
    resource_group = "${local.prefix}-${var.env_short}-${local.location_short_weu}-github-runner-rg",
  }
}

variable "env" {
  type = string
}

variable "env_short" {
  type = string
}

variable "prefix" {
  type    = string
  default = "pagopa"
  validation {
    condition = (
      length(var.prefix) <= 6
    )
    error_message = "Max length is 6 chars."
  }
}

variable "github_repository_environment" {
  type = object({
    protected_branches     = bool
    custom_branch_policies = bool
    reviewers_teams        = list(string)
  })
  description = "GitHub Continuous Integration roles"
  default = {
    protected_branches     = false
    custom_branch_policies = true
    reviewers_teams        = ["pagopa-team-core"]
  }
}

variable "client_id" {
  type = string
}
