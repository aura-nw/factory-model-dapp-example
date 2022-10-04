# Artaverse

In this readme are guided how to build artaverse backend site.  

Overview, artaverse backend site are created by Nestjs, what is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

---

## Folder Structure  
Main source code in the folder structure is the `/apps` folder.

 - `/apps/backend-service` The backend service contain mainly logic. It provide Swagger API to communicate with frontend.
 - `/apps/kms-api` The service provide functions to manage secret key and address pair, what is used to sign broadcast transaction. 
 - `/apps/mint-job` The service crawl mint NFT request from database then packed it to transaction and broadcasted to network (In this case it's Aura Network).
 - `/apps/random-pack` When mint-job service completed mint NFT, base on amount of NFT had created, this service will split them into pack randomly.
 - `/apps/sync-data` Instead of getting transaction data by query txHash in LCD API, i had crawl transaction history into database over horoscope (Aura third party used to support powerful export blockchain data) over websocket.
 - `/apps/websocket` The service provide websocket service used to push notification to user.
 - `/apps/time-job` I don't want distribute code, then instead of create procedure and trigger to update collection status, i create service to check condition then update it.

## Software stack
  
  |                |Required                          |Optional                         |
|----------------|-------------------------------|-----------------------------|
|`Store request to database`| [Redis (Queue & cache)](https://redis.io/) and [MySQL (Database)](https://www.mysql.com/)            |none            |
|`Stack and frameworks` |[NestJS (Server Framework)](https://nestjs.com), [NodeJS (System runtime)](https://nodejs.org), [Typescript](https://www.typescriptlang.org), [Express JS](https://expressjs.com),                 |none            |
|`Deployment and containerization`          |[Docker](https://www.docker.com/) |[Kubernetes](https://kubernetes.io/), Github Action||

## Installation  
  
```bash  
$ npm i
```  

## Configuration  

Before starting the services, please create the .env file. You can base on file .env.example then create your enviroment file.The root source i setup in nest-cli.json ( Default it is backend-service ). When you need start in locally the service what you wanted, just modified. 

## Usage 
### With Docker locally
```bash
$ docker-compose up -d
```

### Without Docker locally 
MySQL, Redis all need to be started first as our microservices need to connect to them. 
```bash
$ npm run start:dev
```
