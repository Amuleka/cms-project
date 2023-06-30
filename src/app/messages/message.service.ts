import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { Observable, Subject, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private sortAndSend() {
    this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
    this.messageChangedEvent.next(this.messages.slice());
  }

  getPostUpdateListener() {
    return this.messageChangedEvent.asObservable();
  }


  getMessages() {
    return this.http.get<Message[]>('http://localhost:3000/messages');
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
  
    // make sure id of the new Message is empty
    message.id = '';
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // add to database
    this.http.post<{ messages: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.message);
          this.sortAndSend();
        }
      );
  }
  

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }
  
    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
  
    if (pos < 0) {
      return;
    }
  
    // Set the id of the new Message to the id of the old Message
    newMessage.id = originalMessage.id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // Update database
    this.http.put('http://localhost:3000/messages/' + originalMessage.id, newMessage, { headers:headers })
      .subscribe(() => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      });
  }
  


  deleteMessage(message: Message) {
    if (!message) {
      return;
    }
  
    const pos = this.messages.findIndex(m => m.id === message.id);
  
    if (pos < 0) {
      return;
    }
  
    // Delete from database
    this.http.delete('http://localhost:3000/messages/' + message.id)
      .subscribe(
        () => {
          this.messages.splice(pos, 1);
          this.sortAndSend();
        },
        (error) => {
          console.error(error);
        }
      );
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
      .get<Message[]>('http://localhost:3000/messages')
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
      .put('http://localhost:3000/messages', this.messages)
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
