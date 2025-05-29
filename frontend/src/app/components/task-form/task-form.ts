import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatAutocompleteModule
  ],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  currentTags: string[] = [];
  today = new Date();
  statusOptions: string[] = [];
  priorityOptions: string[] = [];
  tagCtrl: any;
  filteredTags: Observable<string[]>;
  allTags: string[] = [
    'Frontend', 'Backend', 'API', 'Angular', 'Bug', 'Feature', 'Urgent', 'Low Priority', 'Refactor', 'Test'
  ];
  editingTagIndex: number | null = null;
  editingTagValue: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['pending', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: [null, Validators.required],
      tags: [[]]
    });
    this.tagCtrl = this.fb.control('');
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._filterTags(value || ''))
    );
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask();
    }
    this.taskService.getStatusOptions().subscribe(res => {
      this.statusOptions = res.statusOptions;
    });
    this.taskService.getPriorityOptions().subscribe(res => {
      this.priorityOptions = res.priorityOptions;
    });
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        this.taskForm.patchValue(task);
        this.currentTags = [...task.tags];
      });
    }
  }

  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue) && !this.currentTags.includes(tag));
  }

  addTagFromInput(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.currentTags.includes(value)) {
      this.currentTags.push(value);
      this.taskForm.patchValue({ tags: this.currentTags });
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue('');
  }

  addTagFromOption(event: any): void {
    const value = event.option.value;
    if (value && !this.currentTags.includes(value)) {
      this.currentTags.push(value);
      this.taskForm.patchValue({ tags: this.currentTags });
    }
    this.tagCtrl.setValue('');
  }

  editTag(index: number, newValue: string): void {
    if (newValue && !this.currentTags.includes(newValue)) {
      this.currentTags[index] = newValue;
      this.taskForm.patchValue({ tags: this.currentTags });
    }
  }

  removeTag(tag: string): void {
    const index = this.currentTags.indexOf(tag);
    if (index >= 0) {
      this.currentTags.splice(index, 1);
      this.taskForm.patchValue({ tags: this.currentTags });
    }
  }

  cancelEditTag(): void {
    this.editingTagIndex = null;
    this.editingTagValue = '';
  }

  startEditTag(index: number): void {
    this.editingTagIndex = index;
    this.editingTagValue = this.currentTags[index];
  }

  saveEditTag(index: number): void {
    if (this.editingTagValue && !this.currentTags.includes(this.editingTagValue)) {
      this.currentTags[index] = this.editingTagValue;
      this.taskForm.patchValue({ tags: this.currentTags });
    }
    this.editingTagIndex = null;
    this.editingTagValue = '';
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        ...this.taskForm.value,
        tags: this.currentTags
      };

      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe(() => {
          this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        });
      }
    }
  }

  goToList() {
    this.router.navigate(['/tasks']);
  }
}
