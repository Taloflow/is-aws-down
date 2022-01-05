# EC2 Bezos Quote Generator

Random quotes from his book “Invent and Wander: The Collected Writings of Jeff Bezos”

## Dev setup

```bash 
# install poetry and then
poetry shell
poetry install

source set_pythonpath.bash

# Start API
poetry run uvicorn bezos_quote_generator.api:app --reload
```


## Deploy to an AWS EC2 server

```bash
# Start an NGINX reverse proxy server with ACME companion to generate letsencrypt certificates

# reverse proxy
sudo docker run --detach \
    --name nginx-proxy \
    --publish 80:80 \
    --publish 443:443 \
    --volume certs:/etc/nginx/certs \
    --volume vhost:/etc/nginx/vhost.d \
    --volume html:/usr/share/nginx/html \
    --volume /var/run/docker.sock:/tmp/docker.sock:ro \
    --restart unless-stopped \
    nginxproxy/nginx-proxy

# ACME companion for letsencrypt
sudo docker run --detach \
    --name nginx-proxy-acme \
    --volumes-from nginx-proxy \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    --volume acme:/etc/acme.sh \
    --env "DEFAULT_EMAIL=youremail@taloflow.ai" \
    nginxproxy/acme-companion


# clone the repo to an EC2 server and then build docker images.

# export python requirements
poetry export -f requirements.txt --output requirements.txt

# Build docker image for API
# Update ENV variables in api.DockerFile
# The ENV variables VIRTUAL_HOST and LETSENCRYPT_HOST should point to the domain name for the API. 
sudo docker build -f bezos_quote_generator.DockerFile -t bezos_quote_generator .

# Start API server
sudo docker run -d --name bezos_quote_generator -p :80 --restart unless-stopped bezos_quote_generator
```

## API URL
https://\<EC2 IP address\>/quote

The response is truncated to 140 chars. Use /quote?trim=false to get full paragraph.
```
"THE FIRST FOUR and a half years of our journey have yielded some amazing results: we’ve now served over seventeen million customers in over 150 countries and built the leading global e-commerce brand and platform."
```