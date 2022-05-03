import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
/**
 *  Via 'export' machen wir die Definition dieses Objektes anderen Klassen verfügbar
 *  - d.h. andere Klassen können via es "import { NameInfo } from 'src/app/services/about.service'"
 *  importieren.
 *  Optionale Attribute können mittels ':?' definiert werden. In diesem Fall kann "optionalAttribut"
 *  entweder ein string oder 'undefined' sein.
 */
export type NameInfo = {
  firstName: string,
  lastName: string,
  optionalAttribut?: string
};

export type AboutList = {list: string};

@Injectable({
  providedIn: 'root'
})
export class AboutService
  {

  /**
   *  Der Konstruktor des Services wird von Angular selbst aufgerufen.
   *  Durch 'dependency injection' wird automatisch der HttpClient eingefügt.
   *  Wir markieren die Variable als 'private', wodurch es automatisch als Attribut
   *  via 'this' in der gesamten Klasse verfügbar ist.
   *  Generell werden 'Services' als 'Singleton' instanziiert, d.h. es gibt nur eine
   *  Instanz dieses Objektes für die gesamte Anwendung.
   */
  constructor(private http: HttpClient) {
  }

  public getNameInfo(): Observable<NameInfo> {
    /**
     *  Hier senden wir einen HTTP 'GET' request an den '/api/name' Endpoint des Servers.
     *  Da wir nicht wissen wie lange der Server brauchen wird um auf diesen Request zu antworten,
     *  erhalten wir hier nicht sofort Daten (z.B. ein 'NameInfo' Objekt), sondern ein 'Observable'
     *  Objekt mit dem wir weiterarbeiten müssen.
     */
    return this.http.get<NameInfo>('/api/name');
  }

  public getProfileList(): Observable<AboutList> {
    return this.http.get<AboutList>('/api/about/profile-list');
  }

  }
