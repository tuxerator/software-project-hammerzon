import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoryComponent } from './category/category.component';

export type Tab = {
  name:string,
  icon:string,
  selector:string
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public allTabs?:Tab[];

  public currentTab?:Tab;

  constructor() {

   }

  ngOnInit(): void {
    this.allTabs = [{
      name:'Kategory',
      icon:'bi-bookmarks-fill',
      selector:'app-category'
    },
    {
      name:'Alle Bestellungen',
      icon:'bi-table',
      selector:'app-all-orders'
    }
  ];
  this.currentTab = this.allTabs[0];
  }

  public changeTab(tab:Tab):void
  {
    this.currentTab= tab;
  }

  public getTabClasses(tab:Tab):string[]
  {
    if(tab === this.currentTab)
    {
      return ['active'];
    }
    return ['text-white'];
  }

  public getTest():any
  {
    return{
      background:'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 16 16\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' xml:space=\'preserve\' xmlns:serif=\'http://www.serif.com/\' style=\'fill-rule:evenodd%3Bclip-rule:evenodd%3Bstroke-linecap:round%3Bstroke-linejoin:round%3Bstroke-miterlimit:1.5%3B\'%3E%3Cpath d=\'M9.972 2.508C10.042 2.308 9.978 2.084 9.812 1.952L9.634 1.823C9.009 1.41 8.3 1.143 7.558 1.04C6.215 0.862 4.504 1.229 2.84 3.133L1.786 3.133C1.653 3.133 1.526 3.186 1.432 3.28L0.146 4.567C-0.047 4.761 -0.047 5.079 0.146 5.273L2.717 7.852C2.811 7.946 2.938 7.999 3.071 7.999C3.204 7.999 3.331 7.946 3.425 7.852L4.711 6.562C4.804 6.468 4.857 6.341 4.857 6.209L4.857 5.57L13.244 14.443C13.338 14.571 13.488 14.646 13.647 14.646C13.779 14.646 13.906 14.594 14 14.5L15.5 13C15.687 12.813 15.695 12.507 15.517 12.311L6.388 3.681C7.135 3.225 8.16 2.842 9.5 2.842C9.712 2.842 9.902 2.708 9.972 2.508Z\' style=\'fill-rule:nonzero%3B\'/%3E%3Cg%3E%3Cpath d=\'M14.951 4.807L12.964 6.57L11.353 6.784L11.4 7.441L10.715 7.587L10.763 8.103L9.219 9.571L8.321 9.55L8.437 10.422L7.489 10.424L7.661 11.276L6.626 11.291L6.956 12.145L5.853 12.092L6.106 12.932L5.068 12.794L5.518 13.686L1.888 14.112L12.711 2.155C13.267 1.499 15.818 4.069 15.077 4.695L15.036 4.731C15.265 4.43 14.907 3.697 14.219 3.071C13.516 2.431 12.733 2.145 12.472 2.432C12.21 2.719 12.569 3.471 13.272 4.111C13.922 4.702 14.639 4.992 14.951 4.807Z\' style=\'stroke:black%3Bstroke-width:1px%3B\'/%3E%3C/g%3E%3C/svg%3E")',
      width:'100px',
      height:'100px'
    };
  }
}
