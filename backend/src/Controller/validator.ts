import { NextFunction, Request, Response } from 'express';
import { PaymentType, SessionRequest } from '../types';
import { Types } from 'mongoose';
import { IAvailability, IProduct, Product } from '../Models/Product';
import { IAppointment, IOrder, Order } from '../Models/Order';

// Validator is a function which checks a request for a certain property
export type Validator =  (request: Request, response: Response) => (boolean|Promise<boolean>);
// used for SubValidation request object
export type SubRequest = { body: any };
// Spezial type of Validator which you are able to call in a sub Validation
export type SubValidator = (request: SubRequest, response: Response) => (boolean|Promise<boolean>);

/**
 * ValidatorGroup acts as a middleware whichs checks for a request given validators (if one Fails an error message is send)
 *
*/
export const ValidatorGroup = (validators: Validator[]) => {
  return async(request: Request, response: Response, next: NextFunction): Promise<void> => {
    console.log('requestURL: %o', request.originalUrl);
    for (const validator of validators) {
      const valid = await validator(request, response);

      if (!valid) {
        return;
      }
    }
    next();
  };
};


/**
 * Validator-Funktions / Vadlidator-Funktions-Factories wrapped in a class for organisations purposes
 */
export class Validators{
    /**
     * Checks whether a certain key is part a request
     * @param key (Elements which has to be part of the request)
     * @returns return a validator which checks whether a certain key is part of given the request
     */
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

    /**
     * Checks for a given subobject given validators are valid
     * @param key (Subobject-Identifier)
     * @param validators
     * @returns a validator-funktion which checks for a given subobject given validators are valid
     */
    public static subValidators(key:string,validators:SubValidator[]):SubValidator
    {
        const validatorArray = Validators.validatorsArray(validators);
        return (request:SubRequest,response:Response):Promise<boolean>|boolean =>
        {
            const newRequest = {body:{parent:`${request.body.parent} -> ${key}`,...request.body[key]}};
            return validatorArray(newRequest,response);
        };
    }
    /**
     *
     * @param validators
     * @returns
     */
    public static validatorsArray(validators:SubValidator[]):SubValidator
    {
      return async (request:SubRequest,response:Response):Promise<boolean> =>
      {
          for(const validator of validators)
          {
              if(!(await validator({body:request.body},response)))
              {
                  return false;
              }
          }
          return true;
      };
    }
    /**
     *
     * @param key
     * @param validators
     * @returns
     */
  public static subArrayValidators(key: string, validators: SubValidator[]): SubValidator {
    return async (request: SubRequest, response: Response): Promise<boolean> => {
      for (const obj of request.body[key]) {
        for (const validator of validators) {
          if (!(await validator({ body: { parent: `${ request.body.parent } -> ${ key }`, ...obj } }, response))) {
            return false;
          }
        }
      }
      return true;
    };
  }


  /**
   * checks the role of the current logined user and if it's the same then error
   * @param role (if user => also checks for admin)
   * @returns
   */
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
  /**
   * checks the role of the current logined user and if it's not the same then error
   * @param role (if user => also checks for admin)
   * @returns
   */
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

  /**
   * checks valid email
   * @param key (where email is )
   * @returns
   */
  public static isValidEmail(key: string): SubValidator {
    const correctEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (request: SubRequest, response: Response): boolean => {
      if (!correctEmail.test(request.body[key].toString())) {
        response.status(400);
        response.send({ code: 400, message: 'Email is not valid' });
        return false;
      }
      return true;
    };
  }
  /**
   * Is a valid Objectid
   * @param key
   * @returns
   */
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
  /**
   * Test for length of string (body[key].length >= length)
   * @param key ()
   * @param length ()
   * @returns
   */
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
  /**
   * Only tests for validators if body[typeKey] is equal tor a certain value
   * @param typeKey
   * @param equals (certain value)
   * @param validators ()
   * @param check (compare function)
   * @returns
   */
  public static varDependentValidators(typeKey:string,equals:any,validators:SubValidator[],check = (value:any,equals:any):boolean => value === equals): SubValidator
  {
    const validatorArray = Validators.validatorsArray(validators);
    return (request: SubRequest, response: Response): Promise<boolean>|boolean => {
      if(check(request.body[typeKey], equals))
      {
         return validatorArray(request,response);
      }
      return true;
    };
  }
}
/**
 * Group a Array which test for certain group of object / type
 */
