import express from 'express';
const app = express();

app.listen(8888, () => {
    console.log(`App Run at http://localhost:8888`);
});

app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.send('hello')
})

export default app;