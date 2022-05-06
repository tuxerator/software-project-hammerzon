import { Request, Response } from 'express';
import Helper from '../helpers';
import {IProduct} from '../Models/Product';
import { ListInfo } from '../types';


class ProductController
{
    public list : IProduct[] = [
        {
            name:'Holz Stuhl',
            user:'Holzig GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Dachleiter',
            user:'Aufstiegs GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
        {
            name:'Zimmerstreichen',
            user:'Streich-ich GmbH',
            prize:10,
            description:'Beschreibung ...',
            duration:new Date(), // 1 Sekunde
            timeslots:[]
        },
    ];

    public getList(request: Request, response: Response): void {
        // Parse Limit und Start von Query
        //                                                      min,      max,   replace
        const start = Helper.parseQueryInt(request.query,'start',0,this.list.length,0);
        // Falls start sehr nah am Ende ist gilt this.list.length - start sonst einfach nur 10
        const maxLimit = Math.min(this.list.length - start, 10);

        const limit = Helper.parseQueryInt(request.query,'limit',0,10,10);
        const requestable = Math.max(this.list.length - limit - start,0);

        const listInfo : ListInfo<IProduct> = {
            list : this.list.slice(start,start + limit),
            requestable
        };

        response.status(200);
        response.send(listInfo);
    }



}


export default ProductController;

