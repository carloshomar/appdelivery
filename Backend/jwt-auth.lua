local jwt = require "resty.jwt"
local validators = require "resty.jwt-validators"


local secret_file_path = "/etc/nginx/jwt-secret-file"

-- Lê a chave secret do arquivo
local secret_file = io.open(secret_file_path, "r")
local secret = secret_file and secret_file:read("*a")
secret_file:close()

-- Remove possíveis quebras de linha ou espaços em branco extras
secret = secret and secret:gsub("%s+", "")

-- Se a chave secreta não estiver definida, retorna HTTP_INTERNAL_SERVER_ERROR
if not secret or secret == "" then
    ngx.status = ngx.HTTP_INTERNAL_SERVER_ERROR
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.say('{"error": "JWT_SECRET not set in server."}')
    ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
end



-- Verifica se o método de requisição não é OPTIONS e a URI não contém "login"
if ngx.var.request_method ~= "OPTIONS" and not string.match(ngx.var.uri, "login") then
    local jwtToken = ngx.var.http_Authorization

    -- Se o token JWT não estiver presente, retorna HTTP_UNAUTHORIZED
    if jwtToken == nil then
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.header.content_type = "application/json; charset=utf-8"
        ngx.say('{"error": "HTTP_UNAUTHORIZED"}')
        ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end

    -- Se a chave secreta não estiver definida, retorna HTTP_INTERNAL_SERVER_ERROR
    if not secret then
        ngx.status = ngx.HTTP_INTERNAL_SERVER_ERROR
        ngx.header.content_type = "application/json; charset=utf-8"
        ngx.say('{"error": "JWT_SECRET not set"}')
        ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    end

    -- Configuração das reivindicações JWT a serem verificadas
    local claim_spec = {
        exp = validators.is_not_expired() -- Verifica a expiração do token
    }

    -- Verifica o token JWT com a chave secreta e as reivindicações especificadas
    local jwt_obj = jwt:load_jwt(jwtToken)
    local verified = jwt:verify_jwt_obj(secret, jwt_obj)

    -- Se o token JWT não for válido, retorna HTTP_UNAUTHORIZED
    if not verified then
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.header.content_type = "application/json; charset=utf-8"
        ngx.say(verified)
        ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end
end
