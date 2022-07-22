import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Iimage, Image } from '../Models/Image';
import { FileRequest } from '../types';


export class ImageController {
  constructor() {

  }

  public async postImage(request: FileRequest, response: Response): Promise<void> {
    // File Path where multer-middleware save the uploaded image
    const filePath = path.join('./uploads/' + request.file.filename);
    // get a possible replace id
    const image_id = request.body.replace_id;
    const is_replaceable = !(request.body.is_replaceable === 'false');

    // get the data-blob/file-content from the Uploaded-file
    const data = fs.readFileSync(filePath);

    let dbImage : Iimage | undefined = undefined;
    // if a replace id exist
    if(image_id)
    {
      // find Image in Db
      dbImage = await Image.findById(image_id).exec();
    }
    // if image already exist in the db
    if(dbImage && dbImage.is_replaceable)
    {
      // replace the data content
      dbImage.data = data;
    }else
    {
      // otherwise create a new one
      const img = {
        data: data,
        type: 'image/png',
        is_replaceable
      };
      dbImage = new Image(img);
    }
    // save changes / new Object in db
    await dbImage.save();

    //console.log(dbImage);

    // delete Uploaded-file from Project-Directory
    fs.unlinkSync(filePath);
    // and send new id back
    response.status(200);
    response.send({ code: 200, message: 'Image Uploaded', id: dbImage._id });
  }

  public async getImage(request: Request, response: Response): Promise<void> {
      // get id from rout-param
      const id = request.params.id;
      if (!id) {
        response.status(400);
        response.send({ code: 400, message: 'No Id' });
        return;
      }
      // get Image data from db
      const dbImage = await Image.findById(id).exec();
      // if it doesn't exist
      if (!dbImage) {
        // send error
        response.status(400);
        response.send({ code: 400, message: 'Image doesnt exist' });
        return;
      }
      // otherwise
      response.writeHead(200, {
        'Content-Type': dbImage.type,
        'Content-Length': dbImage.data.length
      });
      // send the image data
      response.end(dbImage.data);
    }
}

export const image = new ImageController();
