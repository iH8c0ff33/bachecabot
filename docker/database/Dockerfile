FROM alpine

RUN apk update && apk add postgresql
RUN mkdir -p '/var/lib/postgresql' && chown postgres:postgres \
'/var/lib/postgresql'

USER postgres
RUN initdb -E UTF8 -D '/var/lib/postgresql/data'
RUN postgres -D '/var/lib/postgresql/data'& sleep 1 &&\
createuser bot && createdb -O bot telegram && \
killall postgres
RUN sed -i s/'127.0.0.1\/32'/'0.0.0.0\/0'/ '/var/lib/postgresql/data/pg_hba.conf'

EXPOSE 5432
CMD ["postgres", "-h", "0.0.0.0", "-p", "5432", "-D", "/var/lib/postgresql/data"]
