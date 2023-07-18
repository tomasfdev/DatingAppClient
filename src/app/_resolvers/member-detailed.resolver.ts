import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/member';

@Injectable({           //é como um serviço, é injetavel e é provided in 'root'(providedIn: 'root')... o q significa q é inicializado quando a app é iniciada
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> { //implementa Resolve Interface

  constructor (private memberService: MembersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberService.getMemberByName(route.paramMap.get("username")!)
  }
}
