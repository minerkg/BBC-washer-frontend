import { MessageService } from 'primeng/api';
import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { Router } from '@angular/router';
import {CardModule} from "primeng/card";
import {Button, ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    CardModule,
    RouterModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [MessageService],
})
export class LandingPageComponent {
  constructor(private messageService: MessageService, private router: Router) {}
}
