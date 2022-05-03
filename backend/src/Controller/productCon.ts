import { Request, Response } from 'express';
class ProductController
{
    list = [{name:'E'}];
    public getlist(request: Request, response: Response): void {
        response.status(200);
        response.send(this.list);
    }

}


export default ProductController;
