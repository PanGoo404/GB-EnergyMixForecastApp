import request from 'supertest';
import { app } from '../app';
import { randomInt } from 'node:crypto';

describe('TEST: API Integration', () => {

    //TEST1//
    it('GET /api/energy-mix => 200:JSON', async () => {
        const result = await request(app).get('/api/energy-mix');

        expect(result.status).toBe(200);
        expect(result.header['content-type']).toMatch(/json/);
    });
    //TEST1*/

    it('GET /api/energy-mix => Data for Today-DayAfter', async () => {
        const result = await request(app).get('/api/energy-mix');

        expect(result.body).toHaveProperty('day0');
        expect(result.body).toHaveProperty('day1');
        expect(result.body).toHaveProperty('day2');

    });

    it('GET /api/energy-mix => Struct [{fuel,perc}]', async () => {
        const result = await request(app).get('/api/energy-mix');
        if(result.body.day0.length>0){
            const bit = result.body.day0[0];
            expect(bit).toHaveProperty('fuel')
            expect(bit).toHaveProperty('perc')
        }

    });

    it('GET Non Existant EndPoint => 404', async () => {
        const result = await request(app).get('/api/non-existant');

        expect(result.status).toBe(404);

    });

})