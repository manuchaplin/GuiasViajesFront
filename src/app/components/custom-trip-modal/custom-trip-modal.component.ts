import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface CustomTripRequest {
  origin: string;
  destination: string;
  daysAvailable: number | null;
  travelers: number | null;
  budget: number | null;
  currency: 'EUR' | 'USD';
  hasFixedDates: boolean;
  startDate: string | null;
  endDate: string | null;
  extraInfo: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  acceptedPolicy: boolean;
  acceptedMarketing: boolean;
  budgetNotSure: boolean;
}

@Component({
  selector: 'app-custom-trip-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-trip-modal.component.html',
  styleUrl: './custom-trip-modal.component.scss'
})
export class CustomTripModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<CustomTripRequest>();

  origin = '';
  destination = '';
  daysAvailable: number | null = null;
  travelers: number | null = null;
  budget: number | null = null;
  currency: 'EUR' | 'USD' = 'EUR';
  hasFixedDates = false;
  startDate: string | null = null;
  endDate: string | null = null;
  extraInfo = '';
  phoneCountryCode = '';
  phone = '';
  email = '';
  acceptedPolicy = false;
  acceptedMarketing = false;

  originTouched = false;
  destinationTouched = false;
  daysTouched = false;
  travelersTouched = false;
  budgetTouched = false;
  datesTouched = false;
  phoneCountryCodeTouched = false;
  phoneTouched = false;
  emailTouched = false;
  hasTriedSubmit = false;
  budgetNotSure = false;

  isSubmitting = false;
  showSuccessMessage = false;
  submitError = false;

  constructor(private apiService: ApiService) {}

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  private readonly phonePattern = /^[0-9\s-]{6,20}$/;
  private readonly phoneCountryCodePattern = /^\+[0-9]{1,4}$/;

  get trimmedOrigin(): string {
    return this.origin.trim();
  }

  get trimmedDestination(): string {
    return this.destination.trim();
  }

  get trimmedEmail(): string {
    return this.email.trim();
  }

  get trimmedPhone(): string {
    return this.phone.trim();
  }

  get trimmedPhoneCountryCode(): string {
    return this.phoneCountryCode.trim();
  }

  get isOriginValid(): boolean {
    return this.trimmedOrigin.length >= 2;
  }

  get isDestinationValid(): boolean {
    return this.trimmedDestination.length >= 2;
  }

  get isDaysValid(): boolean {
    return this.daysAvailable !== null && this.daysAvailable > 0;
  }

  get isTravelersValid(): boolean {
    return this.travelers !== null && this.travelers > 0;
  }

  get isBudgetValid(): boolean {
    if (this.budgetNotSure) {
      return true;
    }

    return this.budget !== null && this.budget >= 0;
  }

  get isPhoneCountryCodeValid(): boolean {
    return this.phoneCountryCodePattern.test(this.trimmedPhoneCountryCode);
  }

  get isPhoneValid(): boolean {
    return this.phonePattern.test(this.trimmedPhone);
  }

  get isEmailValid(): boolean {
    return this.emailPattern.test(this.trimmedEmail);
  }

  get isDateRangeValid(): boolean {
    if (!this.hasFixedDates) {
      return true;
    }

    if (!this.startDate || !this.endDate) {
      return false;
    }

    return new Date(this.endDate) >= new Date(this.startDate);
  }

  get showOriginError(): boolean {
    return (this.originTouched || this.hasTriedSubmit) && !this.isOriginValid;
  }

  get showDestinationError(): boolean {
    return (this.destinationTouched || this.hasTriedSubmit) && !this.isDestinationValid;
  }

  get showDaysError(): boolean {
    return (this.daysTouched || this.hasTriedSubmit) && !this.isDaysValid;
  }

  get showTravelersError(): boolean {
    return (this.travelersTouched || this.hasTriedSubmit) && !this.isTravelersValid;
  }

  get showBudgetError(): boolean {
    return (this.budgetTouched || this.hasTriedSubmit) && !this.isBudgetValid;
  }

  get showDateRangeError(): boolean {
    return this.hasFixedDates && (this.datesTouched || this.hasTriedSubmit) && !this.isDateRangeValid;
  }

  get showPhoneCountryCodeError(): boolean {
    return (this.phoneCountryCodeTouched || this.hasTriedSubmit) && !this.isPhoneCountryCodeValid;
  }

  get showPhoneError(): boolean {
    return (this.phoneTouched || this.hasTriedSubmit) && !this.isPhoneValid;
  }

  get showEmailError(): boolean {
    return (this.emailTouched || this.hasTriedSubmit) && this.trimmedEmail.length > 0 && !this.isEmailValid;
  }

  get isFormValid(): boolean {
    return (
      this.isOriginValid &&
      this.isDestinationValid &&
      this.isDaysValid &&
      this.isTravelersValid &&
      this.isBudgetValid &&
      this.isDateRangeValid &&
      this.isPhoneCountryCodeValid &&
      this.isPhoneValid &&
      this.isEmailValid &&
      this.acceptedPolicy &&
      this.acceptedMarketing
    );
  }

  get canSubmit(): boolean {
    return this.isFormValid && !this.isSubmitting;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.hasTriedSubmit = true;
    this.originTouched = true;
    this.destinationTouched = true;
    this.daysTouched = true;
    this.travelersTouched = true;
    this.budgetTouched = true;
    this.datesTouched = true;
    this.phoneCountryCodeTouched = true;
    this.phoneTouched = true;
    this.emailTouched = true;
    this.submitError = false;
    this.showSuccessMessage = false;

    if (!this.isFormValid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const payload: CustomTripRequest = {
      origin: this.trimmedOrigin,
      destination: this.trimmedDestination,
      daysAvailable: this.daysAvailable,
      travelers: this.travelers,
      budget: this.budgetNotSure ? null : this.budget,
      currency: this.currency,
      hasFixedDates: this.hasFixedDates,
      startDate: this.hasFixedDates ? this.startDate : null,
      endDate: this.hasFixedDates ? this.endDate : null,
      extraInfo: this.extraInfo.trim(),
      phoneCountryCode: this.trimmedPhoneCountryCode,
      phone: this.trimmedPhone,
      email: this.trimmedEmail,
      acceptedPolicy: this.acceptedPolicy,
      acceptedMarketing: this.acceptedMarketing,
      budgetNotSure: this.budgetNotSure
    };

    var emailText = `
    NUEVA SOLICITUD DE VIAJE PERSONALIZADO

    ━━━━━━━━━━━━━━━━━━━
    DATOS DEL VIAJE
    ━━━━━━━━━━━━━━━━━━━

    Origen: ${payload.origin}
    Destino: ${payload.destination}
    Días disponibles: ${payload.daysAvailable}
    Número de viajeros: ${payload.travelers}

    Presupuesto: ${
      payload.budgetNotSure
        ? 'No definido'
        : `${payload.budget} ${payload.currency}`
    }

    Fechas fijas: ${payload.hasFixedDates ? 'Sí' : 'No'}

    ${
      payload.hasFixedDates
        ? `Fechas:
    - Desde: ${payload.startDate}
    - Hasta: ${payload.endDate}`
        : ''
    }

    ━━━━━━━━━━━━━━━━━━━
    DETALLES DEL VIAJE
    ━━━━━━━━━━━━━━━━━━━

    ${
      payload.extraInfo
        ? payload.extraInfo
        : 'No ha añadido información adicional.'
    }

    ━━━━━━━━━━━━━━━━━━━
    DATOS DE CONTACTO
    ━━━━━━━━━━━━━━━━━━━

    Teléfono: ${payload.phoneCountryCode} ${payload.phone}
    Email: ${payload.email}

    ━━━━━━━━━━━━━━━━━━━
    CONSENTIMIENTO
    ━━━━━━━━━━━━━━━━━━━

    Acepta política de datos: ${payload.acceptedPolicy ? 'Sí' : 'No'}
    Acepta promociones y novedades: ${payload.acceptedMarketing ? 'Sí' : 'No'}

    ━━━━━━━━━━━━━━━━━━━
    `;

    var data = {
      'subject': 'Solicitud viaje personalizado',
      'body': emailText,
      'correo': payload.email
    }

    this.apiService.sendMail(data).subscribe({
      next: (response) => {
        this.showSuccessMessage = true;
        this.submitError = false;
        this.isSubmitting = false;
        this.submitForm.emit(payload);
      },
      error: (error) => {
        this.submitError = true;
        this.showSuccessMessage = false;
        this.isSubmitting = false;
      }
    });
  }
}