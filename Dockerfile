# 1단계: Vite React 앱 빌드
FROM node:22-alpine AS build
WORKDIR /app

# 빌드 인자로 환경 변수 받기
ARG VITE_GITHUB_TOKEN
ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite 빌드 결과(dist)를 Nginx 기본 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
