import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';

/*
 * La red que su WordPress no tiene: por eso lleva "Hello world!" publicado.
 * Un contenido malformado debe romper la compilacion, no publicar una pagina rota.
 */
test('un servicio sin icono rompe la compilacion', () => {
  const ruta = 'src/content/servicios/__roto.md';
  writeFileSync(ruta, '---\ntitulo: Roto\nresumen: Le falta el icono\norden: 99\n---\n');
  let fallo = false;
  let salida = '';
  try {
    execFileSync('npx', ['astro', 'build'], { stdio: 'pipe', encoding: 'utf8' });
  } catch (e: unknown) {
    fallo = true;
    const err = e as { stdout?: string; stderr?: string };
    salida = `${err.stdout ?? ''}${err.stderr ?? ''}`;
  } finally {
    rmSync(ruta, { force: true });
  }
  expect(fallo, 'la compilacion deberia haber fallado').toBe(true);
  expect(salida, 'el error deberia nombrar el archivo culpable').toContain('__roto');
});
