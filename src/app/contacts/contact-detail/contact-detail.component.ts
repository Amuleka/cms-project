import { Component, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact | null = null;
  id!: string;

  constructor(private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.contact = this.contactService.getContact(this.id);
      }
    );
  }

  onDelete() {
    if (!this.contact) {
      return;
    }
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts')
  }


}
