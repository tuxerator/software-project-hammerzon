import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoryComponent } from '../category/category.component';

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
}
