import { Component } from '@angular/core';
import {Message} from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message ('1', 'Subject 1', 'Message Text 1', 'Brother Thayne'),
    new Message ('2', 'Subject 2', 'Message Text 2', 'Brother Thayne'),
    new Message ('3', 'Subject 3', 'Message Text 3', 'Brother Thayne'),
  ]

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
