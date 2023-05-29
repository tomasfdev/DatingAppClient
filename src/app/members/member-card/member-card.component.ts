import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;  //como pode ser member ou undefined, sempre que for usar as props de member, verificar 1º se existe member

  constructor(){}

  ngOnInit(): void {
  }

}
