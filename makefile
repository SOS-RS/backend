#!/bin/bash

CONTAINER_BACKEND = sos-rs-api

fileMode:
	@echo "Configuring git fileMode to false"
	git config core.fileMode false

create.env.file:
	if [ ! -f .env ]; then \
		cp .env.local .env; \
	fi

upDockerDev:
	docker-compose -f docker-compose.dev.yml up

setupDocker:
	make fileMode
	make create.env.file
	make upDockerDev

settingsWithoutDocker:
	make fileMode
	make create.env.file
	npm install 
	npx prisma generate 
	npx prisma migrate dev

upDev:
	npm run start:dev

setup:
	make settingsWithoutDocker
	make upDev

bash:
	docker exec -it ${CONTAINER_BACKEND} sh

.PHONY: up
up:
	npm start

