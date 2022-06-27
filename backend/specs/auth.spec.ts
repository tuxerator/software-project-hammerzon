import AuthController from '../src/Controller/auth';
import request from 'supertest';
import app from '../src/app';
import { User } from '../src/Models/User';

describe('authentication', () => {
    let authController : AuthController;

    beforeEach(() => {
        authController = new AuthController();
        // clear all users from the database before tests are run
        User.deleteMany({});
    });

    it('should add a new user upon registration', () => {
        const postedUser = {
            firstName : 'first',
            lastName : 'last',
            email : 'first@test.com',
            password : 'password',
            role : 'user',
            address : {
                street : 'teststreet',
                houseNum : '42',
                postCode : '42424',
                city : 'testcity',
                country : 'testcountry'
            }
        };
        const response = request(app)
            .post('/api/auth/register')
            .send({
                postedUser
            })
            .expect(201);
    });

    afterAll(() => {
        User.deleteMany();
    });
});