data "azurerm_storage_account" "tf_storage_account"{
  name                = "pagopainfraterraform${var.env}"
  resource_group_name = "io-infra-rg"
}

data "github_organization_teams" "all" {
  root_teams_only = true
  summary_only    = true
}

data "azurerm_key_vault" "key_vault" {
  name = "pagopa-${var.env_short}-kv"
  resource_group_name = "pagopa-${var.env_short}-sec-rg"
}

data "azurerm_key_vault" "domain_key_vault" {
  name                = "pagopa-${var.env_short}-${local.location_short_itn}-${local.domain}-kv"
  resource_group_name = "pagopa-${var.env_short}-${local.location_short_itn}-${local.domain}-sec-rg"
}

data "azurerm_key_vault_secret" "key_vault_sonar" {
  name = "sonar-token"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

data "azurerm_key_vault_secret" "key_vault_bot_token" {
  name = "bot-token-github"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

data "azurerm_key_vault_secret" "key_vault_cucumber_token" {
  name = "cucumber-token"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

data "azurerm_cdn_profile" "cdn_profile" {
  name                = local.cdn.name
  resource_group_name = local.cdn.resource_group_name
}

data "azurerm_key_vault_secret" "key_vault_blob_connection_string" {
  name = "web-storage-blob-connection-string"
  key_vault_id = data.azurerm_key_vault.domain_key_vault.id
}

data "azurerm_user_assigned_identity" "identity_cd_01" {
  resource_group_name = "${local.product}-identity-rg"
  name                = "${local.product}-${local.domain}-job-01-github-cd-identity"
}