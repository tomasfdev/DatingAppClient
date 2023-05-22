import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any; recebe users from HomeComponent.html !! From Parent to Child Component exemple
  @Output() cancelRegister = new EventEmitter();  //emite algo(cancelRegister false) from Child Component !! From Child to Parent Component exemple
  model: any = {}

  constructor(private accountService: AccountService, private toastr: ToastrService){
  }

  ngOnInit(): void {
  }
  
  register(){
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel,
      error: error => this.toastr.error(error.error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
