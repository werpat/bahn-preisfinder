Basic webapp for comparing prices of Deutsche Bahn connections using DB API used by their frontend

# RUN
single line auto-removing docker container to host local with DB-API Proxy
```docker run -p 8080:80 --rm -it $(docker build -q .)```

# TODO
errorhandling missing