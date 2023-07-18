import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);
    return getPaginatedResult<Message[]>(this.apiUrl + "messages", params, this.http);
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.apiUrl + "messages/thread/" + username);
  }

  sendMessage(username: string, messageContent: string) {
    return this.http.post<Message>(this.apiUrl + "messages", {recipientUsername: username, messageContent}) //recipientUsername é o nome do obj que estou a passar, que leva 2 params
  }

  deleteMessage (id: number) {
    return this.http.delete(this.apiUrl + "messages/" + id);
  }
}
