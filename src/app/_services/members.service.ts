import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  apiUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();  //dá acesso às prop(get & set) de um obj quando obtiver o pedido da API
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(UserParams: UserParams){
    const response = this.memberCache.get(Object.values(UserParams).join("-")); //isto é a key... exemplo de key:  

    if (response) return of (response); //se response=true(quer dizer que esta consulta/query/ já foi feita, logo ñ é necessario fazer novo request à API e retorna os valores já guardados)

    let params = getPaginationHeaders(UserParams.pageNumber, UserParams.pageSize);

    params = params.append("minAge", UserParams.minAge);
    params = params.append("maxAge", UserParams.maxAge);
    params = params.append("gender", UserParams.gender);
    params = params.append("orderBy", UserParams.orderBy);

    return getPaginatedResult<Member[]>(this.apiUrl + "users", params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(UserParams).join("-"), response);
        return response;
      })
    )
  }

  getMemberByName(username: string){
    const member = [...this.memberCache.values()]
      .reduce((array, element) => array.concat(element.result), [])
      .find((member: Member) => member.userName === username);

      if (member) return of(member);  //retorna uma observable of member

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

  setMainPhoto(photoId: number){
    return this.http.put(this.apiUrl + "users/set-main-photo/" + photoId, {}); //como é um http put, tem que enviar um objeto como parametro, ent manda um obj vazio({})...tal como se fosse http post
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.apiUrl + "users/delete-photo/" + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.apiUrl + "likes/" + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append("predicate", predicate);

    return getPaginatedResult<Member[]>(this.apiUrl + "likes", params, this.http);
  }
}
