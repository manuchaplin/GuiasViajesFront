export interface Guide {
  id: string;
  title: string;
  destination: string;
  duration: string;
  image: string;
  description: string;
  highlight: string;
  related_guides: string[];
}

export const GUIDES: Guide[] = [
  {
    id: 'roma',
    title: 'Lo mejor de Roma en 2 días',
    destination: 'Roma, Italia',
    duration: 'Ruta de 2 días',
    image: 'assets/images/Roma.jpg',
    description:
      'Una guía práctica para disfrutar Roma con una ruta clara, planes bien organizados y consejos para aprovechar el viaje sin ir improvisando cada día.',
    highlight: 'Ideal para primera visita',
    related_guides: ['paris', 'londres', 'madrid']
  },
  {
    id: 'paris',
    title: 'París sin perderte nada, ruta de 3 días',
    destination: 'París, Francia',
    duration: 'Ruta de 3 días',
    image: 'assets/images/Paris.jpg',
    description:
      'Un recorrido pensado para descubrir París combinando monumentos icónicos, barrios con encanto y pausas gastronómicas sin perder tiempo en desplazamientos.',
    highlight: 'Perfecta para escapadas',
    related_guides: ['roma', 'londres', 'madrid']
  },
  {
    id: 'londres',
    title: 'Londres en 3 días, lo esencial',
    destination: 'Londres, Reino Unido',
    duration: 'Ruta de 3 días',
    image: 'assets/images/Londres.jpg',
    description:
      'Una ruta equilibrada para conocer Londres mezclando historia, mercados locales y zonas modernas con una planificación clara para moverte sin complicaciones.',
    highlight: 'Ideal para conocer lo escencial',
    related_guides: ['roma', 'paris', 'madrid']
  },
  {
    id: 'madrid',
    title: 'Madrid en 3 días, itinerario completo',
    destination: 'Madrid, España',
    duration: 'Ruta de 3 días',
    image: 'assets/images/Madrid.jpg',
    description:
      'Una guía para vivir Madrid entre cultura, tapeo y barrios con ambiente, organizada para que disfrutes cada zona sin prisas y con una ruta fácil de seguir.',
    highlight: 'Ideal para primera visita',
    related_guides: ['roma', 'londres', 'paris']
  },
  {
    id: 'new_york',
    title: 'Ruta de 3 días por Nueva York',
    destination: 'New York, Estados Unidos',
    duration: 'Ruta de 3 días',
    image: 'assets/images/NewYork.jpg',
    description:
      'Un itinerario dinámico para explorar Nueva York entre rascacielos, parques y barrios icónicos con una planificación clara para aprovechar cada jornada.',
    highlight: 'Perfecta para ver lo mejor',
    related_guides: ['londres']
  },
  {
    id: 'tailandia',
    title: 'Tailandia en 15 días, viaje completo',
    destination: 'Tailandia',
    duration: 'Ruta de 15 días',
    image: 'assets/images/Tailandia.jpg',
    description:
      'Una propuesta de viaje por Tailandia combinando templos, playas y ciudades vibrantes con una ruta bien organizada para disfrutar sin complicaciones.',
    highlight: 'Ruta completa',
    related_guides: ['islandia']
  },
  {
    id: 'islandia',
    title: 'Islandia, 7 días en camper',
    destination: 'Islandia',
    duration: 'Ruta de 7 días',
    image: 'assets/images/Islandia.jpg',
    description:
      'Un recorrido por Islandia entre cascadas, glaciares y paisajes únicos con una planificación clara para viajar en camper sin dudas durante todo el viaje.',
    highlight: 'Perfecta para aventureros',
    related_guides: ['tailandia']
  }
];