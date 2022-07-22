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
  },
  {
    firstName: 'Sophie',
    lastName: 'Unterfranz',
    optionalAttribut: 'Hey, ich bin Sophie Unterfranz. Ich studiere Informatik im 4.Semester. ' +
      'Wenn ich grad mal nichts zu tun hab, dann findet man mich meistens mit einem Buch in der Hand.'
  },
  {
    firstName: 'Lukas',
    lastName: 'Erne',
    optionalAttribut: 'Hi, ich bin Lukas Erne. Ich studiere Informatik im dritten Semester. ' +
      'In meiner Freizeit gehe ich am liebsten auf lange Wanderungen.'
  },
  {
    firstName: 'Cedric',
    lastName: 'Wiese',
    optionalAttribut: 'Hallo, meine Name ist Cedric Wiese. Ich bin aktuelle in meinem dritten Semester im Bachelorstudiengang Informatik.' +
      ' Außerdem mag ich Schildkröten und Züge.'
  },
  {
    firstName: 'Henri',
    lastName: 'Grotzeck',
    optionalAttribut: 'Ich bin eine weitere Person und spiele gerne Fußball'
  }
];

export default class ApiController {
  public getInfo(request: Request, response: Response): void {
    response.status(200);
    response.send('ok');
  }

  /**
   * Returns NameInfo of the name in the request. If name doesn't exist a placeholder is returned.
   */
  public getNameInfo(request: Request, response: Response): void {
    const nameID = Number(request.params.nameID);
    console.log(nameID);
    if (names[nameID] !== undefined) {
      response.status(200);
      response.send(names[nameID]);
    } else {
      response.status(200);
      response.send({
        firstName: 'Max',
        lastName: 'Mustermann'
      });
    }
  }

  public postNameInfo(request: Request, response: Response): void {
    console.log(request.params.id);
    console.log(request.body.requestedName);
    response.status(200);
    response.send('ok');
  }

  public getProfileList(request: Request, response: Response): void {
    const list: number[] = names.map((value, index) => index);
    response.status(200);
    response.send(list);
    console.log(list);
  }
}


export const api = new ApiController();
