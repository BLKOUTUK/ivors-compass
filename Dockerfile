FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Serve with lightweight static server
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing — the app's routes (src/App.tsx) serve index.html; unknown paths get the same page
# with a real 404 status (SEO plan K2, 11 Oct 2026). Keep the route list in step with App.tsx.
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    if ($host = "compass.blkoutuk.cloud") { return 301 https://compass.blkoutuk.com$request_uri; } \
    absolute_redirect off; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
    location = / { \
        try_files /index.html =404; \
    } \
    location ~ ^/(claim|claim/gift|waitlist|unlock|welcome|compass|compass/(convergence|cards|film|journal|mood|workshops|sunroom|progress|about|crisis|life-of-ivor|record|meditation/[^/]+))/?$ { \
        try_files /index.html =404; \
    } \
    error_page 404 /index.html; \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|mp3|mp4)$ { \
        expires 30d; \
        add_header Cache-Control "public, immutable"; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
