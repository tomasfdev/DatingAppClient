import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';

  constructor(private accountService: AccountService){

  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem("user");  //vai receber valor guardado em localStorage que pode ser string ou null

    if(!userString) return; //se for null stop

    const user: User = JSON.parse(userString);  //se tem valor user vai guardar valor
    this.accountService.setCurrentUser(user);
  }
}
