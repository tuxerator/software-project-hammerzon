import { Request, Response } from 'express';


import { IUser, User } from '../Models/User';
import { SessionRequest } from '../types';
import bcrypt from 'bcrypt';

import { Types } from 'mongoose';
import { ActivityController } from './activity';
import { green,lightBlue,red,yellow } from '../Models/Activity';

export class AuthController {
  constructor() {

  }
  /**
   * register a new user
   * @param request       - {IUser}
   * @param response
   * @returns
   */
  async register(request: SessionRequest, response: Response): Promise<void> {
    const newUser: IUser = request.body;

    // Testen ob es die Email schon gibt
    newUser.email = newUser.email.toLowerCase();
    const userMail = await User.findOne({ email: newUser.email }).exec();
    if (userMail) {
      ActivityController.addActivity(undefined,['hat versucht sich unter der schon', yellow('vorhandenen Email '), lightBlue(newUser.email.toString()), ' zu ',yellow('registieren')]);
      response.status(400);
      response.send({ code: 400, message: 'Email already exists' });
      return;
    }
    // Set default Role
    newUser.role = 'user';
    // hash the password for security reasons
    newUser.password = bcrypt.hashSync(newUser.password.toString(), 10);
    // Save into mongoDB
    const user = new User(newUser);
        // created new User
        await user.save();
    ActivityController.addActivity(user,['hat sich ', green('registriert')]);
    response.status(201);
    response.send({ code: 201, message: 'User registered' });
    }

  /**
   * create a session for the user
   * @param request     - {email, password}
   * @param response
   * @returns
   */
  async login(request: SessionRequest, response: Response): Promise<void> {
    const loginRequest = request.body;

    const email:string = loginRequest.email;
    const user: (IUser | undefined) = await User.findOne({ email }).exec();
    //console.log(user);
    if (!user) {
      ActivityController.addActivity(undefined,['hat versucht sich unter ',lightBlue(email), yellow('anzumelden'), 'und die Email existiert nicht']);
      response.status(401);
      response.send({ code: 401, message: 'Mail address not found' });
      return;
    }

    const password = loginRequest.password;

    if (!bcrypt.compareSync(password, user?.password.toString())) {
      ActivityController.addActivity(undefined,['hat versucht sich unter ',lightBlue(email), yellow('anzumelden'),'und ist am passwort gescheitert']);
      response.status(401); // 401: Unauthorized
      response.send({ code: 401, message: 'Wrong password' });
      return;
    }
    // setzt da Object in eine Session object
    request.session.user = user;
    ActivityController.addActivity(user,['hat sich ', green('angemeldet')]);
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
      const user: IUser = await User.findById(id).exec();
      response.status(200);
      response.send(user);
    } else {
      response.status(500);
      response.send({message :'there is no user with such an id'});
    }

  }

  logout(request: SessionRequest, response: Response): void {
    ActivityController.addActivity(request.session.user,['hat sich abgemeldet']);
    request.session.destroy(err => console.log(err));

    response.status(200);
    response.send({ code: 200, message: 'loged out' });
  }

  /**
   * update userdata
   * @param request { oldPassword, updatedUser }
   * @param response
   * @returns
   */
  async update(request: SessionRequest, response: Response): Promise<void> {
    // Find Connection to User MOdel so it is possible to save the obj afterwards
    const userDBObj: (IUser | undefined) = await User.findOne({ _id: request.session.user._id }).exec();

    if (!userDBObj) {
      ActivityController.addActivity(undefined,['wollte ein ',red('nicht vorhandenes Profile bearbeiten')]);
      response.status(500);
      response.send({ code: 500, message: 'User doesnt exist' });
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
    // if a old password is part of this request
    if (oldPassword) {
      // check wether oldPassword is correct
      if (!bcrypt.compareSync(oldPassword, userDBObj.password.toString())) {
        response.status(401); // 401: Unauthorized
        response.send({ code: 401, message: 'Wrong password' });
        ActivityController.addActivity(userDBObj,['hat versucht seine ', yellow('persönlichen Informationen zu bearbeiten'), ', jedoch war das Passwort falsch']);
        return;
      }
      // check wether new password is to small
      if (userUpdate.password.length < 8) {
        response.status(401); // 401: Unauthorized
        response.send({ code: 401, message: 'Password to short' });
        ActivityController.addActivity(userDBObj,['hat versucht seine ', yellow('persönlichen Informationen zu bearbeiten'), ', jedoch ist das Neue-Passwort zu kurz']);
        return;
      }
      // hash new password
      userDBObj.password = bcrypt.hashSync(userUpdate.password.toString(), 10);
    }

    await userDBObj.save();

    request.session.user = userDBObj;
    ActivityController.addActivity(userDBObj,['hat seine ', green('persönlichen Informationen bearbeitet')]);
    response.status(200);
    response.send({ code: 200, message: 'Updated Successfull' });
  }
}


export const auth = new AuthController();
