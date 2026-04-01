import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { CustomTripModalComponent } from '../custom-trip-modal/custom-trip-modal.component';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { GUIDES, Guide } from '../../data/guides.data';
import { Discount, DISCOUNTS } from '../../data/discounts.data';
import { Benefit, BENEFITS } from '../../data/benefits.data';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTripModalComponent, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('guidesSlider') guidesSlider?: ElementRef<HTMLDivElement>;

  private readonly siteUrl = 'https://rumboatlas.com';
  private readonly siteName = 'RumboAtlas';
  private readonly defaultImage = 'https://rumboatlas.com/assets/images/rumbo-atlas-portada.png';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
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

  ngOnInit(): void {
    const pageTitle = 'RumboAtlas | Guías de viaje, rutas e itinerarios';
    const description =
      'Descubre guías de viaje, rutas e itinerarios prácticos para organizar tu viaje de forma fácil. Descarga guías gratis y consigue planificación personalizada.';
    const image = this.defaultImage;
    const url = `${this.siteUrl}/`;

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'RumboAtlas - guías de viaje, rutas e itinerarios'
    });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.updateCanonicalUrl(url);
    this.setHomeStructuredData();
  }

  ngOnDestroy(): void {
    this.removeStructuredData();
  }

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
    const element = this.document.getElementById('guides');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToCustomTrip(): void {
    const element = this.document.getElementById('custom-trip');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToDiscounts(): void {
    const element = this.document.getElementById('discounts');
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

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setHomeStructuredData(): void {
    this.removeStructuredData();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'home-structured-data';

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: this.siteName,
          url: `${this.siteUrl}/`,
          logo: `${this.siteUrl}/assets/images/logo.png`,
          sameAs: [
            'https://instagram.com/yannita.gastoncita'
          ]
        },
        {
          '@type': 'WebSite',
          name: this.siteName,
          url: `${this.siteUrl}/`,
          inLanguage: 'es'
        }
      ]
    };

    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  private removeStructuredData(): void {
    const oldScript = this.document.getElementById('home-structured-data');
    if (oldScript) {
      oldScript.remove();
    }
  }
}