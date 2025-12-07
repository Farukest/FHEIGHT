module "ecr_repository_api" {
  source = "../modules/ecr_repository"
  name   = "fheight-api"
}

module "ecr_repository_game" {
  source = "../modules/ecr_repository"
  name   = "fheight-game"
}

module "ecr_repository_sp" {
  source = "../modules/ecr_repository"
  name   = "fheight-sp"
}

module "ecr_repository_worker" {
  source = "../modules/ecr_repository"
  name   = "fheight-worker"
}

module "ecr_repository_migrate" {
  source = "../modules/ecr_repository"
  name   = "fheight-migrate"
}
