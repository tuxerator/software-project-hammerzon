import request from 'supertest';
import { appInstance } from '../src/serverTest';

describe('GET /random-url', () => {

    it('should return 200 to accomodate angular', () => {
        return request(appInstance)
          .get('/random-url')
          .expect(401);
    });
});

