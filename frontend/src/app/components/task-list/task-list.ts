import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime } from 'rxjs/operators';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  displayedColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'tags', 'actions'];

  // Filters
  statusFilter: string = '';
  priorityFilter: string = '';
  tagsFilter = new FormControl('');
  startDateFilter: string = '';
  endDateFilter: string = '';
  statusOptions: string[] = [];
  priorityOptions: string[] = [];
  tagOptions: string[] = [];

  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;

  isMobile = false;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 700;
    });
    this.loadFilterOptions();
    this.loadTasks();
    this.tagsFilter.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadFilterOptions(): void {
    this.taskService.getStatusOptions().subscribe(res => this.statusOptions = res.statusOptions);
    this.taskService.getPriorityOptions().subscribe(res => this.priorityOptions = res.priorityOptions);
  }

  loadTasks(): void {
    this.taskService.getTasks({
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      tags: this.tagsFilter.value || undefined,
      startDate: this.startDateFilter || undefined,
      endDate: this.endDateFilter || undefined
    }).subscribe(tasks => {
      this.tasks = tasks;
      this.applyPagination();
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadTasks();
  }

  applyPagination(): void {
    const validTasks = this.tasks.filter(task => task && task.title);
    this.totalItems = validTasks.length;
    const start = this.pageIndex * this.pageSize;
    this.filteredTasks = validTasks.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyPagination();
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.statusFilter ||
      this.priorityFilter ||
      this.tagsFilter.value ||
      this.startDateFilter ||
      this.endDateFilter
    );
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.priorityFilter = '';
    this.tagsFilter.setValue('');
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyFilters();
  }
}
