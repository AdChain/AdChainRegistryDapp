FROM node:8

EXPOSE 8000

ENV PORT 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN npm install -g serve
ENTRYPOINT ["npm"]
CMD ["run start:dev"]
