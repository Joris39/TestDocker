FROM mysql:8.0
ENV MYSQL_ROOT_PASSWORD=test
ENV MYSQL_DATABASE=taskdb
COPY ./init.sql /docker-entrypoint-initdb.d/
