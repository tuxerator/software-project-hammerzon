
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Iimage, Image } from '../Models/Image';
import { FileRequest } from '../types';



export class ImageController
{
    constructor()
    {

    }
    public async postImage(request: FileRequest, response: Response):Promise<void>
    {
        const img= {
                data: fs.readFileSync(path.join('./uploads/' + request.file.filename)),
                type: 'image/png'
        };
        const dbImage = new Image(img);
        await dbImage.save();
        console.log(dbImage);
        response.status(200);
        response.send({code:200,message:'Image Uploaded',id:dbImage._id});
    }

    public async getImage(request: Request, response: Response):Promise<void>
    {
        const id = request.params.id;
        if(!id)
        {
            response.status(400);
            response.send({code:400,message:'no id'});
            return;
        }

        const dbImage = await Image.findById(id).exec();

        if(!dbImage)
        {
            response.status(400);
            response.send({code:400,message:'Image doesnt exist'});
            return;
        }

        response.writeHead(200, {
            'Content-Type':dbImage.type,
            'Content-Length':dbImage.data.length
         });

        response.end(dbImage.data);
    }
}


