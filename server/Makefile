build:
	docker build -t server:bibble .

init:
	docker exec -it server sh -c ' npx ts-node data/initialiseData.ts'