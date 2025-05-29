import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TaskHistory } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './task-history.html',
  styleUrls: ['./task-history.scss']
})
export class TaskHistoryComponent implements OnInit {
  taskId: string | null = null;
  history: any[] = [];
  displayedColumns: string[] = ['timestamp', 'field', 'oldValue', 'newValue'];
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 700;
    });
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    if (this.taskId) {
      this.taskService.getTaskHistory(this.taskId).subscribe(history => {
        this.history = history;
      });
    }
  }

  formatValue(value: any): string {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
