# For local test only
FROM nginx:alpine
COPY dist/playground /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d
COPY nginx/key.pem /etc/nginx/conf.d
COPY nginx/certificate.pem /etc/nginx/conf.d
