import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      //(UserIsOnline) -> este "method" vem da API(SignalR.PresenceHub.cs OnConnectedAsync())
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) =>
          this.onlineUsersSource.next([...usernames, username]), //cria novo array e substitui antigo(usernames[]), adiciona usernames(lista de nomes q vem da API) e acrescenta username(current user)
      });
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) =>
          this.onlineUsersSource.next(usernames.filter((x) => x !== username)), //filter() -> cria novo [], substitui antigo, adiciona usernames menos username(user q ficou off)
      });
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knowAs }) => {
      //({ username, knowAs }) -> este obj vem da API(SignalR.MessageHub.cs sendMessage())
      this.toastr
        .info(knowAs + ' has sent you a new message! Click me to see it')
        .onTap.pipe(take(1))
        .subscribe({
          next: () =>
            this.router.navigateByUrl('/members/' + username + '?tab=Messages'),
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
