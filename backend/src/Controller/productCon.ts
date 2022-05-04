import { Request, Response } from 'express';
import Product from '../Models/Product';
import { ListInfo } from '../types';



class ProductController
{

    public getList(request: Request, response: Response): void {

        const list : Product[] = [
            {name:'Holz Stuhl',user:'Holzig GmbH', prize:10, currency:'€/hr'},
            {name:'Dachleiter',user:'Aufstiegs GmbH', prize:10, currency:'€/hr'},
            {name:'Zimmerstreichen',user:'Streich-ich GmbH', prize:10, currency:'€/hr'},
        ];
        let limit = 10;
        let start = 0;

        console.log(list);

        if(request.query)
        {
            limit = parseInt(request.query.limit as string);
            start = parseInt(request.query.start as string);
            console.log();
            if(!limit  || limit > 10 )
            {
                limit = 10;
            }

            if(!start || start > list.length)
            {
                start = 0;
            }
        }

        const listInfo : ListInfo<Product> = {
            list : list,
            requestable: 0
        };
        response.status(200);
        response.send(listInfo);
    }

}


export default ProductController;
