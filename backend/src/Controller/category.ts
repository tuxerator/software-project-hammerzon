import { Request,Response } from 'express';
import { Image } from '../Models/Image';
import { Category } from '../Models/Category';

export class CategoryController{

  public async addCategory(request:Request,response:Response):Promise<void>
  {
    const name = request.body.name;
    const image_id = request.body.image_id;
    const color = request.body.color;
    const icon = request.body.icon;
    const custom = request.body.custom;

    const image = Image.findById(image_id);

    if(color[0] !== '#')
    {
      response.status(400);
      response.send({code:400,message:'Color needs to be in a hex-format'});
      return;
    }

    if(!image)
    {
      response.status(400);
      response.send({code:400,message:'Image doesnt exist'});
      return;
    }

    const category = {name,image_id,color,icon,custom};

    let db_obj =  new Category(category);

    db_obj =  await db_obj.save();

    response.status(200);
    response.send({code:200,id:db_obj._id});
  }

  public async listCategory(request:Request,response:Response):Promise<void>
  {
    let search = request.query.search;

    if(!search)
    {
      search = '';
    }

    const categories = await Category.find({name:{$regex:search}});

    response.status(200);
    response.send({categories});
  }

}

export  const category = new CategoryController();
