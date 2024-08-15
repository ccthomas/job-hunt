# Job Hunt

Job Hunt is a Demo Application for assiting with an individuals job search, by assiting with the management of applications in flight.

From a development persepctive, I treated this app simialr to a Proof of Concept (PoC). I cut many cornors and focued more on the delivery of features.

## Tutorials
1.  [Hello World Tutorial](https://dionmunk.com/posts/2020/04/22/hello-world-in-a-python-3-docker-container)
1. [Flask in PyCharm](https://medium.com/@mushtaque87/flask-in-pycharm-community-edition-c0f68400d91e)

## Getting Started
* Install Python 3
* Install Docker
* PgAdmin (Recommended)

### Usage

1. Run Project

   The following will run Postgres Docker Container in background.
   ```commandline
   docker-compose --env-file .env up -d  
   ```

2. Create Tabless
    The Table creation is not automated at this time.
    Instead, you will need to manually connect to the DB and run the sql scripts in order.

3. Rebuild Project (if neeeded)
    ```commandline
    docker compose up -d --no-deps --build <service>
    ```
