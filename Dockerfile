FROM node:alpine as app-build
COPY preisfinder-app /src
WORKDIR /src
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=app-build /src/dist /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/conf.d/default.conf