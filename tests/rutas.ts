// baseURL termina en barra, asi que las rutas van sin barra inicial:
// new URL('nosotros', 'http://host/supilates-redesign/') -> /supilates-redesign/nosotros
export const R = {
  home: './',
  nosotros: 'nosotros',
  blog: 'blog',
  avisoLegal: 'aviso-legal',
  privacidad: 'privacidad',
  cookies: 'cookies',
} as const;

export const RUTAS_PUBLICAS = [R.home, R.nosotros, R.blog, R.avisoLegal, R.privacidad, R.cookies];
