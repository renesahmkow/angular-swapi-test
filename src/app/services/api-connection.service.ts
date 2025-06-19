import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, lastValueFrom, switchMap, forkJoin, tap} from 'rxjs';
import {Movie, Person} from '../models/starwars.models';


@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  #http = inject(HttpClient);
  #baseUrl = 'https://swapi.py4e.com/api/';


  public getAllMovies() {
    return this.#http.get<{ results: Movie[] }>(this.#baseUrl + 'films/').pipe(
      map((response) => response.results));
  }

  public searchPeopleInMovies( apiName: string | undefined, searchTerm: string ) {
    return this.#http.get<{
      results: Person[]
    }>(this.#baseUrl + `${apiName}/?search=${searchTerm}`)
      .pipe(map((response) => response.results));
  }
}

