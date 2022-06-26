import AuthController from '../src/Controller/auth';
import request from 'supertest';
import app from '../src/app';
import { IUser } from '../src/Models/User';

describe('authentication', () => {
    let authCcontroller : AuthController;

    beforeEach(() => {
        authCcontroller = new AuthController();

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
            });
    });
});