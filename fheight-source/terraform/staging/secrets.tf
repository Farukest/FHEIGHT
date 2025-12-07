module "kms_key" {
  source      = "../modules/kms_key"
  name        = "fheight-staging"
  description = "KMS key for fheight-staging."
}
