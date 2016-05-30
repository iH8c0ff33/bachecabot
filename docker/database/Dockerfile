FROM armbuild/alpine

RUN apk update && apk add postgresql

USER postgres
RUN initdb -E UTF8 -D '/var/lib/postgresql/data'
RUN postgres -D '/var/lib/postgresql/data'& \
createuser bot && createdb -O bot telegram && \
killall postgres

EXPOSE 5432
CMD ["postgres", "-h", "0.0.0.0", "-p", "5432", "-D", "/var/lib/postgresql/data"]
