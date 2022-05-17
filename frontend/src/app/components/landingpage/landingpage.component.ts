import {Component, OnInit} from '@angular/core';
import { Product } from 'src/app/models/Product';
import { LandingpageService,ListInfo } from 'src/app/services/landingpage.service';



@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
    //
    public productListInfo : ListInfo<Product> = {
                                                    list:[],
                                                    requestable:0
                                                  };
    public currentStart = 0;
    public currentLimit = 10;

    constructor(private LandingpageService: LandingpageService) {
    }

    //public list = [0,1,2,3,4,5,6,7,8,9];
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
        //
        this.requestList();
    }
    // fragt nächsten Elemente die nach currentStart und currentLimit kommen
    // z.B currentStart= 0 currentLimit= 10 => currentStart= 10 currentLimit= 10
    //     Bei liste im Backend von z.B [0...99] würde das zu der liste im Frontend führen [10..29] mit requestable:70
    next(): void {
        this.currentStart += this.currentLimit;
        this.requestList(this.currentStart,this.currentLimit);
    }
    // fragt Elemente die vor currentStart und currentLimit kommen
    // z.B currentStart= 10 currentLimit= 10 => currentStart= 0 currentLimit= 10
    previous(): void {
        this.currentStart -= this.currentLimit;
        this.requestList(this.currentStart,this.currentLimit);
    }
    // Frägt nach Productliste bei dem Landingpageservice nach
    requestList(start:number= 0,limit:number=10) : void
    {
        this.LandingpageService.getProductList(start,limit).subscribe({
            // next: Value arrived successfully!
            next: value => {
                console.log(value);
                this.productListInfo = value;
            },

            // error: There was an error.
            error: err => {
                console.error(err);
            }
        });
    }

}
