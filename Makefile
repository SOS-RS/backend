dev:
	docker-compose -f docker-compose.dev.yml up -d --build
	docker logs -f sos-rs-api

seed:
	docker cp prisma/dev_dump.sql sos-rs-db:/tmp/dev_dump.sql
	docker exec -i sos-rs-db psql -U root -d sos_rs -f /tmp/dev_dump.sql

clean-all:
	 docker rm -f $$(docker ps -aq)   

log-api:
	docker logs -f sos-rs-api

log-db:
	docker logs -f sos-rs-db