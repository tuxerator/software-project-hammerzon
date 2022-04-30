import { Request, Response } from 'express';
import {Sequelize} from 'sequelize';
import NameInfo from '../Models/NameInfo';

// Request NameInfos from database and send them to 'Requestors'
class AboutController
{
    // Retrives every entry of NameInfo-Table
    public getNameInfoList(request: Request, response: Response): void
    {
        // Request every entry from db
        NameInfo.findAll().then(
            // db answer:
            (list:NameInfo[]|null) => {
                // if result != null
                if(list)
                {
                    // send it to the request
                    console.log(list);
                    response.status(200);
                    response.send(list);
                }else
                {
                    // Internal Server errror
                    response.status(500);
                    response.send();
                }
            }
        );
    }
}

export default AboutController;
