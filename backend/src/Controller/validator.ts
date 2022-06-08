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
        console.log(request.body);
        for (const validator of validators) {
            if (!validator(request, response)) {
                return;
            }
        }
        next();
    };
};

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
            Validators.isRequired('startTime'),
            Validators.isRequired('endTime'),
            Validators.isRequired('isReserved')
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


    // Product
    public static ProductAdd = ValidatorGroup([Validators.isAuthorized('user'), ...ValidatorLists.ProductValidatorList]);

    // Order

    public static OrderRegister = ValidatorGroup(ValidatorLists.PostOrderValidatorList);


}

/**
 * Checks if the new appointment does not overlap with any existing appointment of the user offering the product
 */
export const isValidAppointment = async (req: Request, res: Response): Promise<void> => {
    const product: IProduct = await Product.findById(new Types.ObjectId(req.body.productId)).exec();
    const productAvailability: IAvailability[] = product.availability;
    const appointment: IAppointment = req.body.appointment;
    // Get all appointments of the user offering the product
    const orders: IOrder[] = await Order.where('product').equals(product._id).exec();
    const appointments: IAppointment[] = orders.map(order => order.appointment);

    // Check if the new appointment overlaps with any existing appointment
    for (const existingAppointment of appointments) {
        if (existingAppointment.startTime < appointment.endTime && existingAppointment.endTime > appointment.startTime) {
            res.status(400);
            res.send({ code: 400, message: 'Appointment overlaps with existing appointment' });
            return;
        }
    }

    // Check if the new appointment lies outside the availability of the product
    for (const availability of productAvailability) {
        if (availability.startDate < appointment.startTime && availability.endDate > appointment.endTime) {
            res.status(400);
            res.send({ code: 400, message: 'Appointment lies outside the availability of the product' });
            return;
        }
        if (product.defaultTimeFrame.start.getTime() > getDayTime(appointment.startTime) && product.defaultTimeFrame.end.getTime() < getDayTime(appointment.endTime)) {
            res.status(400);
            res.send({ code: 400, message: 'Appointment lies outside the default time frame of the product' });
            return;
        }
    }
}



/**
 * Checks if the new availability does not overlap with an existing one
 */
export const isValidAvailability = async (req: Request, res: Response) => {

    const availabilityToValidate: IAvailability = req.body;
    const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();
    const availabilities: IAvailability[] = product.availability;
    for (let availability of availabilities) {
        // Check weather the new availability overlaps with an exising one
        if (availability.startDate <= availabilityToValidate.endDate && availability.endDate >= availabilityToValidate.startDate) {
            res.status(400);
            res.send({ code: 400, message: 'Availability overlaps with existing availability' });
            return;
        }
    }
}

export const asyncHandler = (callback: { (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>; (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction): Promise<any>; }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    }
}

// Get time without date in milliseconds
const getDayTime = (date: Date): number => {
    return date.getTime() - date.getTime() % (1000 * 60 * 60 * 24);
}
