# Task Management App using DynamoDB Local, Express and React

Dockerized implementation of a web application done with DynamoDB Local, Express and React

## Running This Project Locally

1. Make sure to [install Docker Compose or Docker Desktop in your local machine](https://docs.docker.com/compose/install/) 
2. Clone or fork this repository. 
3. Run 
```
docker compose build && docker compose up -d 
```
to build the images and run the services in a detached mode.
4. Make sure all containers are running. Run 
```
docker ps
``` 
to list running containers. 
5. [The web app is http://localhost](http://localhost) 
6. The API end points are at [http://localhost:3000](http://localhost:3000) and you can check the [documentation here](http://localhost:3000/docs)
7. Run 
```
docker compose down --remove-orphans
```
to stop the Docker containers or open your Docker Desktop application and stop the running containers from there. 

