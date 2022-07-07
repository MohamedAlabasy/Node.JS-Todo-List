import express, { Router } from 'express';


const auth: Router = Router()


auth.get('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.send('hello')
})

export default auth;