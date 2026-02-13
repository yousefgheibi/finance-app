import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styles: `
  footer{
    position: absolute;
    bottom: 20px;
    font-size: 12px;
    text-align: center;
    width: 80%;
}`
})
export class FooterComponent {
  protected date = signal(new Date().getFullYear());

}
