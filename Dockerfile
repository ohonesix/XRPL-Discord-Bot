FROM node:16.6-stretch-slim

# Env
ARG TIME_ZONE=Europe/London

# Create Directory for the Container
WORKDIR /usr/src/app

# Copy setting files to the work directory
COPY package.json .
COPY tsconfig.json .
COPY tslint.json .

# Install packages
RUN npm install

# Copy all other source code to work directory
COPY src/. /usr/src/app/src/

RUN npm run build

# Start includes tsc build
CMD [ "npm", "run", "host" ]
EXPOSE 5880