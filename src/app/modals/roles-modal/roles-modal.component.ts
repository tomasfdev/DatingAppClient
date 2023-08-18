import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  username = "";
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
  }

  updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue); //vê/obtem index da role selecionada...se index for -1 é porque nenhuma role foi selecionada, ou seja, n houve update de role
    index != -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue); //se index (!== -1) remove a role selecionada antes e adiciona a nova : (caso contrario) adiciona nova role às roles
  }

}
