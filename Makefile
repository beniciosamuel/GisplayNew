include .env

.PHONY: up

up:
		docker-compose up -docker

.PHONY: down

down: 
		docker-compose down

.PHONY: logs

logs:
		docker-compose logs -f