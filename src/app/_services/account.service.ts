import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  //serviços são injetaveis(@Injectable, como em c#), serviços são singletons(são instanciados quando a app inicia e destruidos quando app é encerrada)
  providedIn: 'root',
})
export class AccountService {
  apiUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null); //Special Observable(BehaviorSubject) para que outros Components da App possam aceder à informação
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/login', model).pipe(
      //return an Observable of the response, with the response body as an object parsed from JSON.
      map((response: User) => {
        const user = response;
        if (user) this.setCurrentUser(user);
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) this.setCurrentUser(user);
      })
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role; //roles vai guardar a(s) role(s) do user(user.token.role, vai ao token buscar a role)
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles); //se roles for um array[](user tiver + q uma role) guarda, se ñ acrescenta valor ao array e guarda tbm
    localStorage.setItem('user', JSON.stringify(user)); //guarda as informações/dados de User no browser localStorage
    this.currentUserSource.next(user); //Observable currentUserSource vai guardar os dados de user
    this.presenceService.createHubConnection(user); //cria conexão do hub
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
