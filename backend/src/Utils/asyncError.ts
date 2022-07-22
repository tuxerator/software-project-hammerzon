import { Response } from 'express';
import { SessionRequest } from '../types';

export const asyncError : (fn:((req:SessionRequest,res:Response)=>Promise<void>)) => ( (req: SessionRequest, res: Response) => Promise<void>) = (fn:((req:SessionRequest,res:Response)=>Promise<void>))=>
{
  return async (req:SessionRequest,res:Response) =>
  {
    try {
      await fn(req,res);
    } catch (error) {
      res.status(500);
      res.send({code:500, message:'Internal Server Error'});
    }
  };
};
