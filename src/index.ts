import express from 'express';

import morganMiddleware from './middleware/morganMiddleware';
import headerAccessMiddleware from './middleware/headerAccessMiddleware';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import errorMiddleware from './middleware/errorMiddleware';

const app = express();

app.listen(8888, () => {
    console.log(`App Run at http://localhost:8888`);
});

app.get('/',(request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.send('hello')
})

// #=======================================================================================#
// #			                     add header or use cors                                #
// #=======================================================================================#
app.use(headerAccessMiddleware);
// #=======================================================================================#
// #			                        not Found middleware                               #
// #=======================================================================================#
app.use(notFoundMiddleware);
// #=======================================================================================#
// #			                           middleware                                      #
// #=======================================================================================#
app.use(errorMiddleware);


export default app;