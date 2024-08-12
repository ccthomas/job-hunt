FROM python:3.8-slim-buster

ADD hello-world.py /

CMD [ "python", "./hello-world.py" ]