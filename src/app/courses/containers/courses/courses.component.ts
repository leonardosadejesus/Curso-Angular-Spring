import { CoursesService } from '../../service/courses.service';
import { Component, OnInit, } from '@angular/core';
import { Course } from '../../model/course';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
//import { Message } from '@angular/compiler/src/i18n/i18n_ast';


import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CoursePage } from '../../model/course-page';
import { ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$:Observable<CoursePage> | null = null;
  displayedColumns = ['name', 'category', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;



  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.refresh();
}

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10}) {
    this.courses$ = this.coursesService.list( pageEvent.pageIndex, pageEvent.pageSize)
    .pipe(
      tap( (): void => {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;

      }),
      catchError(error => {
        this.onError('Erro ao carregar cursos.')
        return of({ courses:[], totalElements: 0, totalPages: 0  });
      })
    );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { errorMsg
      }
    })
  }

  ngOnInit(): void {}

  onAdd() {
    this.router.navigate(['new'],{relativeTo: this.route});

  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course.id], { relativeTo: this.route });
  }


  onRemove(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.coursesService.remove(course.id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          },
          () => this.onError('Erro ao tentar remover curso.')
        );
      }
    });
  }
}
