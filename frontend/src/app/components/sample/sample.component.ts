import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.css']
})
export class SampleComponent {
    /**
     *  Wenn ein Attribut (z.B. "displayTextObject") mit "@Input" markiert wird, kann dieses Attribut von anderen Komponenten
     *  via HTML gesetzt werden. In diesem Fall kann die Komponente so verwendet werden:
     *
     *  <app-sample [displayTextObject]="myVariable"></app-sample>
     *      ↑             ↑                 ↑               ↑
     *  Selektor der      |        Der Wert, auf den        |
     *  am Anfang         |        das Attribut gesetzt     |
     *  dieser Datei      |        wird. Bitte beachten:    |
     *  definiert wird    |        Hier wird auf eine       |
     *                    |        Variable verwiesen,      |
     *                    |        ansonsten muss explizit  |
     *                    |        ein String angegeben     |
     *                    |        werden (z.B. 'myValue')  |
     *                    |                                 |
     *            Die "@input" Variable                 Angular Komponenten können
     *            wird üblicherweise mit                nicht 'selbstschließen' sein
     *            eckigen Klammern                      (d.h. <app-sample /> ist nicht
     *            geschrieben                           zulässig).
     */
    @Input()
    public displayTextObject = {text: ''};

    constructor() {
    }
}
