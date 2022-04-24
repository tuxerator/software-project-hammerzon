/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information folgt später im Semester.
 */

import request from 'supertest';
import app from '../src/app';

describe('GET /api', () => {
    it('should return 200 OK', () => {
        return request(app)
            .get('/api')
            .expect(200);
    });
});
