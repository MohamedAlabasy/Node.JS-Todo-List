import supertest, { SuperTest, Test, Response } from 'supertest';
import app from '../index'


const request: SuperTest<Test> = supertest(app);

describe('check Endpoint API', (): void => {
    describe('check user Endpoint', (): void => {
        it('POST /user/register', async (): Promise<void> => {
            const response: Response = await request.post('/user/register')
                .send({
                    "name": "Mohamed Alabasy",
                    "email": "eng.mohamed.alabasy@gmail.com",
                    "password": "12346789+Aa"
                })
            expect(response.status).toBe(200);
        });

        it('POST /user/login', async (): Promise<void> => {
            const response: Response = await request.post('/user/login')
                .send({
                    "email": "eng.mohamed.alabasy@gmail.com",
                    "password": "12346789+Aa"
                });
            expect(response.status).toBe(200);
        });

        it('GET /user', async (): Promise<void> => {
            const response: Response = await request.get('/user')
                .send({
                    "_id": 0
                });
            expect(response.status).toBe(200);
        });

        it('POST /user/checkEmail', async (): Promise<void> => {
            const response: Response = await request.post('/user/checkEmail')
                .send({
                    "email": "eng.mohamed.alabasy@gmail.com"
                })
            expect(response.status).toBe(200);
        });

        it('POST /user/logout', async (): Promise<void> => {
            const response: Response = await request.post('/user/logout')
                .send({
                    "_id": 0
                })
            expect(response.status).toBe(200);
        });
    });

    describe('check wrong login Endpoint', (): void => {
        it('POST /loginAnyThing', async (): Promise<void> => {
            const response: Response = await request.post('/loginAnyThing');
            expect(response.status).toBe(404);
        });
    });


    describe('check TODO Endpoint', (): void => {
        it('POST /todo', async (): Promise<void> => {
            const response: Response = await request.post('/todo')
                .send({
                    "title": "finish project",
                    "description": "we must finish your project before the holidays",
                    "priority": "high",
                    "status": "in_progress",
                    "start_date": "2022-07-10",
                    "end_date": "2022-07-15",
                    "user": 0
                })
            expect(response.status).toBe(200);
        });
        it('POST /todo', async (): Promise<void> => {
            const response: Response = await request.post('/todo')
                .send({
                    "title": "take rest",
                    "description": "i must take a rest at 6 pm",
                    "priority": "medium",
                    "status": "under_review",
                    "start_date": "2022-07-03",
                    "end_date": "2022-07-20",
                    "user": 0
                })
            expect(response.status).toBe(200);
        });
        it('POST /todo', async (): Promise<void> => {
            const response: Response = await request.post('/todo')
                .send({
                    "title": "sleep well",
                    "description": "I should sleep will",
                    "priority": "low",
                    "status": "rework",
                    "start_date": "2022-07-01",
                    "end_date": "2022-07-03",
                    "user": 0
                })
            expect(response.status).toBe(200);
        });
        it('POST /todo', async (): Promise<void> => {
            const response: Response = await request.post('/todo')
                .send({
                    "title": "finish TS Task",
                    "description": "must finish Ts Task before the start working",
                    "priority": "low",
                    "status": "completed",
                    "start_date": "2022-07-05",
                    "end_date": "2022-07-15",
                    "user": 0
                })
            expect(response.status).toBe(200);
        });

        it('GET /todo/all', async (): Promise<void> => {
            const response: Response = await request.get('/todo/all')
            expect(response.status).toBe(200);
        });
        it('GET /todo/inProgress', async (): Promise<void> => {
            const response: Response = await request.get('/todo/all')
            expect(response.status).toBe(200);
        });
        it('GET /todo/underReview', async (): Promise<void> => {
            const response: Response = await request.get('/todo/all')
            expect(response.status).toBe(200);
        });
        it('GET /todo/rework', async (): Promise<void> => {
            const response: Response = await request.get('/todo/all')
            expect(response.status).toBe(200);
        });
        it('GET /todo/completed', async (): Promise<void> => {
            const response: Response = await request.get('/todo/all')
            expect(response.status).toBe(200);
        });

        it('GET /todo/', async (): Promise<void> => {
            const response: Response = await request.get('/todo')
                .send({
                    "_id": 0
                });
            expect(response.status).toBe(200);
        });

        it('PUT /todo', async (): Promise<void> => {
            const response: Response = await request.put('/todo')
                .send({
                    "title": "finish task",
                    "description": "we must finish your project before the holidays",
                    "priority": "medium",
                    "status": "completed",
                    "start_date": "2022-07-05",
                    "end_date": "2022-07-11",
                })
            expect(response.status).toBe(200);
        });

        it('DELETE /todo/', async (): Promise<void> => {
            const response: Response = await request.delete('/todo')
                .send({
                    "_id": 0
                });
            expect(response.status).toBe(200);
        });
    });
});

