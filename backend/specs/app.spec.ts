import request from 'supertest';
import app from '../src/app';

describe('GET /random-url', () => {
    it('should return 200 to accomodate angular', () => {
        return request(app)
            .get('/random-url')
            .expect(200);
    });
});
