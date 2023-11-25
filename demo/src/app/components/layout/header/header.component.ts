import { Component, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  loginService = new LoginService();

  isAdmin = this.loginService.hasPermission('ADMIN');
  isUser = this.loginService.hasPermission('USER');




}
