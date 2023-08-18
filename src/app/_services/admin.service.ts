import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<User[]>(this.apiUrl + "admin/users-with-roles")
  }

  updateUserRoles(username: string, roles: string) {
    return this.http.post<string[]>(this.apiUrl + "admin/edit-roles/" + username + "?roles=" + roles, {});  //sempre q é um post temos q enviar um object, neste caso um empty object{}
  }
}
