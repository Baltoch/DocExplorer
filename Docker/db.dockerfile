FROM mysql:8.3.0

COPY ./Database/createdb.sql /docker-entrypoint-initdb.d/