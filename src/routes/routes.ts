import express from 'express';

import auth from './api/authRouter';
import todo from './api/todoListRouter';


const routes = express.Router()

routes.use('/user', auth);
routes.use('/todo', todo);


export default routes;