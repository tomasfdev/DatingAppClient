import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({   //serviços são injetaveis(@Injectable, como em c#), serviços são singletons(são instanciados quando a app inicia e destruidos quando app é encerrada)
  providedIn: 'root'
})
export class AccountService {
  apiUrl = "https://localhost:5001/api/";
  private currentUserSource = new BehaviorSubject<User | null>(null);  //Special Observable(BehaviorSubject) para que outros Components da App possam aceder à informação
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any){
    return this.http.post<User>(this.apiUrl + "account/login", model).pipe(   //return an Observable of the response, with the response body as an object parsed from JSON.
      map((response: User) => {
        const user = response;
        if (user)
          localStorage.setItem("user", JSON.stringify(user));  //guarda as informações/dados de User no browser localStorage
          this.currentUserSource.next(user);  //Observable currentUserSource vai guardar os dados de user
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.apiUrl + "account/register", model).pipe(
      map(user => {
        if(user){
          localStorage.setItem("user", JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
