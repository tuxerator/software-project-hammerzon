import { NextFunction, Request, Response } from 'express';
import { SessionRequest } from '../types';
import { Types } from 'mongoose';
import { IAvailability, IProduct, Product } from '../Models/Product';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IAppointment, IOrder, Order } from '../Models/Order';
import { User } from '../Models/User';

export type Validator = (request: Request, response: Response) => boolean
export type SubRequest = { body: any };
export type SubValidator = (request: SubRequest, response: Response) => boolean;


export const ValidatorGroup = (validators: Validator[]) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    console.log('requestURL: %o', request.originalUrl);
    for (const validator of validators) {
      if (!validator(request, response)) {
        return;
      }
    }
    next();
  };
};

//export const ValidatorGroup = (validator:Validator) => ValidatorGroup([validator]);

export class Validators {
  public static isRequired(key: string): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      if (request.body[key] !== undefined) {
        return true;
      }
      response.status(400);
      response.send({ message: `${ key } is required` });
      return false;
    };
  }

  // key is the key from where the subobject starts
  public static subValidators(key: string, validators: SubValidator[]): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      for (const validator of validators) {
        if (!validator({ body: { parent: `${ request.body.parent } -> ${ key }`, ...request.body[key] } }, response)) {
          return false;
        }
      }
      return true;
    };
  }

  public static subArrayValidators(key: string, validators: SubValidator[]): SubValidator {
    return (request: SubRequest, response: Response): boolean => {
      for (const obj of request.body[key]) {
        for (const validator of validators) {
          if (!validator({ body: { parent: `${ request.body.parent } -> ${ key }`, ...obj } }, response)) {
            return false;
          }
        }
      }
      return true;
    };
  }

  public static canConfirm(key: string): Validator {
    return (request: SessionRequest, response: Response): boolean => {
      // either admin or user and product.user match
      if (request.session.user && (request.session.user.role === 'user' && request.session.user.id === request.body.product[key]) || request.session.user.role === 'admin') {
        return true;
      }
      response.status(403);
      response.send({ code: 403, message: 'Not Authorized' });
      return false;
    };
  }

  public static isNotAuthorized(role: 'user' | 'admin'): Validator {
    return (request: SessionRequest, response: Response): boolean => {
      if (request.session.user && (request.session.user.role === role || request.session.user.role === 'admin')) {
        response.status(403);
        response.send({ code: 403, message: 'User is already logged in' });
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
      const correctEmail: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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

  /**
   * Checks if parameter id exists and is a valid ObjectId
   */
  public static hasValidObjectId(key: string): Validator {
    return (request: Request, response: Response): boolean => {
      const id = request.params[key];
      if (id && Types.ObjectId.isValid(id)) {
        return true;
      }
      response.status(400);
      response.send({ code: 40, message: `${ key } is not a valid ObjectID` });
      return false;
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
    Validators.isRequired('defaultTimeFrame'),
    Validators.subValidators('defaultTimeFrame', [
      Validators.isRequired('start'),
      Validators.isRequired('end')
    ]),
    Validators.isRequired('availability'),
    Validators.subArrayValidators('availability', [
      Validators.isRequired('startDate'),
      Validators.isRequired('endDate'),
    ]),
    Validators.isRequired('image_id'),
    Validators.isValidObjectId('image_id')
  ];

  public static PostOrderValidatorList: Validator[] = [
    Validators.isAuthorized('user'),
    Validators.isRequired('productId'),
    Validators.isValidObjectId('productId'),
    Validators.isRequired('appointment')
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
    Validators.canConfirm('user'),
    Validators.isRequired('status')
  ]);


  // Product
  public static ProductAdd = ValidatorGroup([Validators.isAuthorized('user'), ...ValidatorLists.ProductValidatorList]);

  // Order

  public static OrderRegister = ValidatorGroup(ValidatorLists.PostOrderValidatorList);


}

/**
 * Checks if the new appointment does not overlap with any existing appointment of the user offering the product
 */
export const isValidAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const product: IProduct = await Product.findById(new Types.ObjectId(req.body.productId)).exec();
  const productAvailability: IAvailability[] = product.availability;
  const appointment: IAppointment = req.body.appointment;

  appointment.startDate = new Date(appointment.startDate);
  appointment.endDate = new Date(appointment.endDate);

  const userId = (await Product.findById(product._id).exec()).user;

  const productIds = (await Product.where('user').equals(userId).select('_id').exec()).map(pro => pro._id);

  // Get all appointments of the user offering the product
  const orders: IOrder[] = await Order.find({ product: { $in: productIds } });

  const appointments: IAppointment[] = orders.map(order => order.appointment);

  // Check if the new appointment overlaps with any existing appointment
  const overlappingAppointments: IAppointment[] = appointments.filter(existingAppointment => {
    return existingAppointment.startDate <= appointment.endDate && existingAppointment.endDate >= appointment.startDate;
  });

  if (overlappingAppointments.length > 0) {
    console.log('Validating appointment: ' + JSON.stringify(appointment) + ' overlaps with: ' + overlappingAppointments.toString());
    res.status(400);
    res.send({
      code: 400,
      message: 'Appointment overlaps with existing appointment',
      optional: [overlappingAppointments]
    });
    return;
  }


  // Check if the new appointment lies outside the availability of the product

  //console.log();
  if (productAvailability.some(availability => {
    return (availability.startDate > appointment.startDate && availability.endDate < appointment.endDate)
  })) {
    console.log('Validating appointment: ' + JSON.stringify(appointment) + ' validation error: outside availability all availabilities');
    res.status(400);
    res.send({ code: 400, message: 'Appointment lies outside the availability of the product' });
    return;
  }
  if (getDayTime(product.defaultTimeFrame.start) > getDayTime(appointment.startDate) && getDayTime(product.defaultTimeFrame.end) < getDayTime(appointment.endDate)) {
    console.log('Validating appointment: ' + JSON.stringify(appointment) + 'outside default time frame: ' + JSON.stringify(product.defaultTimeFrame));
    res.status(400);
    res.send({ code: 400, message: 'Appointment lies outside the default time frame of the product' });
    return;
  }

  console.log('Appointment is valid');
  next();
};


/**
 * Checks if the new availability does not overlap with an existing one
 */
export const isValidAvailability = async (req: Request, res: Response, next: NextFunction) => {

  const availabilityToValidate: IAvailability = req.body;
  const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();
  const availabilities: IAvailability[] = product.availability;
  for (const availability of availabilities) {
    // Check weather the new availability overlaps with an exising one
    if (availability.startDate <= availabilityToValidate.endDate && availability.endDate >= availabilityToValidate.startDate) {
      res.status(400);
      res.send({ code: 400, message: 'Availability overlaps with existing availability' });
      return;

    }
  }
  next();
};

export const asyncHandler = (callback: { (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>; (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction): Promise<any>; }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};

// Get time without date in milliseconds
const getDayTime = (date: Date): number => {
  return date.getTime() - date.getTime() % (1000 * 60 * 60 * 24);
};
