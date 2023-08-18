import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { map, take } from 'rxjs';

@Directive({
  selector: '[appHasRole]'  // *appHasRole='["Admin", "Thing"]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private accountService: AccountService ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
   }

  ngOnInit(): void {
    if (this.user.roles.some(r => this.appHasRole.includes(r))) { //se user.roles tiver as roles que quero checkar(appHasRole(r)). ex: se user.roles[] tiver *appHasRole='["Admin"]'
      this.viewContainerRef.createEmbeddedView(this.templateRef); //mostra conteudo HTML caso tenha as roles
    } else {
      this.viewContainerRef.clear() //remove conteudo HTML caso n tenha roles
    }
  }

}
