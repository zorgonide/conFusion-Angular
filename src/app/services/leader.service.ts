import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  getLeaders(): Promise<Leader[]> {
    return Promise.resolve(LEADERS);
  }
  getFeaturedPromotion(): Promise<Leader> {
    return Promise.resolve(LEADERS.filter((lead) => lead.featured)[0]);
  }
  constructor() { }
}
