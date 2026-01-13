FROM	nginx:latest

#	Install nginx
RUN		apt update -y && apt upgrade -y && apt install -y openssl

#	Setup SSL key
RUN		mkdir -p /etc/nginx/ssl
RUN		openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj "/C=FR/L=Angouleme/O=42/OU=42/CN=pong.com"

#	Create directory and copy nginx config
RUN		mkdir -p /var/run/nginx
COPY	./config/default.conf /etc/nginx/conf.d

#	Copy html contents
COPY	./pages /usr/share/nginx/html

#	Set port 443 for internet
EXPOSE	443

#	Launch NGINX in the foreground (necessary in containers)
CMD		["nginx", "-g", "daemon off;"]
