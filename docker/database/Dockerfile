FROM armbuild/alpine

RUN apk update && apk add postgresql

USER postgres
RUN initdb -E UTF8 -D '/var/lib/postgresql/data'
RUN postgres -D '/var/lib/postgresql/data'& sleep 1 &&\
createuser bot && createdb -O bot telegram && \
killall postgres
RUN sed -i -f '/var/lib/postgresql/data/pg_hba.conf' \
s/'127.0.0.1\/32'/'0.0.0.0\/0'/

EXPOSE 5432
CMD ["postgres", "-h", "0.0.0.0", "-p", "5432", "-D", "/var/lib/postgresql/data"]
