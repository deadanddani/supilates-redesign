import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Los esquemas hacen fallar la compilacion ante contenido malformado.
 * Es deliberado: la web original publica el post de ejemplo de WordPress
 * porque nada le impide publicar contenido a medio hacer.
 */

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    titulo: z.string().min(1),
    resumen: z.string().min(1),
    icono: z.enum([
      'maquina',
      'corazon',
      'grupo',
      'personal',
      'mayores',
      'embarazo',
      'terapeutico',
    ]),
    orden: z.number().int().positive(),
    destacado: z.boolean().default(false),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonios' }),
  schema: z.object({
    autor: z.string().min(1),
    fuente: z.string().default('Reseña en Google'),
    orden: z.number().int().positive(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    pregunta: z.string().min(1),
    orden: z.number().int().positive(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    fecha: z.coerce.date(),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { servicios, testimonios, faq, blog };
