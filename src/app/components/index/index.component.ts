import { Component, ElementRef, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { CustomTripModalComponent } from '../custom-trip-modal/custom-trip-modal.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { GUIDES, Guide } from '../../data/guides.data';
import { Discount, DISCOUNTS } from '../../data/discounts.data';
import { Benefit, BENEFITS } from '../../data/benefits.data';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTripModalComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  @ViewChild('guidesSlider') guidesSlider?: ElementRef<HTMLDivElement>;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {}

  brandName = 'RumboAtlas';

  whatsappLink =
    'https://wa.me/34600000000?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20una%20gu%C3%ADa%20o%20un%20viaje%20personalizado';

  selectedGuide: Guide | null = null;
  guideSuggestion = '';
  guideSearch = '';

  showCustomTripModal = false;

  suggestionSent = false;
  suggestionSending = false;

  copiedCode: string | null = null;

  ngOnInit(): void {
    this.title.setTitle('Guías de viaje gratis y planificación personalizada | RumboAtlas');

    this.meta.updateTag({
      name: 'description',
      content: 'Descarga guías de viaje gratuitas y organiza tu viaje de forma clara con rutas prácticas y consejos útiles.'
    });
  }

  guides: Guide[] = GUIDES;
  discounts: Discount[] = DISCOUNTS;
  benefits: Benefit[] = BENEFITS;

  process = [
    {
      title: 'Me cuentas cómo quieres viajar',
      text: 'Dime el destino que tienes en mente, tus fechas, el estilo de viaje que te gusta y lo que te gustaría ver.'
    },
    {
      title: 'Busco opciones que encajen contigo',
      text: 'Te ayudo a encontrar mejores fechas, vuelos y alojamientos para que no tengas que comparar todo por tu cuenta.'
    },
    {
      title: 'Recibes una propuesta más clara',
      text: 'Te preparo un itinerario personalizado y recomendaciones pensadas para que el viaje tenga sentido y se adapte a ti.'
    }
  ];

  services = [
    'Guías digitales gratuitas listas para descargar',
    'Ayuda para encontrar mejores fechas para viajar',
    'Búsqueda de vuelos según tu idea de viaje',
    'Opciones de alojamiento adaptadas a lo que buscas',
    'Itinerario personalizado según tus gustos',
    'Consejos prácticos para organizar el viaje con más claridad'
  ];


  get filteredGuides(): Guide[] {
    const query = this.guideSearch.trim().toLowerCase();

    if (!query) {
      return this.guides;
    }

    return this.guides.filter((guide) => {
      return (
        guide.title.toLowerCase().includes(query) ||
        guide.destination.toLowerCase().includes(query) ||
        guide.highlight.toLowerCase().includes(query)
      );
    });
  }

  get isSuggestionValid(): boolean {
    return this.guideSuggestion.trim().length > 0;
  }

  openGuidePage(guide: Guide): void {
    this.router.navigate(['/guia', guide.id]);
  }

  openCustomTripModal(): void {
    this.showCustomTripModal = true;
  }

  closeCustomTripModal(): void {
    this.showCustomTripModal = false;
  }

  handleCustomTripSubmit(data: any): void {
    console.log('Solicitud de viaje personalizado enviada');
    console.log(data);
    this.closeCustomTripModal();
  }

  closeGuideModal(): void {
    this.selectedGuide = null;
  }

  handleGuideSubmit(data: { email: string; acceptedPolicy: boolean; guideTitle: string }): void {
    console.log('ok');
    console.log(data);
    this.closeGuideModal();
  }

  submitSuggestion(): void {
    if (!this.isSuggestionValid || this.suggestionSending) {
      return;
    }

    this.suggestionSending = true;
    this.suggestionSent = false;

    const data = {
      subject: 'Sugerencia de guía',
      body: this.guideSuggestion
    };

    this.apiService.sendMail(data).subscribe({
      next: () => {
        this.guideSuggestion = '';
        this.suggestionSending = false;
        this.suggestionSent = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.suggestionSent = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.guideSuggestion = '';
        this.suggestionSending = false;
        this.suggestionSent = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.suggestionSent = false;
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  scrollGuides(direction: 'left' | 'right'): void {
    const slider = this.guidesSlider?.nativeElement;

    if (!slider) {
      return;
    }

    const amount = Math.min(420, slider.clientWidth * 0.9);

    slider.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth'
    });
  }

  scrollToGuides(): void {
    const element = document.getElementById('guides');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToCustomTrip(): void {
    const element = document.getElementById('custom-trip');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToDiscounts(): void {
    const element = document.getElementById('discounts');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  copyDiscountCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCode = code;

      setTimeout(() => {
        if (this.copiedCode === code) {
          this.copiedCode = null;
        }
      }, 2000);
    }).catch(() => {
      this.copiedCode = null;
    });
  }
}