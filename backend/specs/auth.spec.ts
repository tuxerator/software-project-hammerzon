import AuthController from '../src/Controller/auth';
import request from 'supertest';
import app from '../src/app';
import { db } from '../src/Controller/mongoDB';
import { TestData } from './testdata';
import bcrypt from 'bcrypt';

describe('authentication', () => {
    let authController : AuthController;
    const testdata = new TestData();
    const user = testdata.user;
    beforeAll(async () => {
     
    });
    beforeEach(async () => {
        await db.User.deleteMany({});
        authController = new AuthController();
        // clear all users from the database before tests are run
        
    });

    it('should add a new user upon registration', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(
                user
            )
            .expect(201);
        expect(response.body.code)
          .withContext('status response code')
          .toBe(201);
        expect(response.body.message)
          .withContext('status response message')
          .toMatch(/registered/);
          
        const dbEntry = await db.UserTest.find({});

        expect(dbEntry)
          .withContext('created user in database')
          .toHaveSize(1);
        expect(bcrypt.compareSync(user.password, dbEntry[0].password as string))
          .withContext('password properly hashed')
          .toBe(true);
    });


    afterEach(async () => {
        await db.User.deleteMany();
    });
    afterAll(async () => {
        
    });
});