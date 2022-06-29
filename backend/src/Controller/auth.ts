import { Request, Response } from 'express';

import Helper from '../helpers';
import { IUser } from '../Schemas/User';
import { SessionRequest } from '../types';
import bcrypt from 'bcrypt';
import { db } from './mongoDB';
import { Types } from 'mongoose';

class AuthController {
  constructor() {

  }

  async register(request: SessionRequest, response: Response): Promise<void> {
    const newUser: IUser = request.body;
    // Testen ob es die Email schon gibt
    newUser.email = newUser.email.toLowerCase();
    const userMail = await db.User.findOne({ email: newUser.email }).exec();
    if (userMail) {
      response.status(400);
      response.send({ code: 400, message: 'Email already exists' });
      return;
    }
    // Set default Role
    newUser.role = 'user';
    // hash the password for security reasons
    newUser.password = bcrypt.hashSync(newUser.password.toString(), 10);
    // Save into mongoDB
    const user = new db.User(newUser);
        // created new User
        await user.save();

    response.status(201);
    response.send({ code: 201, message: 'User registered' });
    }

  async login(request: SessionRequest, response: Response): Promise<void> {
    const loginRequest = request.body;

    const email = loginRequest.email;
    const user: (IUser | undefined) = await db.User.findOne({ email }).exec();
    //console.log(user);
    if (!user) {
      response.status(401);
      response.send({ code: 401, message: 'Mail address not found' });
      return;
    }

        const password = loginRequest.password;

    if (!bcrypt.compareSync(password, user?.password.toString())) {
      response.status(401); // 401: Unauthorized
      response.send({ code: 401, message: 'Wrong password' });
      return;
    }
    // setzt da Object in eine Session object
    request.session.user = user;

    response.status(200);
    response.send({ code: 200, message: 'Login successful', });
  }

  getUser(request: SessionRequest, response: Response): void {
    console.log(request.session.user);

    const userWithoutPass = request.session.user;
    delete userWithoutPass.password;
    response.status(200);
    response.send(userWithoutPass);

  }

  public async getUserById(request: Request, response: Response): Promise<void> {
    const id = request.params.id;
    if (id && Types.ObjectId.isValid(id)) {
      const user: IUser = await db.User.findById(id).exec();
      response.status(200);
      response.send(user);
    } else {
      response.status(500);
      response.send('there is no user with such an id');
    }

  }

  logout(request: SessionRequest, response: Response): void {
    request.session.destroy(err => console.log(err));
    response.status(200);
    response.send({ code: 200, message: 'loged out' });
  }

  async update(request: SessionRequest, response: Response): Promise<void> {

    const userDBObj: (IUser | undefined) = await db.User.findOne({ _id: request.session.user._id }).exec();

    if (!userDBObj) {
      response.status(500);
      response.send({ code: 500, message: 'User doent exist' });
      return;
    }

    const userUpdate: IUser = request.body.updatedUser;


    userDBObj.firstName = userUpdate.firstName;
    userDBObj.lastName = userUpdate.lastName;
    userDBObj.address.street = userUpdate.address.street;
    userDBObj.address.houseNum = userUpdate.address.houseNum;
    userDBObj.address.city = userUpdate.address.city;
    userDBObj.address.postCode = userUpdate.address.postCode;
    userDBObj.address.country = userUpdate.address.country;
    userDBObj.markModified('address');

    const oldPassword: string = request.body.oldPassword;
    if (oldPassword) {
      if (!bcrypt.compareSync(oldPassword, userDBObj.password.toString())) {
        response.status(401); // 401: Unauthorized
        response.send({ code: 401, message: 'Wrong password' });

        return;
      }

      if (userUpdate.password.length < 8) {
        response.status(401); // 401: Unauthorized
        response.send({ code: 401, message: 'Password to short' });

        return;
      }

      userDBObj.password = bcrypt.hashSync(userUpdate.password.toString(), 10);
        }

        await userDBObj.save();

        request.session.user = userDBObj;

        response.status(200); // 401: Unauthorized
        response.send({ code: 401, message: 'Updated Successfull' });
    }
}


export default AuthController;
