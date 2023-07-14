import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
  }

  private sortAndSend() {
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentChangedEvent.next(this.documents.slice());
  }
   

  getDocuments() {
    return this.http.get<Document[]>('http://localhost:3000/documents');
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }


  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === document.id);
  
    if (pos < 0) {
      return;
    }
  
    // Delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
  }
  


  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
  
    if (pos < 0) {
      return;
    }
  
    // Set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // Update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers })
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }
  

  private getMaxDocumentId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId + 1;
  }

  private storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.put('http://localhost:3000/documents/', documentsString, { headers })
      .subscribe(
        () => {
          this.documentChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}
