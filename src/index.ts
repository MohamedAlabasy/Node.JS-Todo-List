import express from 'express';
import 'dotenv/config'
import body_parser from 'body-parser';


import morganMiddleware from './middleware/morganMiddleware';
import headerAccessMiddleware from './middleware/headerAccessMiddleware';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import errorMiddleware from './middleware/errorMiddleware';


import routes from './routes/routes';

const app = express();

app.listen(8888, () => {
    console.log(`App Run at http://localhost:8888`);
});
// #=======================================================================================#
// #			                            body_parse                                     #
// #=======================================================================================#
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
// #=======================================================================================#
// #			                     add header or use cors                                #
// #=======================================================================================#
app.use(headerAccessMiddleware);
// #=======================================================================================#
// #			                            router                                         #
// #=======================================================================================#
app.use('', morganMiddleware, routes);
// #=======================================================================================#
// #			                        not Found middleware                               #
// #=======================================================================================#
app.use(notFoundMiddleware);
// #=======================================================================================#
// #			                           middleware                                      #
// #=======================================================================================#
app.use(errorMiddleware);


export default app;