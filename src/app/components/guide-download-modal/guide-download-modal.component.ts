import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface Guide {
  id: string;
  title: string;
  destination: string;
  duration: string;
  image: string;
  description: string;
  highlight: string;
}

@Component({
  selector: 'app-guide-download-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guide-download-modal.component.html',
  styleUrl: './guide-download-modal.component.scss'
})
export class GuideDownloadModalComponent {
  @Input({ required: true }) guide!: Guide;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{
    email: string;
    acceptedPolicy: boolean;
    acceptedMarketing: boolean;
    guideTitle: string;
  }>();

  email = '';
  acceptedPolicy = false;
  acceptedMarketing = false;

  emailTouched = false;
  hasTriedSubmit = false;
  isSubmitting = false;
  showSuccessMessage = false;
  submitError = false;

  constructor(private apiService: ApiService) {}

  private readonly emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  get trimmedEmail(): string {
    return this.email.trim();
  }

  get isEmailValid(): boolean {
    return this.emailPattern.test(this.trimmedEmail);
  }

  get showEmailError(): boolean {
    return (this.emailTouched || this.hasTriedSubmit) && this.trimmedEmail.length > 0 && !this.isEmailValid;
  }

  get isFormValid(): boolean {
    return this.isEmailValid && this.acceptedPolicy && this.acceptedMarketing;
  }

  get canSubmit(): boolean {
    return this.isFormValid && !this.isSubmitting;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.hasTriedSubmit = true;
    this.emailTouched = true;
    this.submitError = false;
    this.showSuccessMessage = false;

    if (!this.isFormValid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const data = {
      correo: this.trimmedEmail,
      consentimiento: this.acceptedPolicy,
      consentimientoMarketing: this.acceptedMarketing,
      idGuia: this.guide.id
    };

    this.showSuccessMessage = true;

    this.apiService.requestGuide(data).subscribe({
      next: (response) => {
        console.log('Solicitud enviada correctamente', response);

        this.submitForm.emit({
          email: this.trimmedEmail,
          acceptedPolicy: this.acceptedPolicy,
          acceptedMarketing: this.acceptedMarketing,
          guideTitle: this.guide.title
        });
      },
      error: (error) => {
        console.error('Error al solicitar la guía', error);
        this.showSuccessMessage = false;
      }
    });
  }
}