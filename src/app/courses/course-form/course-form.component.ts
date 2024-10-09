import { Course } from './../model/course';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../service/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormUtilsService } from 'src/app/shared/form/form-utils.service';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;


  constructor(private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService) {

  }

  ngOnInit(): void {
    console.log('1')
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      id: [course.id],
      name: [course.name, [Validators.required,
         Validators.minLength(5),
         Validators.maxLength(100) ]],
      category:[course.category, [Validators.required]],
      lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
    });

  }

  private retrieveLessons(course:Course) {
    const lessons = [];
    if (course?.lessons) {
      course.lessons.forEach(lesson => lesson.push(this.createLesson(lesson)));
    } else {
      lessons.push(this.createLesson());
    }
      return lessons;
  }

  private createLesson(Lesson = {id: '', name: '', youtubeUrl: ''  }) {
    return this.formBuilder.group({
      id: [Lesson.id],
      name: [Lesson.name, [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100) ]],
      youtubeUrl: [Lesson.youtubeUrl, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(11) ]]

    });
  }

  isFormArrayRequired(form :any,nome : any) {
    return true;
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls
  }


  addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
   this.service.save(this.form.value).subscribe(result=> this.onSuccess(),
  error => this.onError() ); }
     else {
      this.formUtils.validateAllFormFields(this.form)
     }

  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.snackBar.open('Curso salvo com sucesso!', '', {duration: 5000});
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao Salvar curso', '', {duration: 5000});
  }

  }

