import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  apiUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length > 0) //se já tiver carregado members da API ent retorna esses members,
      return of(this.members);

    return this.http.get<Member[]>(this.apiUrl + "users").pipe( //se não vai buscar members,
      map(members => {
        this.members = members;
        return members; //e retorna-los
      })
    )
  }

  getMemberByName(username: string){
    const member = this.members.find(user => user.userName === username)
    if(member) //se já tiver carregado members da API ent retorna esses members,
      return of(member);
    return this.http.get<Member>(this.apiUrl + "users/" + username);
  }

  updateMember(member: Member){
    return this.http.put(this.apiUrl + "users", member).pipe(
      map(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }
}
