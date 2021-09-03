import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavService, Menu } from '../../../../services/nav.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  public language: boolean = false;

  public languages: any[] = [
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us'
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es'
    },

    {
      language: 'Português',
      code: 'pt',
      type: 'BR',
      icon: 'pt'
    }]

  public selectedLanguage: any = {
    language: 'Français',
    code: 'fr',
    type: 'FR',
    icon: 'fr'
  }

  constructor(private translate: TranslateService,
    public navServices: NavService) { }

  ngOnInit() {
  }

  changeLanguage(lang) {
    this.translate.use(lang.code)
    this.selectedLanguage = lang;
  }

}
