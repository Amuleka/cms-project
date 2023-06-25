import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document | undefined | null;
  document: Document | undefined | null;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalDocument = this.documentService.getDocument(id);
      if (!this.originalDocument) {
        return;
      }

      this.editMode = true;
      this.document = { ...this.originalDocument };
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(
      '', // Provide an appropriate value for the 'id' argument
      value.name,
      value.description,
      value.url,
      [] // Provide an appropriate value for the 'children' argument if needed
    );
  
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument!, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
  
    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
  
}
