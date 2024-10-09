import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, first, tap } from 'rxjs/operators';
import { CoursePage } from '../model/course-page';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) { }

  list(page = 0, pageSize = 10): Observable<CoursePage> {
    return this.httpClient.get<CoursePage>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
        //delay(5000),
        //tap(courses => console.log(courses))
      );
  }

  loadById (id: string) {
    console.log('this.API}', this.API)
   return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  save(record: Partial<Course>){
    //console.log(record)
    if(record.id) {
      //console.log('update')
      return this.update(record);
    }
    //console.log('create')
    return this.create(record);
  }

  private create(record: Partial<Course>){
    return  this.httpClient.post<Course>(this.API, record).pipe(first());
  }
  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record.id}`, record).pipe(first());
  }

  remove (id:string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }
}
