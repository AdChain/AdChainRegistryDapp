FROM node:8

EXPOSE 8000

ENV PORT 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

run rm -rf node_modules/
RUN npm install
ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
