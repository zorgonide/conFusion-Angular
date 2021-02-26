import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'comment': '',
  };
  validationMessages = {
    'comment': {
      'required':      'Comment is a required field.',
      'minlength':     'Comment must be at least 1 characters long.'
    },
    'author': {
      'required':      'Author name is a required field.',
      'minlength':     'Author name must be at least 2 characters long.',
      'maxlength':     'Author name cannot be more than 25 characters long.'
    },
  };
  onValueChanged(data?: any) {
    console.log(this.commentForm)
    // from contact component
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors ) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, 
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) { this.createForm(); }
  
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(1)] ],
      rating: 5,
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }
  onSubmit() {
    let com:Comment = this.commentForm.value;
    com.date = new Date().toISOString();
    this.dish.comments.push(com);
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
    this.feedbackFormDirective.resetForm();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}