#-onbuild
FROM node:8

EXPOSE 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
ENTRYPOINT ["npm"]
CMD ["start"]
