import {Request,Express} from 'express';
interface ListInfo<T> {
    list: T[], // Ergebnis Liste der Abfrage
    requestable : number // Anzahl an noch abfragbaren Elementen
}

type SessionRequest = Request & { session: Session };


export {ListInfo,SessionRequest};
