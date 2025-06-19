import {ChangeDetectionStrategy, Component, input, OnInit, signal} from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-search-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {
  form = input.required<FormGroup>();
  controls = signal<string[]>([])

  ngOnInit(): void {
    this.controls.set(Object.keys(this.form().controls))

    Object.entries(this.form().controls).forEach(([name, control]) => {
      control.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
        this.handleValidation(name);
      });
    });
  }

  handleValidation(activeControlName: string) {
    if (!this.form().get(activeControlName)?.value) {
      Object.values(this.form().controls).forEach(control => {
        control.setValidators([Validators.required, Validators.minLength(3)]);
        control.updateValueAndValidity({ emitEvent: false });
      });
    } else {
      Object.entries(this.form().controls).forEach(([name, control]) => {
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
