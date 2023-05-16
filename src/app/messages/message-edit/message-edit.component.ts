import { Component, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import {Message} from '../message.model'

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  currentSender = 'Amulek';
  @ViewChild('subject') subject!: ElementRef;
  @ViewChild('msgText') msgText!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;
    const message = new Message(
      '1', 
      subjectValue, 
      msgTextValue, 
      this.currentSender);
    this.addMessageEvent.emit(message);

    this.onClear();
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
   }

}
