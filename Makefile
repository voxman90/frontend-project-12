lint:
	make -C frontend lint

install:
	npm install

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	npx start-server -s ./frontend/build

build:
	npm run build
