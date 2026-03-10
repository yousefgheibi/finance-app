import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  ngOnInit(): void {
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    const theme = localStorage.getItem('themeColor') || 'blue';

    document.body.classList.add(`font-${fontSize}`);
    document.body.setAttribute('data-theme', theme);
  }
}
