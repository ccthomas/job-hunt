# Job Hunt

## Tutorials
1.  [Hello World Tutorial](https://dionmunk.com/posts/2020/04/22/hello-world-in-a-python-3-docker-container)
1. [Flask in PyCharm](https://medium.com/@mushtaque87/flask-in-pycharm-community-edition-c0f68400d91e)

## Getting Started
* Install Python 3
* Install Docker
* PgAdmin (Recommended)

### Setup

Install Requirements
```commandline
pip install -r requirements.txt
```

### Usage

1. Run Database

   The following will run Postgres Docker Container in background.
   ```commandline
   docker-compose up -d
   ```

1. Build Project
    ```commandline
    docker build -t python-hello-world . 
    ```

2. Run Project
    ```commandline
     docker run python-hello-world  
    ```