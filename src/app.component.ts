import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService, OcrResult } from './services/ocr.service';
import { ResultFormComponent } from './components/result-form/result-form.component';
import { ExtractedData } from './models/extracted-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ResultFormComponent],
})
export class AppComponent {
  private ocrService = inject(OcrService);

  selectedFile = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isProcessing = signal<boolean>(false);
  ocrResult = signal<OcrResult | null>(null);
  saveStatus = signal<'idle' | 'success' | 'error'>('idle');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.resetState();
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async processOcr(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);
    this.ocrResult.set(null);
    this.saveStatus.set('idle');

    try {
      const result = await this.ocrService.processImage(file);
      this.ocrResult.set(result);
    } catch (error) {
      console.error('OCR processing failed:', error);
      // Handle error state in UI if necessary
    } finally {
      this.isProcessing.set(false);
    }
  }
  
  onSaveData(data: ExtractedData): void {
    console.log('Saving data...', data);
    // Here you would typically send the data to a backend server
    this.saveStatus.set('success');
    setTimeout(() => this.saveStatus.set('idle'), 3000);
  }

  resetState(): void {
    this.selectedFile.set(null);
    this.imagePreviewUrl.set(null);
    this.isProcessing.set(false);
    this.ocrResult.set(null);
    this.saveStatus.set('idle');
  }
}
