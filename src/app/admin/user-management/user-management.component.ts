import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = [
    "Member", "Moderator", "Admin"
  ]

  constructor(private adminService: AdminService, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: "modal-dialog-centered",
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,  //roles disponiveis(admin, moderator, member)
        selectedRoles: [...user.roles]  //roles do current user
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) { //Se os arrays forem diferentes(As roles q o user tinha, e as roles q tem agr), então faz chamada à API
          this.adminService.updateUserRoles(user.username, selectedRoles!.join(',')).subscribe({  //Dá update nas roles
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  private arrayEqual(array1: any[], array2: any[]) {  //converte os arrays para JSON e compara-os
    return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  }

}
