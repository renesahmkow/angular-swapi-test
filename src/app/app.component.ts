import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ApiConnectionService} from './services/api-connection.service';
import {Movie} from './models/starwars.models';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SearchFormComponent} from './components/search-form/search-form.component';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    SearchFormComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  #apiConnectionService = inject(ApiConnectionService);
  #formBuilder = inject(FormBuilder);

  movies = signal<Movie[]>([])
  searchData = signal<string[]>([])

  form = this.#formBuilder.group({
    starships: [null , [Validators.required]],
    people: [null, [Validators.required]],
    vehicles: [null, [Validators.required]],
  })

  ngOnInit() {
    this.#apiConnectionService.getAllMovies().subscribe(data => {

      this.movies.set(data.slice(0,-1))
    })

  }

  searchInMovies() {
    const controlName = this.getValidFormControlName()

    const data = this.#apiConnectionService.searchPeopleInMovies(controlName, this.form.get([controlName])?.value);

    data.subscribe(data => {
      this.searchData.set(data[0]?.films || [])
    })
  }

  getValidFormControlName(): string{
    const controlNameWithValue =
      Object.entries(this.form.controls).find(([_, control]) => {
        return control.value ? true : false
      })

    return controlNameWithValue?.[0] as string
  }

}
