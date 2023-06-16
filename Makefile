DC_FILE = ./docker-compose.yml
HOME = /home/bentowski
DOCKER_COMPOSE = docker-compose -p transcendence_network --file $(DC_FILE)

TEST=`docker volume ls -q`

all:
	cp $(HOME)/.transcendenceEnv ./backend/nest
	mv ./backend/nest/.transcendenceEnv backend/nest/.env
	mkdir -p ./frontend/volume
	mkdir -p ./backend/volume
	mkdir -p ./data/pgadmin
	mkdir -p ./data/postgresdb
	$(DOCKER_COMPOSE) up -d --build

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

clear_volume: down
	docker volume rm $(TEST)

clear: clear_volume
	docker system prune -af

re: clear all
