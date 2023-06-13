import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any; recebe users from HomeComponent.html !! From Parent to Child Component exemple
  @Output() cancelRegister = new EventEmitter();  //emite algo(cancelRegister false) from Child Component !! From Child to Parent Component exemple
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router){
  }

  ngOnInit(): void {
    this.initiallizeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18); //só permite selecionar datas/anos até min 18 anos
  }

  initiallizeForm(){
    this.registerForm = this.fb.group({
      gender: ["male"],
      userName: ["", Validators.required],
      knownAs: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ["", [Validators.required, this.matchValues("password")]]
    });

    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{  //retorna uma validator function(: ValidatorFn)
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true} //compara o valor de 2 controls(campos do formulario)...
      //se forem iguais retorna null, se ñ retorna obj{notMatching=true}
    }
  }
  
  register(){
    const data = this.getDateOnly(this.registerForm.controls["dateOfBirth"].value);
    const valores = {...this.registerForm.value, dateOfBirth: data};  //vai buscar apenas a prop "dateOfBirth" do formulario e dar o valor da data já modificada/correta(sem horas)
    this.accountService.register(valores).subscribe({ //valores = valores do form
      next: () => this.router.navigateByUrl("/members"),
      error: error => this.validationErrors = error
     })
  }

  getDateOnly(date: string | undefined){
    if(!date) return;
    let theDate = new Date(date);
    return new Date(theDate.setMinutes(theDate.getMinutes() - theDate.getTimezoneOffset())).toISOString().slice(0,10);  //vai buscar apenas a data...sem horas
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
