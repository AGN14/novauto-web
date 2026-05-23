import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css'
})
export class StarRating {
  readonly Star = Star;

  @Input() note: number = 0;
  @Input() interactive: boolean = false;
  @Output() noteChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  onStarClick(star: number): void {
    if (this.interactive) {
      this.note = star;
      this.noteChange.emit(star);
    }
  }

  isStarFilled(star: number): boolean {
    return star <= this.note;
  }
}
