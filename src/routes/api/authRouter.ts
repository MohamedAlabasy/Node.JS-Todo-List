import express, { Router } from 'express';
import { body, check } from 'express-validator';

import { login } from '../../controllers/authController';
import User from '../../models/userSchema';



const auth: Router = Router()


auth.get('', login);

export default auth;