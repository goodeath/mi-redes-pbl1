FROM node:16.10.0
RUN apt-get update && apt-get install yarn -y
WORKDIR /home/app
COPY . /home/app/
RUN yarn install
RUN yarn global add ts-node
EXPOSE 9091/tcp
EXPOSE 9092/tcp
ENTRYPOINT ["yarn","dev"]
