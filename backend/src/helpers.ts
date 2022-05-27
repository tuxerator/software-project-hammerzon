import {Response} from 'express';
// Hilfs funktionen die Abfragen allgemein Vereinfachen
class Helper{

    // Parsed eine Int-Wert einer Query mit eine limt und einem möglichen ersatz
    public static parseQueryInt(query: Record<string, unknown>,valName:string,min:number,max:number,replace:number): number
    {
        // Falls query nicht existiert
        if(!query)
        {
            return replace;
        }
        // parse es als in den
        const val = parseInt(query[valName] as string);
        // Wenn es nicht geparsed werden konnte setz es auf einen Ersatz wert
        if(!val)
        {
            return replace;
        }
        // Wert zu groß
        if(val > max )
        {
            return max;
        }
        // Wert zu klein
        if(val < min)
        {
            return min;
        }
        // sonst gib wert zurücl
        return val;
    }


    public static valueExists<T>(obj:T,key:string|number|symbol,response:Response): key is keyof T
    {
        if(!(key in obj))
        {
            response.status(400);
            response.send(`${key.toString()} does not exist`);
            return false;
        }
        return true;
    }
}

export default Helper;
