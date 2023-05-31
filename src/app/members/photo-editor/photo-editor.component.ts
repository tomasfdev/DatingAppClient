import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  apiUrl = environment.apiUrl;
  user: User | undefined;

  constructor(private accountService: AccountService, private memberService: MembersService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({  //vai buscar user
      next: user => {
        if(user)
          this.user = user
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event: any){
    this.hasBaseDropZoneOver = event;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({ //subscribe pq tem q se subscrever sempre que há um http request
      next: () => {
        if(this.user && this.member){
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user), //vai actualizar o user atual chamando o metodo setCurrentUser() e passar o user atualizado... para que os outros components subscrevam ja com o user actualizado
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if(p.isMain)
              p.isMain = false;
            
            if(p.id === photo.id)
              p.isMain = true;
          })
        }
      }
    })
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if(this.member)
          this.member.photos = this.member.photos.filter(p => p.id !== photoId);
      }
    })

  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.apiUrl + "users/add-photo",
      authToken: "Bearer " + this.user?.token,
      isHTML5: true,
      allowedFileType: ["image"],  //permite todos os tipos de img(jpeg, png...)
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 //tamanho maximo da img é o tamanho max que a cloud nos permite(10mgs)
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {  //se img uploaded com sucesso
      if (response){
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
    }
  }

}
