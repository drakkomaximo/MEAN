import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskHistory } from '../models/task';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  getTasks(filters?: { status?: string; priority?: string; tags?: string; startDate?: string; endDate?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.tags) params = params.set('tags', filters.tags);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTaskHistory(id: string): Observable<any[]> {
    return this.http.get<{ history: any[] }>(`${this.apiUrl}/${id}/history`).pipe(
      map(res => res.history)
    );
  }

  getStatusOptions() {
    return this.http.get<{ statusOptions: string[] }>(`${environment.apiUrl}/tasks/status/options`);
  }

  getPriorityOptions() {
    return this.http.get<{ priorityOptions: string[] }>(`${environment.apiUrl}/tasks/priority/options`);
  }

  getTagOptions() {
    return this.http.get<{ tagOptions: string[] }>(`${environment.apiUrl}/tasks/tag/options`);
  }
}
