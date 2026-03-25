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
    id: 'Roma',
    title: 'Roma en 4 días',
    destination: 'Roma, Italia',
    duration: 'Ruta de 4 días',
    image: 'assets/images/Roma.jpg',
    description:
      'Una guía práctica para disfrutar Roma con una ruta clara, planes bien organizados y consejos para aprovechar el viaje sin ir improvisando cada día.',
    highlight: 'Ideal para primera visita',
    related_guides: ['paris', 'islandia']
  },
  {
    id: 'paris',
    title: 'París Bonito y Práctico',
    destination: 'París, Francia',
    duration: 'Escapada de 3 días',
    image: 'assets/images/Paris.jpg',
    description:
      'Descubre una forma más fácil de organizar París con una guía visual, recomendaciones útiles y una ruta pensada para disfrutar sin perder tiempo.',
    highlight: 'Ruta visual y fácil de seguir',
    related_guides: ['roma', 'islandia']
  },
  {
    id: 'islandia',
    title: 'Islandia, 7 días en camper van',
    destination: 'Islandia',
    duration: 'Ruta de 7 días',
    image: 'assets/images/Islandia.jpg',
    description:
      'Miradores, barrios bonitos, planes bien repartidos y una propuesta práctica para vivir Islandia con más orden y con menos dudas.',
    highlight: 'Perfecta para escapadas',
    related_guides: ['roma', 'paris']
  }
];