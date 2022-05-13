import { Request, Response } from 'express';

import Helper from '../helpers';
import { getUserWithOutPassword, User } from '../Models/User';
import { IUser } from '../Models/User';

import { SessionRequest } from '../types';
import bcrypt from 'bcrypt';

import {Types} from 'mongoose';

class AuthController{
    constructor()
    {

    }

    async register(request: SessionRequest, response: Response):Promise<void>
    {
        const newUser:IUser = request.body;

        // Validation
        //
        if(request.session.user)
        {
            response.status(409);
            response.send('User is already logged in');
        }
        // Email exists
        if(!Helper.valueExists(newUser,'email',response)) return;
        // Password exists
        if(!Helper.valueExists(newUser,'password',response)) return;
        // Names exists
        if(!Helper.valueExists(newUser,'firstName',response)) return;

        if(!Helper.valueExists(newUser,'lastName',response)) return;
        // adress exists
        if(!Helper.valueExists(newUser,'address',response)) return;
        // street exists
        if(!Helper.valueExists(newUser.address,'street',response)) return;
        // houseNum exists
        if(!Helper.valueExists(newUser.address,'houseNum',response)) return;
        // city exists
        if(!Helper.valueExists(newUser.address,'city',response)) return;
        // country exists
        if(!Helper.valueExists(newUser.address,'country',response)) return;
        // postalcode exists
        if(!Helper.valueExists(newUser.address,'postCode',response)) return;

        // correct email regex
        const correctEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!correctEmail.test(newUser.email.toString()))
        {
            response.status(400);
            response.send({code:400, message:'Not a valid email'});
            return;
        }
        // Testen ob es die Email schon gibt
        newUser.email = newUser.email.toLowerCase();
        const userMail = await User.findOne({email:newUser.email}).exec();
        if(userMail)
        {
            response.status(400);
            response.send({code:400,message:'Email already exists'});
            return;
        }
        // check password length
        if(newUser.password.length < 8)
        {
            response.status(400);
            response.send({code:400,message:'Not secure password'});
            return;
        }
        // Set default Role
        newUser.role = 'user';
        // hash the password for security reasons
        newUser.password =bcrypt.hashSync(newUser.password.toString(),10);
        // Save into mongoDB
        const user = new User(newUser);
        await user.save();
        //delete user.password;
        // created new User
        response.status(201);
        response.send({message:'User registered'});
    }

    async login(request: SessionRequest, response: Response):Promise<void>
    {
        if(request.session.user)
        {
            response.status(409);
            response.send('User is already logged in');
        }
        const loginRequest = request.body;
        if(!Helper.valueExists(loginRequest,'password',response)) return;
        if(!Helper.valueExists(loginRequest,'email',response)) return;

        const email = loginRequest.email;
        const user:(IUser|undefined) = await User.findOne({email}).exec();
        console.log(user);
        if(!user)
        {
            response.status(401);
            response.send({code:401,message:'Mail address not found'});
            return;
        }

        const password = loginRequest.password;

        if (!bcrypt.compareSync(password, user?.password.toString() )) {
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'Wrong password' });
            return;
        }

        request.session.user = user;

        response.status(200);
        response.send({ code: 200, message: 'Login successful', });
    }
    getUser(request: SessionRequest, response: Response):void
    {
        console.log(request.session.user);
        if(request.session.user)
        {
            const userWithoutPass = getUserWithOutPassword(request.session.user);
            response.status(200);
            response.send(userWithoutPass);
        }else
        {
            response.status(409);
            response.send({code:409,message:'Not authorized'});
        }
    }
    public async getUserById(request: Request, response: Response): Promise<void>
    {
        const id = request.params.id;
        if(id && Types.ObjectId.isValid(id))
        {
            const user : IUser = await User.findById(id).exec();
            response.status(200);
            response.send(user);
        }
        else
        {
            response.status(500);
            response.send('there is no user with such an id');
        }

    }
    logout(request: SessionRequest, response: Response):void
    {
        if(request.session.user)
        {
            request.session.destroy(err => console.log(err));
            response.status(200);
            response.send({code:200,message:'loged out'});
        }else
        {
            response.status(409);
            response.send({code:409,message:'Not authorized'});
        }
    }
}


export default AuthController;
