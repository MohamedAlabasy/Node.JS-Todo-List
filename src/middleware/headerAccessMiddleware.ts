import { Request, Response, NextFunction } from 'express';

const headerAccess = (request: Request, response: Response, next: NextFunction) => {
    response.header("Access-Control-Allow-Origin", "*");//alow to any web side to connect to my server
    response.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS"); //for routs
    response.header("Access-Control-Allow-Header", "Content-Type,Authorization");
    next();
}
export default headerAccess;