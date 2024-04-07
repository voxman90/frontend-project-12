lint:
	make -C frontend lint

install:
	npm install

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	make start-backend

develop:
	make start-backend & make start-frontend

build:
	npm run build
