import { Request, Response, NextFunction } from 'express';


import validateRequest from '../utilities/validateRequest';
import User from '../models/userSchema';

const unReturnedData = "-createdAt -updatedAt -__v";

export const login = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    response.send('hello')
}



