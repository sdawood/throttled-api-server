# throttled-api-server



## Build & Test
Babel is used to support latest ES syntax. The transpilation level is configured using the babel-preset-env plugin, check `.babelrc` for details.

To build the API Server
  ```
  npm run build
  ```
  To run the test suite using `jest`
  ```
  npm test
  ```
  ```
   PASS  src/routes/users.spec.js
    GET /users
      ✓ responds with json containing a list of users (46ms)
      ✓ responds with 401 Unauthorized if Authorization token is empty string (14ms)
      ✓ responds with 401 Unauthorized if Authorization Header is empty string (5ms)
      ✓ responds with 429 Too Many Requests if client exceeds the configured limit (6ms)

  Test Suites: 1 passed, 1 total
  Tests:       4 passed, 4 total
  Snapshots:   0 total
  Time:        4.419s
  ```

## Server
  Environment variables should be set by the host environment, loading sensitive data in ecrypted form

  For practicality and for the sake of the reviewer, basic twilio trial account parameters are listed in .env file
  To start the server run
  
  ```
  npm run start
  ```
  
  
  The npm `start` script is using the .env file for demonstration purposes.
  ```
  "start": "export $(cat .env | xargs) && node ./bin/www"
  ```

  Alternatively, just use the startup script:

  ```
  ./bin/www
  ```

## Docker:
An apline based Dockerfile is included
```
FROM node:6.10-alpine
RUN apk update
RUN apk add --no-cache bash
WORKDIR /usr/apiserver
COPY package.json ./
RUN npm install --only=production --quiet
COPY . .
EXPOSE 8080

```
Also a docker-compose yaml file that allows for staged and parameterized containers build
```
base:
    build: .
    volumes:
        - .:/usr/apiserver

base-env:
    extends: base
    env_file: .env
    environment:
        - TWILIO_FROM_NUMBER=+61427128480

build:
    extends: base-env
    command: bash -c -e "
        npm run build"

start:
  extends: build
  ports:
      - "8080:8080"
  command: npm start

```

## Logging
While [morgan](npm.im/morgan) is configured, logging in a modern Cloud or PaaS environment is dictated by the hosting echo system.
For example, Kubernetes prefers logging to std in/out/error and redirecting those streams into CloudWatch logs (if running on AWS), etc...

## Endpoints
The API Server supports the following endpoints

#### List Users
```
GET /users HTTP/1.1
Host: localhost:8080
Authorization: Bearer:  X
```

#### Send SMS

```
POST /sms HTTP/1.1
Host: localhost:8080
Authorization: Bearer: X
Content-Type: application/json

{
	"to": "+614xxxxxxxx",
	"body": "Hello World"
}
```
## Build Targets
Currently the following target build environments are configured for babel-preset-env plugin
```
 "targets": {
   "node": 9.10
 }
```
In case this turns out to be not generous enough, more backward compatible babel transpilation targets would be added.

## Roadmap

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