export class ValidatorLists {
  // Tests for User
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

  // Tests for Product
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
        Validators.isValidObjectId('image_id'),

        Validators.isRequired('category'),
        Validators.isValidObjectId('category')
    ];
  // Test for PostOrder
  public static PostOrderValidatorList: Validator[] = [
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


    //
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

    // Payment

    public static CountryPayment = ValidatorGroup([
      Validators.isAuthorized('user'),
      Validators.isRequired('account'),
      // Merchant Info required for Bachelor Card
      Validators.varDependentValidators('paymentType',PaymentType.BACHELORCARD,[
        Validators.isRequired('merchantInfo'),
      ]),
    ]);

    // Pament
    public static PayPayment = ValidatorGroup([
      Validators.isAuthorized('user'),
      Validators.subValidators('postOrder',ValidatorLists.PostOrderValidatorList),
      Validators.isRequired('paymentType'),
      // HCIPAL and SWP-Safe
      Validators.varDependentValidators('paymentType',PaymentType.HCIPAL,[
        Validators.isRequired('password')
      ]),
      Validators.varDependentValidators('paymentType',PaymentType.BACHELORCARD,[
        Validators.isRequired('expirationDate'),
        Validators.isRequired('fullName'),
        Validators.isRequired('merchantInfo'),
        Validators.isRequired('password')
      ]),
    ]);
}

/**
 * Checks if the new appointment does not overlap with any existing appointment of the user offering the product
 */
export const isValidAppointment = async (req: Request, res: Response): Promise<boolean> => {
  const product: IProduct = await Product.findById(new Types.ObjectId(req.body.postOrder.productId)).exec();
  const productAvailability: IAvailability[] = product.availability;
  const appointment: IAppointment = req.body.postOrder.appointment;

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
    return false;
  }


  // Check if the new appointment lies outside the availability of the product

  //console.log();
  if (productAvailability.some(availability => {
    return (availability.startDate > appointment.startDate && availability.endDate < appointment.endDate);
  })) {
    console.log('Validating appointment: ' + JSON.stringify(appointment) + ' validation error: outside availability all availabilities');
    res.status(400);
    res.send({ code: 400, message: 'Appointment lies outside the availability of the product' });
    return false;
  }
  if (getDayTime(product.defaultTimeFrame.start) > getDayTime(appointment.startDate) && getDayTime(product.defaultTimeFrame.end) < getDayTime(appointment.endDate)) {
    console.log('Validating appointment: ' + JSON.stringify(appointment) + 'outside default time frame: ' + JSON.stringify(product.defaultTimeFrame));
    res.status(400);
    res.send({ code: 400, message: 'Appointment lies outside the default time frame of the product' });
    return false;
  }

  console.log('Appointment is valid');
  return true;
};


/**
 * Checks if the new availability does not overlap with an existing one
 */
export const isValidAvailability = async (req: Request, res: Response):Promise<boolean> => {

  const availabilityToValidate: IAvailability = req.body;
  const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();
  const availabilities: IAvailability[] = product.availability;
  for (const availability of availabilities) {
    // Check weather the new availability overlaps with an exising one
    if (availability.startDate <= availabilityToValidate.endDate && availability.endDate >= availabilityToValidate.startDate) {
      res.status(400);
      res.send({ code: 400, message: 'Availability overlaps with existing availability' });
      return false;
    }
  }
  return true;
};


// Get time without date in milliseconds
const getDayTime = (date: Date): number => {
  return date.getTime() - date.getTime() % (1000 * 60 * 60 * 24);
};
