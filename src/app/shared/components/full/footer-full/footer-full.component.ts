import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-full',
  templateUrl: './footer-full.component.html',
  styleUrls: ['./footer-full.component.scss']
})
export class FooterFullComponent implements OnInit {
  public today: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }

}
