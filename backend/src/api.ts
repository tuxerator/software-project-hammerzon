/**
 *  In dieser Datei schreiben wir einen Controller, der Webrequests von
 *  dem in "app.ts" definierten Webserver beantwortet. Die Methoden werden
 *  in "app.ts" mit einer entsprechenden Webroute verknüpft.
 *  Jede Methode, die mit einer Webroute verknüpft wird, muss einen
 *  "Request" (was angefragt wird) und eine "response" (was unser Server antwortet)
 *  entgegennehmen.
 *  *Wichtig ist, dass jede Response zeitgemäß abgeschlossen wird*, z.B. via
 *  response.send(...data...)
 *  oder response.end()
 */
import { Request, Response } from 'express';

interface NameInfo {
    firstName: string;
    lastName: string;
    optionalAttribut?: string;
}

/**
 * Array of all NameInfo-objects.
 */
const names: NameInfo[] = [
    {
        firstName: 'Jakob',
        lastName: 'Sanowski',
        optionalAttribut: 'Hey, ich bin Jakob Sanowski. Ich studiere Informatik im 4. Semester. ' +
            'Falls es nicht regnet, bin ich ziemlich sicher auf einem Beachvolleyball-Feld.'
    }
];

export class ApiController {
  public getInfo(request: Request, response: Response): void {
    response.status(200);
    response.send('ok');
  }

    /**
     * Returns NameInfo of the name in the request. If name doesn't exist a placeholder is returned.
     */
    public getNameInfo(request: Request, response: Response): void {
        switch (request.params.name) {
            case 'jakob-sanowski': {
                response.status(200);
                response.send(names[0]);
                break;
            }
            default: {
                response.status(200);
                response.send({
                    firstName: 'Max',
                    lastName: 'Mustermann'
                });
                break;
            }
        }
    }

  public getSophieName(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Sophie',
      lastName: 'Unterfranz'
    });
  }

  public getLukasErne(request: Request, response: Response): void {
    response.status(200);
    response.send({
      name: 'Lukas Erne'

    });
  }

  public postNameInfo(request: Request, response: Response): void {
    console.log(request.params.id);
    console.log(request.body.requestedName);
    response.status(200);
    response.send('ok');
  }


  public getHenriGrotzeckInfo(request: Request, response: Response):void {
    response.status(200);
    response.send({
      firstName: 'Henri',
      lastName: 'Grotzeck',
      optionalAttribut:  'Ich bin ein weitere Person. Der teils am Frontend arbeitet'
    });
  }

  public getProfileList(request: Request, response: Response):void{
    response.status(200);
    response.send({
      list:['henri-grotzeck']
    });
  }
}
