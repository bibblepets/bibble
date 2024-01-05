build:
	docker build -t bibble-kennel-api .

init:
	docker exec -it bibble-kennel-api sh -c ' npx ts-node data/initialiseData.ts'
	
run test:
	docker exec -it bibble-kennel-api sh -c "npm test"
