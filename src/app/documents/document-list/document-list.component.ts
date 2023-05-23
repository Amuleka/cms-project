import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Document} from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent: EventEmitter<Document> = new EventEmitter<Document>();

  documents: Document[] = [
    new Document   ("1", "Document 1", "This is the first document", "https://example.com/document1", []),
    new Document ("2", "Document 2", "This is the second document", "https://example.com/document2", []),
    new Document ("3", "Document 3", "This is the third document", "https://example.com/document3", []),
    new Document ("4", "Document 4", "This is the fourth document", "https://example.com/document4", []),
    new Document ("5", "Document 5", "This is the fifth document", "https://example.com/document5", [])
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
