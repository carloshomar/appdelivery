FROM openresty/openresty:1.27.1.2-0-alpine

# Instala o curl
RUN apt-get update && apt-get install -y curl
RUN apt-get install nano -y

# Baixa o lua-resty-jwt do GitHub
RUN curl -L https://github.com/SkyLothar/lua-resty-jwt/releases/download/v0.1.11/lua-resty-jwt-0.1.11.tar.gz | tar xvz -C /tmp \
    && mkdir -p /usr/local/openresty/site/lualib/resty/ \
    && mv /tmp/lua-resty-jwt-0.1.11/lib/resty/* /usr/local/openresty/site/lualib/resty/

# Copia o script Lua
COPY jwt-auth.lua /etc/nginx/jwt-auth.lua

# Copia o seu arquivo de configuração Nginx
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

ARG JWT_SECRET
RUN sh -c 'echo "$(echo $JWT_SECRET)" > /etc/nginx/jwt-secret-file'
