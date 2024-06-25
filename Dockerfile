# Use a imagem base do Nginx
FROM nginx:latest

# Remova o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie os arquivos da sua aplicação para o diretório de trabalho do Nginx
COPY ./ /usr/share/nginx/html/

# Exponha a porta 80 para tráfego HTTP
EXPOSE 80