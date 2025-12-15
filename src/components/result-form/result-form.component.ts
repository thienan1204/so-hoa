import { Component, ChangeDetectionStrategy, input, output, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExtractedData } from '../../models/extracted-data.model';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ResultFormComponent {
  // FIX: Explicitly type `fb` as `FormBuilder`.
  // The type inference for `inject(FormBuilder)` was failing, causing `fb` to be of type `unknown`.
  private fb: FormBuilder = inject(FormBuilder);

  initialData = input.required<ExtractedData>();
  save = output<ExtractedData>();

  form = this.fb.group({
    fullName: ['', Validators.required],
    idNumber: ['', Validators.required],
    issueDate: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.form.patchValue(this.initialData());
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
