FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY public/ /usr/share/nginx/html/

RUN echo 'events {' > /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    log_format main '"'"'$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"'"'"';' >> /etc/nginx/nginx.conf && \
    echo '    access_log /var/log/nginx/access.log main;' >> /etc/nginx/nginx.conf && \
    echo '    error_log /var/log/nginx/error.log warn;' >> /etc/nginx/nginx.conf && \
    echo '    sendfile on;' >> /etc/nginx/nginx.conf && \
    echo '    tcp_nopush on;' >> /etc/nginx/nginx.conf && \
    echo '    tcp_nodelay on;' >> /etc/nginx/nginx.conf && \
    echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf && \
    echo '    gzip on;' >> /etc/nginx/nginx.conf && \
    echo '    gzip_vary on;' >> /etc/nginx/nginx.conf && \
    echo '    gzip_min_length 1024;' >> /etc/nginx/nginx.conf && \
    echo '    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;' >> /etc/nginx/nginx.conf && \
    echo '    server {' >> /etc/nginx/nginx.conf && \
    echo '        listen 80;' >> /etc/nginx/nginx.conf && \
    echo '        server_name _;' >> /etc/nginx/nginx.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        index index.html;' >> /etc/nginx/nginx.conf && \
    echo '        add_header X-Frame-Options "SAMEORIGIN" always;' >> /etc/nginx/nginx.conf && \
    echo '        add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/nginx.conf && \
    echo '        add_header X-XSS-Protection "1; mode=block" always;' >> /etc/nginx/nginx.conf && \
    echo '        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp3|mp4)$ {' >> /etc/nginx/nginx.conf && \
    echo '            expires 30d;' >> /etc/nginx/nginx.conf && \
    echo '            add_header Cache-Control "public, no-transform";' >> /etc/nginx/nginx.conf && \
    echo '            access_log off;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location ~* \.html$ {' >> /etc/nginx/nginx.conf && \
    echo '            expires 1h;' >> /etc/nginx/nginx.conf && \
    echo '            add_header Cache-Control "public, must-revalidate";' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location /game {' >> /etc/nginx/nginx.conf && \
    echo '            try_files /game.html =404;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location /spectator {' >> /etc/nginx/nginx.conf && \
    echo '            try_files /spectator.html =404;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location / {' >> /etc/nginx/nginx.conf && \
    echo '            try_files $uri $uri/ /index.html;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location /health {' >> /etc/nginx/nginx.conf && \
    echo '            access_log off;' >> /etc/nginx/nginx.conf && \
    echo '            return 200 "healthy\n";' >> /etc/nginx/nginx.conf && \
    echo '            add_header Content-Type text/plain;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
