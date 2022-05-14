import { Response } from 'express';

import Helper from '../helpers';
import { getUserWithOutPassword, IUser, User } from '../Models/User';
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

    async update(request: SessionRequest, response: Response):Promise<void>{
        if(!request.session.user)
        {
            response.status(409);
            response.send({code:409,message:'Not authorized'});
            return;
        }
        const userDBObj : (IUser|undefined) = await User.findOne({_id:request.session.user._id}).exec();
        if(!userDBObj)
        {
            response.status(500);
            response.send({code:500,message:'User doent exist'});
            return;
        }

        const userUpdate:IUser= request.body.updatedUser;
        const oldPassword:string = request.body.oldPassword;

        userDBObj.firstName = userUpdate.firstName;
        userDBObj.lastName = userUpdate.lastName;
        userDBObj.address.street = userUpdate.address.street;
        userDBObj.address.houseNum = userUpdate.address.houseNum;
        userDBObj.address.city = userUpdate.address.city;
        userDBObj.address.postCode = userUpdate.address.postCode;
        userDBObj.address.country = userUpdate.address.country;
        userDBObj.markModified('address');

        if(!bcrypt.compareSync(oldPassword, userDBObj.password.toString() )){
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'Wrong password' });

            return;
        }

        if(userUpdate.password.length < 8)
        {
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'Password to short' });

            return;
        }

        userDBObj.password = bcrypt.hashSync(userUpdate.password.toString(),10);

        await userDBObj.save();

        request.session.user = userDBObj;

        response.status(200); // 401: Unauthorized
        response.send({ code: 401, message: 'Updated User' });
    }
}


export default AuthController;
