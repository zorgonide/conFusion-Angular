import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Component, OnInit, Inject } from '@angular/core';
import { baseURL } from '../shared/baseurl';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
 
  dishes: Dish[];
  errMess: string;
  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL) {}

  ngOnInit(): void {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      err => this.errMess = <any>err);
  }
}
