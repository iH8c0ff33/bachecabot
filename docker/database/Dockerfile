FROM armbuild/alpine

RUN apk update && apk add postgresql

USER postgres
RUN initdb -E UTF8 -D '/var/lib/postgresql/data'

EXPOSE 5432
CMD ["postgres", "-h", "0.0.0.0", "-p", "5432", "-D", "/var/lib/postgresql/data"]
