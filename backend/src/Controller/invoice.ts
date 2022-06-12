import { SessionRequest } from '../types';
import { Response } from 'express';
import PDFDocument from 'pdfkit';
import OrderController from './orderCon';
import { IOrder, Order } from '../Models/Order';
import { IUser } from '../Models/User';
import { IProduct } from '../Models/Product';
import fs from 'node:fs';
import doc from 'pdfkit';
export class InvoiceController {

    // request must be from orders owner
    public async createInvoice(request:SessionRequest, response:Response) : Promise<void> {
        const id :string = request.params.id;
        const order : IOrder = await Order.findById(id).
        populate('product').
        populate({
          path: 'product',
          populate: {
            path: 'user',
            model: 'User'
          }
        }).select('-password').
        exec();
        
        const subdocs = order.$getPopulatedDocs();
        console.log('subdocs:');
        console.log(subdocs);

        const product = <IProduct>subdocs[0];
        const productOwner = <IUser>product.$getPopulatedDocs()[0];

        console.log('product owner:');
        console.log(productOwner);

        const document = new PDFDocument();
        try{    
            document.pipe(fs.createWriteStream('invoice.pdf')); // can this be removed?
            
            document
            .fontSize(25)
            .text('Rechnung\n');
            
            document.image('uploads/hammerzon1.jpg',{ // 450, 75,
                scale : 0.2,
            });
            
            document.fontSize(12)
            .text('Bestellnummer: ' + order._id)
            .text('\n\nHandwerker:' + productOwner.firstName + ' ' + productOwner.lastName);
            document.end();
            document.pipe(response);
        }
        catch(error)
        {
            console.log(error);
        }
        response.send();


    }

    


}