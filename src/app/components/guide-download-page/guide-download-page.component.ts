import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { GUIDES, Guide } from '../../data/guides.data';
import { DISCOUNTS, Discount } from '../../data/discounts.data';

@Component({
  selector: 'app-guide-download-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './guide-download-page.component.html',
  styleUrl: './guide-download-page.component.scss'
})
export class GuideDownloadPageComponent implements OnInit, OnDestroy {
  @ViewChild('relatedGuidesSlider') relatedGuidesSlider?: ElementRef<HTMLDivElement>;

  guide: Guide | null = null;
  relatedGuides: Guide[] = [];
  discounts: Discount[] = DISCOUNTS;

  email = '';
  acceptedPolicy = false;
  acceptedMarketing = false;

  emailTouched = false;
  hasTriedSubmit = false;
  isSubmitting = false;
  showSuccessMessage = false;
  guideNotFound = false;

  copiedCode: string | null = null;

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Cambia esto por tu dominio real
  private readonly siteUrl = 'https://rumboatlas.azurewebsites.net/'; 
  private readonly siteName = 'RumboAtlas';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')?.toLowerCase().trim();

      if (!id) {
        this.handleGuideNotFound();
        return;
      }

      const foundGuide = GUIDES.find((item) => item.id.toLowerCase() === id);

      if (!foundGuide) {
        this.handleGuideNotFound();
        return;
      }

      this.guideNotFound = false;
      this.guide = foundGuide;

      this.relatedGuides = foundGuide.related_guides
        .map((relatedId) => GUIDES.find((item) => item.id === relatedId))
        .filter((item): item is Guide => !!item);

      this.setGuideMetadata(foundGuide);
      this.resetFormState();

      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  ngOnDestroy(): void {
    this.removeStructuredData();
  }

  get trimmedEmail(): string {
    return this.email.trim();
  }

  get isEmailValid(): boolean {
    return this.emailPattern.test(this.trimmedEmail);
  }

  get showEmailError(): boolean {
    return (
      (this.emailTouched || this.hasTriedSubmit) &&
      this.trimmedEmail.length > 0 &&
      !this.isEmailValid
    );
  }

  get isFormValid(): boolean {
    return this.isEmailValid && this.acceptedPolicy && this.acceptedMarketing;
  }

  get canSubmit(): boolean {
    return this.isFormValid && !this.isSubmitting;
  }

  goToGuide(id: string): void {
    this.router.navigate(['/guia', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goToMainWebsite(): void {
    this.router.navigate(['/']);
  }

  scrollRelatedGuides(direction: 'left' | 'right'): void {
    const slider = this.relatedGuidesSlider?.nativeElement;

    if (!slider) {
      return;
    }

    const amount = Math.min(420, slider.clientWidth * 0.9);

    slider.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth'
    });
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

  onSubmit(): void {
    if (!this.guide) {
      return;
    }

    this.hasTriedSubmit = true;
    this.emailTouched = true;
    

    if (!this.isFormValid || this.isSubmitting) {
      return;
    }

    this.showSuccessMessage = true;

    const data = {
      correo: this.trimmedEmail,
      consentimiento: this.acceptedPolicy,
      consentimientoMarketing: this.acceptedMarketing,
      idGuia: this.guide.id
    };

    this.apiService.requestGuide(data).subscribe({
      next: (response) => {
        this.showSuccessMessage = true;
      },
      error: (error) => {
        console.error('Error al solicitar la guía', error);
        this.showSuccessMessage = false;
      }
    });
  }

  private resetFormState(): void {
    this.email = '';
    this.acceptedPolicy = false;
    this.acceptedMarketing = false;
    this.emailTouched = false;
    this.hasTriedSubmit = false;
    this.isSubmitting = false;
    this.showSuccessMessage = false;
  }

  private handleGuideNotFound(): void {
    this.guideNotFound = true;
    this.guide = null;
    this.relatedGuides = [];

    const title = 'Guía no encontrada | RumboAtlas';
    const description = 'La guía que buscas no está disponible ahora mismo.';
    const url = `${this.siteUrl}/guia`;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'noindex,follow' });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    this.updateCanonicalUrl(url);
    this.removeStructuredData();
    this.resetFormState();
  }

  private setGuideMetadata(guide: Guide): void {
    const title = `${guide.title} | Guía de viaje gratis | ${this.siteName}`;
    const description = `Descarga gratis la guía de ${guide.title}. Encuentra una ruta práctica, visual y clara para organizar mejor tu viaje.`;
    const url = `${this.siteUrl}/guia/${guide.id}`;
    const image = this.toAbsoluteUrl(guide.image);

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: `Portada de la guía ${guide.title}` });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.updateCanonicalUrl(url);
    this.setStructuredData(guide, url, image, description);
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

  private setStructuredData(
    guide: Guide,
    url: string,
    image: string,
    description: string
  ): void {
    this.removeStructuredData();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'guide-structured-data';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: guide.title,
      url,
      description,
      image,
      isPartOf: {
        '@type': 'WebSite',
        name: this.siteName,
        url: this.siteUrl
      },
      about: {
        '@type': 'Thing',
        name: guide.destination
      }
    };

    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  private removeStructuredData(): void {
    const oldScript = this.document.getElementById('guide-structured-data');
    if (oldScript) {
      oldScript.remove();
    }
  }

  private toAbsoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${this.siteUrl}/${path.replace(/^\/+/, '')}`;
  }
}