# module "github_runner_app" {
#   source = "git::https://github.com/pagopa/github-actions-tf-modules.git//app-github-runner-creator?ref=main"

#   app_name = local.app_name

#   subscription_id = data.azurerm_subscription.current.id

#   github_org              = local.github.org
#   github_repository       = local.github.repository
#   github_environment_name = var.env

#   container_app_github_runner_env_rg = local.container_app_environment.resource_group
# }

# resource "azurerm_role_assignment" "environment_terraform_storage_account" {
#   scope                = data.azurerm_storage_account.tf_storage_account.id
#   role_definition_name = "Contributor"
#   principal_id         = module.github_runner_app.object_id
# }

# resource "azurerm_role_assignment" "environment_cdn_profile" {
#   scope                = data.azurerm_cdn_profile.cdn_profile.id
#   role_definition_name = "Contributor"
#   principal_id         = module.github_runner_app.object_id

# }

# resource "azurerm_role_assignment" "environment_key_vault" {
#   scope                = data.azurerm_key_vault.key_vault.id
#   role_definition_name = "Reader"
#   principal_id         = module.github_runner_app.object_id

# }

# resource "azurerm_role_assignment" "environment_key_vault_domain" {
#   scope                = data.azurerm_key_vault.domain_key_vault.id
#   role_definition_name = "Reader"
#   principal_id         = module.github_runner_app.object_id

# }

# resource "azurerm_key_vault_access_policy" "ad_kv_group_policy" {
#   key_vault_id = data.azurerm_key_vault.key_vault.id

#   tenant_id = data.azurerm_client_config.current.tenant_id
#   object_id = module.github_runner_app.object_id


#   key_permissions         = []
#   secret_permissions      = ["Get", "List"]
#   storage_permissions     = []
#   certificate_permissions = []
# }

# resource "azurerm_key_vault_access_policy" "ad_domain_kv_group_policy" {
#   key_vault_id = data.azurerm_key_vault.domain_key_vault.id

#   tenant_id = data.azurerm_client_config.current.tenant_id
#   object_id = module.github_runner_app.object_id


#   key_permissions         = []
#   secret_permissions      = ["Get", "List"]
#   storage_permissions     = []
#   certificate_permissions = []
# }
