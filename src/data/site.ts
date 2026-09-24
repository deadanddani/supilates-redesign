/*
 * Unica fuente de verdad para los datos de contacto del estudio.
 *
 * De aqui salen la cabecera, el pie, los enlaces tel:/mailto: y el JSON-LD.
 * En el WordPress original estos datos estan repetidos en varias plantillas
 * de Divi, que es exactamente como se desincronizan.
 *
 * AVISO: estos valores estan tomados de supilatesbyflor.com y NO han sido
 * confirmados con la propietaria. Ver docs/superpowers/specs/ seccion 12.
 */

export const site = {
  name: 'Su Pilates by Flor',
  tagline: 'Fortalece tu Cuerpo, Mente y Espíritu',
  description:
    'Clases de pilates con máquina en Alcalá de Henares. Grupos de 4 o 5 personas, 55 minutos y una rutina adaptada a tus necesidades.',
  city: 'Alcalá de Henares',

  phone: '611 78 94 88',
  phoneHref: 'tel:+34611789488',
  phoneE164: '+34611789488',
  email: 'info@supilatesbyflor.com',
  emailHref: 'mailto:info@supilatesbyflor.com',

  address: {
    street: 'Avenida Caballería Española 14',
    postalCode: '28805',
    locality: 'Alcalá de Henares',
    region: 'Madrid',
    country: 'ES',
  },

  hours: [
    {
      days: 'Lun – Vie',
      time: '8:00 – 21:00',
      schema: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '21:00',
      },
    },
    {
      days: 'Sáb',
      time: '10:00 – 13:00',
      schema: { days: ['Saturday'], opens: '10:00', closes: '13:00' },
    },
  ],

  /* Acortador de terceros: verificar que sigue vivo antes de presentar. */
  whatsapp: 'https://wa.link/4oru75',

  /*
   * Solo Instagram. Los enlaces de Facebook y YouTube de su web no tienen
   * destino (hallazgo 4 de la auditoria): replicar un enlace roto no aporta.
   */
  social: {
    instagram: 'https://www.instagram.com/supilatesbyflor/',
  },

  /*
   * Su web publica el rotulo "EXCELENTE" y el recuento, pero NINGUNA nota
   * numerica. No se inventa una cifra ni se declara a Google.
   */
  reviews: {
    count: 89,
    label: 'Excelente',
    source: 'Google',
  },

  /* Datos de la barra de confianza, todos tomados de sus propios textos. */
  facts: {
    classMinutes: 55,
    groupSize: 5,
    monthsOpen: 12,
  },
} as const;

export type Site = typeof site;
