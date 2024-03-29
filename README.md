<h1 align="center"> Node.JS Todo List </h1>

## Description:

Simple Task Management Tool has the following Lists ( TODO – IN progress – Under review – Rework - Completed )
which can be Create Read Update Delete and move Task from List to another List.

## To run this project

`Step 1` : To use this project must install [Node.js](https://nodejs.org/en/) and [Mongodb](https://www.mongodb.com/try/download/community) Then Download the source code

```
git clone https://github.com/MohamedAlabasy/Node.JS-Todo-List.git
```

`Step 2` : Enter the project file then install package

```
npm i
```

<h3 align="center">To help you understand the project</h3>

## Folder Structure

```bash
├── src
│   ├── controllers
│   │   ├── authController.ts => `for handel authentication function`
│   │   └── todoListController.ts => `for handel TODO list function`
│   │
│   │
│   ├── middleware
│   │   ├── morganMiddleware.ts => `for log url, method and statue of requests`
│   │   │── notFoundMiddleware.ts => `for not Found Middleware`
│   │   │── headerAccess.ts => `for handel Access to node Middleware`
│   │   └── errorMiddleware.ts => `for error Middleware`
│   │
│   │
│   ├── models
│   │   ├── emailVerificationSchema.ts => `for handel email verification Schema`
│   │   │── resetPasswordSchema.ts => `for handel reset password Schema`
│   │   │── todoListSchema.ts => `for handel todo list Schema`
│   │   └── userSchema.ts => `for handel user Schema`
│   │
│   │
│   ├── routes
│   │   ├── api
│   │   │   │── authRouter.ts => `for handel authentication route`
│   │   │   │── todoListRouter.ts => `for handel TODO List route`
│   │   └── routes.ts => `import all routes and exports it to index`
│   │
│   │
│   ├── tests => `for testing purposes`
│   │   ├── helpers
│   │   │   └── reporter.ts
│   │   └── indexSpec.ts => `for testing endpoint api`
│   │
│   │
│   ├── utilities
│   │   │── checkTokens.ts => `for Request check Tokens`
│   │   │── emailVerification.ts => `for send email message`
│   │   │── emailMessagesDesign.ts => `for email messages design ( HTML & CSS )`
│   │   └── validateRequest.ts => `for validate Request`
│   │
│   │
│   └── index.ts => `to run the server`
└──
```

## DataBase ERD

<p align="center">
   <img src="https://user-images.githubusercontent.com/93389016/178179355-c70b3daf-ddd5-438d-9dee-2bd576f0a66c.jpg" alt="Build Status">
</p>

`Step 3` : To run project

```
node run start
```

`Step 4` : Open the browser and click : [http://localhost:8080](http://localhost:8080)

`Step 5` : Open [postman](https://www.postman.com/downloads/) and import : [API Collation](https://github.com/MohamedAlabasy/Node.JS-Todo-List/blob/main/api_collection.json) You will find it in the project file.

`Step 6` : Download front-end React source code :

<h3 align="center">https://github.com/MohamedAlabasy/React-Todo-List</h3>
<hr>

### After completing the registration as a new user, you must go to your email to confirm the email through the code sent to you

<p align="center">
   <img src="https://user-images.githubusercontent.com/93389016/178178593-c58455de-ad7f-42fe-9cef-d97c96e1d095.png" alt="Build Status">
</p>

<p align="center">
   <img src="https://user-images.githubusercontent.com/93389016/178178804-375d086a-eca2-4d43-9485-06e26b9281fe.png" alt="Build Status">
</p>
<hr>
To run eslint to check error

```
npm run lint
```

To run eslint and auto fixed error

```
npm run lint:f
```

To compile the TS code

```
npm run build
```

To run the JS code

```
node dist/index.js
```

<hr>

Here are the [Command](https://github.com/MohamedAlabasy/Node.JS-Todo-List/blob/main/command.txt) that were used in the project, You will find it in the project file.
