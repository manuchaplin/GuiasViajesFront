export interface Discount {
  label: string;
  title: string;
  description: string;
  details: string;
  code: string;
  url: string;
  image: string;
  buttonText: string;
  points: string[];
}

export const DISCOUNTS: Discount[] = [
    {
      label: 'Actividades y reservas',
      title: 'GetYourGuide',
      description:
        'Reserva excursiones, entradas y actividades con descuento desde la app.',
      details:
        'Si te gusta llevar parte del viaje reservada con antelación, este descuento te puede venir muy bien. Puedes usarlo para actividades, tours, excursiones o entradas y ahorrar un poco más al hacer la reserva desde la app móvil.',
      code: 'YANNITAGASTONCITA5',
      url: 'https://gyg.me/yannitagastoncita-app',
      image: 'assets/images/getyourguide.jpg',
      buttonText: 'Ir a GetYourGuide',
      points: [
        '5 % de descuento en actividades',
        'Aplicable desde la app móvil',
        'Útil para tours, entradas y excursiones',
        'Perfecto para organizar planes antes del viaje'
      ]
    },
    {
      label: 'Fotolibros y recuerdos',
      title: 'Colorland',
      description:
        'Guarda tus viajes en un fotolibro bonito y con mejor precio.',
      details:
        'Con este descuento puedes pedir tus fotolibros en Colorland con una rebaja muy interesante. Es una opción genial si te gusta imprimir recuerdos de tus viajes, preparar álbumes especiales o hacer un regalo más personal.',
      code: 'YANNITA50',
      url: 'https://www.colorland.com/es/',
      image: 'assets/images/colorland.jpg',
      buttonText: 'Ir a Colorland',
      points: [
        '50 % de descuento en fotolibros',
        'Válido para modelos clásicos y layflat',
        'Ideal para guardar recuerdos de viaje',
        'Perfecto para regalo o álbum personal'
      ]
    }
  ];