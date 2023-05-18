import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any; recebe users from HomeComponent.html !! From Parent to Child Component exemple
  @Output() cancelRegister = new EventEmitter();  //emite algo(cancelRegister false) from Child Component !! From Child to Parent Component exemple
  model: any = {}

  constructor(private accountService: AccountService){
  }

  ngOnInit(): void {
  }
  
  register(){
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel,
      error: error => console.log(error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
