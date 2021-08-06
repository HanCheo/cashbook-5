# Woowa Money Diary

<p align="center">
  <a href="http://13.125.105.157">
<img width="100%" alt="woowa-money-diary" src="https://user-images.githubusercontent.com/38929712/128442680-e9b74172-a19e-4278-8688-97eeb7e1c2b1.png">
 </a>
</p>

<br>

# Demo
<p align="center">
 <a href="http://13.125.105.157">Welcome to Woowa Money Diary</a>
</p>

<br>

# 팀원

- 손지호 [@peanut-lover](https://github.com/peanut-lover)
- 김한철 [@hancheo](https://github.com/HanCheo)   

<br>

# Stack

<center>


<img src="https://img.shields.io/badge/-Typescript-4075bb?&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/-Babel-F9DC3E?&logo=Babel&logoColor=white"> <img src="https://img.shields.io/badge/-Webpack-8DD6F9?&logo=Webpack&logoColor=black"> <img src="https://img.shields.io/badge/-MySQL-4479A1?&logo=MySQL&logoColor=white"> <img src="https://img.shields.io/badge/-Amazon AWS-232F3E?&logo=Amazon AWS&logoColor=white"> <img src="https://img.shields.io/badge/-Express-000000?&logo=Express&logoColor=white"> <img src="https://img.shields.io/badge/-Prettier-F7B93E?&logo=Prettier&logoColor=white"> <img src="https://img.shields.io/badge/-ESLint-4B32C3?&logo=ESLint&logoColor=white"> <img src="https://img.shields.io/badge/-Sass-CC6699?&logo=Sass&logoColor=white"> <img src="https://img.shields.io/badge/-JWT-000000?&logo=JSONWebTokens&logoColor=white"> <img src="https://img.shields.io/badge/-Sequelize-52B0E7?&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/-PM2-2B037A?&logo=PM2&logoColor=white">


</center>

<br>

# 프로젝트 구조

```
Client

├── src
│    ├── api 
│    ├── assets      - Svg, Image.. Public Folder
│    ├── components 
│    ├── core        - Router & Parent Component
│    ├── interfaces  - Types
│    ├── models      - Observer Model
│    ├── pages       - Route Page
│    ├── utils       - Custom Common Function
│    ├── global.scss
│    ├── index.html
│    ├── nomalize.css
│    ├── index.ts
│    └── app.ts
├── balel.config.json
├── package.json
├── tsconfig.json
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```


```
Server
.
├── dist
├── src
│    ├── config       - Set Enviroment Variable
│    ├── controllers  - API와 직접적인 연동
│    ├── db           - Sequelize Mysql Connection
│    ├── dto          - Response Data Types
│    ├── loaders      - app Loaders
│    ├── mapper       - Response Data to DTO Type
│    ├── middleware   - Custom Middleware
│    ├── models       - Data Tables
│    ├── oauth        - Github Oauth
│    ├── repositories - Exec Get DB Data 
│    ├── router       - API Router
│    ├── services     - Business Logic
│    ├── types        - d.ts Files
│    ├── utils        - Custom Common Function
│    └── app.ts
├── process.json      - Pm2 Config & Environment Variable
├── package.json
├── webpack.config.js
└── tsconfig.json
     

```


# Start 
```javascript
  // Set Environment Variables
  // PM2 : process.template.json -> process.json

    "env": {
      "PORT":"",
      "GIT_CLIENT_ID":"",
      "GIT_CLIENT_SECRET":"",
      "CORS_ALLOW_URL":"", //client_URL
      "JWT_SECRET":"",
      "JWT_EXPIRESIN":"",
      "SEQUELIZE_DBNAME":"",
      "SEQUELIZE_DBUSER":"",
      "SEQUELIZE_DBPASSWORD":"",
      "SEQUELIZE_DBHOST":"",
      "SEQUELIZE_DBPORT":"",
      "SEQUELIZE_DBDIALECT":"mysql"
    }

  //dotenv 
  //make .env file in root of server folder

      PORT=
      GIT_CLIENT_ID=
      GIT_CLIENT_SECRET=
      CORS_ALLOW_URL=
      JWT_SECRET=
      JWT_EXPIRESIN=
      SEQUELIZE_DBNAME=
      SEQUELIZE_DBUSER=
      SEQUELIZE_DBPASSWORD=
      SEQUELIZE_DBHOST=
      SEQUELIZE_DBPORT=
      SEQUELIZE_DBDIALECT=mysql
  
```


```cmd
  cd ./server
  npm install
  npm run start

  cd ../client
  npm install
  npm run start


  -> http://localhost:8081/
```
