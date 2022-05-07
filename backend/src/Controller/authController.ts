import { Request, Response } from 'express';
import { mapFinderOptions } from 'sequelize/types/utils';
import Helper from '../helpers';
import { User } from '../Models/User';
import { IUser } from '../Models/User';

import { SessionRequest } from '../types';
import bcrypt from 'bcrypt';

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
        // Name exists
        if(!Helper.valueExists(newUser,'name',response)) return;
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
            response.send('Not a valid email');
            return;
        }
        // Testen ob es die Email schon gibt
        newUser.email = newUser.email.toLowerCase();
        const userMail = await User.findOne({email:newUser.email}).exec();
        if(userMail)
        {
            response.status(400);
            response.send('Email already exists');
            return;
        }
        // check password length
        if(newUser.password.length < 8)
        {
            response.status(400);
            response.send('Not secure password');
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
        response.send('User registered');
    }

}


export default AuthController;
