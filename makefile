.PHONY: up down build start stop logs ps prisma-generate prisma-migrate prisma-studio init-db shell-api rebuild clean

# Docker Compose project name
PROJECT_NAME := sos-rs

# Specify the Docker Compose file
COMPOSE_FILE := docker-compose.dev.yml

# Help documentation
help:
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  build                Build the Docker containers (does not start them)"
	@echo "  up                   Start all services defined in your docker-compose.yml in detached mode"
	@echo "  down                 Stop and remove all running containers"
	@echo "  start                Start specific services, building them if necessary"
	@echo "  stop                 Stop specific services without removing them"
	@echo "  logs                 Follow logs for containers"
	@echo "  ps                   List all running containers based on this compose file"
	@echo "  prisma-generate      Run Prisma generate to update client libraries"
	@echo "  prisma-migrate       Run Prisma migrations to update the database schema"
	@echo "  prisma-migrate-dev   Run Prisma migrations to update the database schema (Development mode)"
	@echo "  prisma-studio        Open Prisma Studio for database management"
	@echo "  init-db              Install dependencies, generate Prisma client, run migrations and start the development server"
	@echo "  shell-api            Run shell inside the API service container"
	@echo "  rebuild              Force rebuild the containers"
	@echo "  clean                Remove all containers, networks, and volumes"
	@echo ""
	@echo "See 'docker-compose logs' for more information on using Docker Compose."

# Build the Docker containers (does not start them)
build:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) build

# Start all services defined in your docker-compose.yml
up:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d

# Stop all running containers defined in your docker-compose.yml
down:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down

# Start specific services, building them if necessary
start: build
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d api db

# Stop specific services without removing them
stop:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop

# Follow logs for containers
logs:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) logs -f

# List all running containers based on this compose file
ps:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) ps

# Run Prisma generate to update client libraries
prisma-generate:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api npx prisma generate

# Run Prisma migrations to update the database schema (development mode)
prisma-migrate-dev:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api npx prisma migrate dev

# Run Prisma migrations to update the database schema
prisma-migrate:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api npx prisma migrate deploy

# Open Prisma Studio for database management
prisma-studio:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api npx prisma studio

# Install dependencies, generate Prisma client, run migrations and start the development server
init-db:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api sh -c "npm install && npx prisma generate && npx prisma migrate dev && npm run start:dev"

# Run shell inside the API service container
shell-api:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) exec api sh

# Force rebuild the containers
rebuild:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d --build

# Remove all containers, networks, and volumes
clean:
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down --volumes --remove-orphans
