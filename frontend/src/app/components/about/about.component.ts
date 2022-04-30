import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';
import { SampleService } from 'src/app/services/sample.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  /**
   *  Wir versuchen, ein 'NameInfo' vom Server Backend zu holen.
   *  Da dies Anfangs nicht definiert ('undefined') ist, definieren wir den Typ mit einem
   *  Fragezeichen ('?:') um auch undefinierte Werte zu erlauben. Die Definition des NameInfo
   *  Objektes haben wir in Zeile 2 importiert.  Alternativ können wir dem Objekt einen
   *  Standardwert zuweisen, z.B. als
   *  public myName: NameInfo = { firstName: 'Erika', lastName: 'Musterfrau' };
   */
  public myName?: NameInfo;
  public list?: string[];

  constructor(
    private aboutService: AboutService,
    public sampleService: SampleService ) {
    /**
     *  Üblicherweise bleibt der Konstruktor von Komponenten in Angular leer!
     */
  }

  ngOnInit(): void {
    /**
     *  Da wir aufgrund von Netzwerkoperationen nicht sofort den Wert vom Server zurückbekommen
     *  erhalten wir von dem Service ein 'Observable' Objekt.
     *  Um an den Wert zu kommen, rufen wir die 'subscribe' Methode auf und definieren eine
     *  "Lambda" bzw. "anonyme" Methode, die dann mit dem Wert weiterarbeitet sobald er ankommt.
     *  Solche "anonyme Methoden" sind wie folgt definiert
     *  (parameter1, parameter2: string): returnType => {  ...functionbody... }
     *  ↑                 ↑               ↑                       ↑
     *  |          Parameter werden       |                  Innerhalb der geschweiften Klammern {}
     *  |          innerhalb der ()       |                  kann ganz normal weiterprogrammiert werden
     *  |          Klammern definiert.    |                  wie in einer normalen Funktion
     *  |          Der Typ der Parameter  |
     *  |          ist oftmals optional,  |
     *  |          kann aber sehr hilf-   |
     *  |          reich sein!            |
     *  |                            Wie bei einer
     *  Wir starten mit normalen     Funktion kann
     *  Klammern (), um den Start    ein returnType
     *  der anonyomen Methode        angegeben werden
     *  festzulegen. Falls nur       (z.B. void),
     *  ein Parameter ohne Typ       ist aber optional
     *  vorhanden ist können die
     *  Klammern auch ausgelassen
     *  werden.
     *
     *  **Bitte vermeidet die Verwendung der function() { ... } Syntax!**
     *  Diese werden üblicherweise in JavaScript verwendet, haben aber
     *  ungewöhnliche Seiteneffekte die wir in TypeScript vermeiden können
     *  (z.B. funktioniert die "this" Referenz in der "function" Syntax normalerweise nicht).
     *
     *  Der Wert des "Observable" kann auch mittels funktionaler Methoden (z.B. ähnlich wie in Haskell)
     *  weiterverarbeitet werden, die mittels der 'pipe()' Methode aufgerufen werden können.
     *  Beispiel:
     *  this.aboutService.getNameInfo().pipe(
     *    delay(200), // Warte 200ms bis die nächste Methode ausgeführt wird
     *    map(val => val.completeName = val.firstName + ' ' + val.lastName) // attribut hinzufügen
     *  ).subscribe(....)
     *
     *  Weiterführende Links (Optional / für erfahrenere Programmier*innen)
     *  - https://www.learnrxjs.io/
     *  - https://rxmarbles.com/
     */
    this.aboutService.getProfileList().subscribe({
      // next: Unser Wert kam erfolgreich an!
      next: (val) => {
        this.list = val.list;
        console.log(this.list);
      },

      // error: Es gab einen Fehler
      error: (err) => {
        console.error(err);
        this.list = undefined;
      }
    });
    console.log('Site initialised');
    console.log(this.list);
  }
}
