import {Component, inject, OnInit, signal} from '@angular/core';
import {ApiConnectionService} from './services/api-connection.service';
import {Movie} from './models/starwars.models';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    ReactiveFormsModule
  ],
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
      this.movies.set(data)
    })

    Object.entries(this.form.controls).forEach(([name, control]) => {
      control.valueChanges.subscribe(() => {
        this.handleValidation(name);
      });
    });
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

  handleValidation(activeControlName: string) {

    if (!this.form.get(activeControlName)?.value) {
      Object.values(this.form.controls).forEach(control => {
        control.setValidators([Validators.required, Validators.minLength(3)]);
        control.updateValueAndValidity({ emitEvent: false });
      });
    } else {
      Object.entries(this.form.controls).forEach(([name, control]) => {
        if (name === activeControlName) {
          control.setValidators([Validators.required, Validators.minLength(3)]);
        } else {
          control.setValidators([Validators.minLength(3)]);
          control.setValue(null, { emitEvent: false });
        }
        control.updateValueAndValidity({ emitEvent: false });
      });
    }
  }


}
