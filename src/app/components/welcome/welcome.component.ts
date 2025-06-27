import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {NavbarComponent} from "../../navbar/navbar.component";
import {NgIf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    Button,
    NavbarComponent,
    NgIf,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  user: any;
}
