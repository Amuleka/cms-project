import { Component, OnInit } from '@angular/core';
import {Document} from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit{
  document: Document  | null = null;
  id!: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private windService: WindRefService) {

  }


  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.document = this.documentService.getDocument(this.id);
      }
    );

    this.nativeWindow = this.windService.getNativeWindow();
  }

  onView() {
    if (this.document && this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
  
  onDelete() {
    if (!this.document) {
      return;
    }
    this.documentService.deleteDocument(this.document);
    this.router.navigateByUrl('/documents')
  }
  
  
}
