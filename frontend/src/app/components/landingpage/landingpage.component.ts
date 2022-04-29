import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
    public list = [0,1,2,3,4,5,6,7,8,9];
    /**
     *  Wir packen unseren Text in ein Object, damit wir die *Referenz* zu dem Text teilen können.
     *  Würden wir einfach den String teilen, würden wir eine *Kopie* weitergeben!
     *  Für mehr Infos, siehe z.B. hier: https://dzone.com/articles/angular-components-pass-by-reference-or-pass-by-va
     */


    /**
     *  Hier definieren wir ein Array von Objekten für Links. Damit das HTML Template (landingpage.component.html)
     *  auch Zugriff auf dieses Attribut hat, deklarieren wir es als public. Der Typ dieses Attributs definieren wir
     *  als Array [] von Objekten {}, die einen "name" String und einen "url" String haben.
     */


    /**
     *  Wie bei den Services wird auch in den Komponenten der Konstruktor über Angular aufgerufen.
     *  D.h. wir können hier verschiedene Services spezifizieren, auf die wir Zugriff haben möchten, welche
     *  automatisch durch "Dependency injection" hier instanziiert werden.
     */


    /**
     *  Da unsere Komponente das "OnInit" Interface implementiert müssen wir eine "ngOnInit" Methhode implementieren.
     *  Diese Methode wird aufgerufen, sobald der HTML code dieser Komponente instanziiert und aufgebaut wurde.
     *  Weiterführende Infos gibt es hier: https://angular.io/guide/lifecycle-hooks
     */
    ngOnInit(): void {
        console.log('LandingPage initialized!');
    }

}
