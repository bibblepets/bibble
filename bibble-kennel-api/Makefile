build:
	docker build -t bibble-kennel-api .

checkstyle:
	tsc
	npx eslint .

init:
	docker exec -it bibble-kennel-api sh -c ' npx ts-node developer/init.ts'
	
run test:
	docker exec -it bibble-kennel-api sh -c "npm test"
