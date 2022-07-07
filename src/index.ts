import express from 'express';
const app = express();
app.listen(process.env.PORT || 8888, () => {
    console.log(`App Run at http://locahost:8888`);
});



export default app;