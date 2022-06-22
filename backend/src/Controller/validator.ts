import { NextFunction, Request, Response } from 'express';
import { SessionRequest } from '../types';
import {Types} from 'mongoose';
import { IProduct, Product } from '../Models/Product';
export type Validator = (request:Request,response:Response)=>boolean
export type SubRequest = {body:any};
export type SubValidator = (request:SubRequest,response:Response)=>boolean;


export const ValidatorGroup = (validators:Validator[]) =>
{
    return (request:Request,response:Response,next:NextFunction):void =>
    {
        console.log(request.body);
        for(const validator of validators)
        {
            if(!validator(request,response))
            {
                return;
            }
        }
        next();
    };
};

//export const ValidatorGroup = (validator:Validator) => ValidatorGroup([validator]);

export class Validators{
    public static isRequired(key:string):SubValidator
    {
        return (request:SubRequest,response:Response):boolean =>
        {
            if(request.body[key] !== undefined)
            {
                return true;
            }
            response.status(400);
            response.send({message:`${key} is required`});
            return false;
        };
    }
    // key is the key from where the subobject starts
    public static subValidators(key:string,validators:SubValidator[]):SubValidator
    {
        return (request:SubRequest,response:Response):boolean =>
        {
            for(const validator of validators)
            {
                if(!validator({body:{parent:`${request.body.parent} -> ${key}`,...request.body[key]}},response))
                {
                    return false;
                }
            }
            return true;
        };
    }

    public static subArrayValidators(key:string,validators:SubValidator[]):SubValidator
    {
        return (request:SubRequest,response:Response):boolean =>
        {
            for(const obj of request.body[key])
            {
                for(const validator of validators)
                {
                    if(!validator({body:{parent:`${request.body.parent} -> ${key}`,...obj}},response))
                    {
                        return false;
                    }
                }
            }
            return true;
        };
    }

    public static isNotAuthorized(role:'user'|'admin'):Validator{
        return (request:SessionRequest,response:Response):boolean =>
        {
           if(request.session.user && (request.session.user.role === role ||request.session.user.role === 'admin'))
           {
                response.status(403);
                response.send({code:403,message:'User is already logged in'});
                return false;
           }
           return true;
        };
    }

  public static isAuthorized(role: 'user' | 'admin'): Validator {
    return (request: SessionRequest, response: Response): boolean => {
      if (request.session.user && (request.session.user.role === role || request.session.user.role === 'admin')) {
        return true;
      }
      response.status(403);
      response.send({ code: 403, message: 'Not Authorized' });
      return false;
    };
  }


  public static isValidEmail(key: string): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      const correctEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!correctEmail.test(request.body[key].toString())) {
        response.status(400);
        response.send({ code: 400, message: 'Email is not valid' });
        return false;
      }
      return true;
    };
  }

  public static isValidObjectId(key: string): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      if (Types.ObjectId.isValid(request.body[key])) {
        return true;
      }
      response.status(500);
      response.send(`${ key } is not a valid ObjectId`);
      return false;
    };
  }

  public static isMaxLength(key: string, length: number): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      if (request.body[key] && request.body[key].length >= length) {
        return true;
      }
      response.status(500);
      response.send(`${ key } is smaller than ${ length }`);
      return false;
    };
  }

  public static isValidRatingRange() : SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      const rating = request.body.rating.rating;
      if(rating >= 1 && rating <= 5) {
        return true;
      }
      else {
        response.status(500);
        response.send('rating is out of the valid range');
        return false;
      }
    };
  }
  public static isValidCommentLength(minLength: number, maxLength : number) : SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      const length = request.body.rating.comment.length;
      if(length >= minLength && length <= maxLength)
      {
        return true;
      }
      else {
        response.status(500);
        response.send('comment length is out of the valid range');
        return false;
      }
    };
  }
}

export class ValidatorLists {
  public static UserValidatorList: Validator[] =
    [
      Validators.isRequired('firstName'),
      Validators.isRequired('lastName'),
      //Validators.isRequired('email'),
      //Validators.isValidEmail('email'),
      Validators.subValidators('address',
        [
          Validators.isRequired('street'),
          Validators.isRequired('houseNum'),
          Validators.isRequired('postCode'),
          Validators.isRequired('city'),
          Validators.isRequired('country')
        ])
    ];


  public static ProductValidatorList: Validator[] = [
        Validators.isMaxLength('name', 4),
        //Validators.isRequired('user'),
        //Validators.isValidObjectId('user'),
        Validators.isRequired('prize'),
        Validators.isRequired('description'),
        Validators.isRequired('duration'),

        Validators.isRequired('appointments'),
        Validators.subArrayValidators('appointments', [
          Validators.isRequired('date'),
          Validators.isRequired('isReserved')
        ]),
        Validators.isRequired('image_id'),
        Validators.isValidObjectId('image_id'),

        Validators.isRequired('category'),
        Validators.isValidObjectId('category')
    ];

  public static PostOrderValidatorList: Validator[] = [
    Validators.isAuthorized('user'),
    Validators.isRequired('productId'),
    Validators.isValidObjectId('productId'),
    Validators.isRequired('appointmentIndex')
  ];

}

// Groupen von Validatoren die für eine Bestimmte Route vorgesehen sind
export class ValidatorGroups {

  // Auth
  public static UserRegister = ValidatorGroup([Validators.isNotAuthorized('user'), ...ValidatorLists.UserValidatorList, Validators.isMaxLength('password', 8), Validators.isRequired('email'), Validators.isValidEmail('email')]);

  public static UserUpdate = ValidatorGroup(
    [
      Validators.isAuthorized('user'),
      Validators.subValidators('updatedUser', ValidatorLists.UserValidatorList),
    ]);

    public static UserLogin = ValidatorGroup(
      [
        Validators.isNotAuthorized('user'),
        Validators.isRequired('email'),
        Validators.isValidEmail('email'),
        Validators.isMaxLength('password', 8),
      ]);

    public static UserAuthorized = ValidatorGroup([
        Validators.isAuthorized('user')
    ]);


    public static AdminAuthorized = ValidatorGroup([
        Validators.isAuthorized('admin')
    ]);

    public static CanConfirm = ValidatorGroup([
        Validators.isRequired('status')
    ]);

    public static ValidRating = ValidatorGroup([
      Validators.isAuthorized('user'),
      Validators.isRequired('rating'),
      Validators.isValidRatingRange()
    ]);

    public static ValidComment = ValidatorGroup([
      Validators.isAuthorized('user'),
      Validators.isRequired('comment'),
      Validators.isValidCommentLength(10, 300)
    ]);

    // Product
  public static ProductAdd = ValidatorGroup([Validators.isAuthorized('user'), ...ValidatorLists.ProductValidatorList]);

    // Order

    public static OrderRegister = ValidatorGroup(ValidatorLists.PostOrderValidatorList);


}
