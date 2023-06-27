import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new Subject<Message[]>();

  messages: Message[] = [];
  maxMessageId?: number;

  constructor(private http: HttpClient) {
    this.fetchMessages();
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    message.id = this.getMaxMessageId().toString();
    this.messages.push(message);
    this.storeMessages();
  }

  private getMaxMessageId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId + 1;
  }

  private fetchMessages() {
    this.http
      .get<Message[]>('https://cms-project-ba565-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages || [];
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  private storeMessages() {
    this.http
      .put('https://cms-project-ba565-default-rtdb.firebaseio.com/messages.json', this.messages)
      .subscribe(
        () => {
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}
