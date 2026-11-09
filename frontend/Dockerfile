FROM node:22-alpine AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_USE_MOCK=false
ENV VITE_API_BASE_URL=/api/v1
RUN npm run build
FROM nginx:alpine
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
