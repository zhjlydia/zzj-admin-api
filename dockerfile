FROM node:lts AS deps
RUN set -ex && \
    npm set progress=false && \
    npm config set registry https://registry.npm.taobao.org
WORKDIR /var/app

# -- 编译项目 --
FROM deps AS compiler
COPY package*.json tsconfig*.json ./
COPY src ./src
COPY core ./core
RUN set -ex && \
    npm i --ignore-scripts && \
    npm run build

# -- 安装生产依赖 --
FROM deps AS installer
COPY package*.json ./
RUN npm i --production

# -- runtime --
FROM node:lts-slim
LABEL maintainer="zzj <zhjlydia@foxmail.com>"
WORKDIR /var/app
COPY --from=installer /var/app/node_modules ./node_modules
COPY --from=installer /var/app/package*.json ./
COPY --from=compiler /var/app/dist ./dist

ENV TZ "Asia/Shanghai"

EXPOSE 3000
CMD ["node", "dist/src/main"]