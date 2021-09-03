import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJs from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private host = environment.apiUrl;

  constructor() { }

  connect() {
      let socket = new SockJs(`${this.host}/socket`);

      let stompClient = Stomp.over(socket);

      stompClient.debug = null;

      return stompClient;
  }}
