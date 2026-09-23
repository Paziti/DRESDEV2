# Dresde

Landing de marca para Dresde, peluquería y barbería en Bahía Blanca ([@dresde.co](https://www.instagram.com/dresde.co/)). Next.js 16 (App Router), TypeScript, Tailwind v4 y Framer Motion.

## Versiones

| Versión | Dónde vive | Estado |
|---|---|---|
| v1 | rama `main` | La que está publicada hoy en Vercel. No se toca. |
| v2 | rama `v2` (tag `v2.0.0`) | Esta versión: rediseño tipográfico (Big Shoulders + Manrope), favicon y OG con el logo real, arreglos de las auditorías en `anti-slop/`. |

Para comparar las dos: `git diff main..v2`, o en GitHub `compare/main...v2`.

La v2 no depende de Vercel: no usa paquetes `@vercel/*` ni `vercel.json`, y corre en cualquier servidor con Node.

## Desarrollo

Requiere Node 20.9 o más nuevo y pnpm.

```bash
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # build de producción
pnpm start   # sirve el build en el puerto 3000 (PORT=xxxx para cambiarlo)
pnpm lint    # eslint
```

## Deploy sin Vercel

Es una app Next.js estándar. En cualquier host con Node (VPS, Railway, Render, Fly, etc.):

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

La optimización de imágenes de `next/image` corre en el propio servidor (con `sharp`, que Next instala solo). La imagen de vista previa (`opengraph-image.tsx`) se genera en el build.

El dominio que usan los metadatos (OG, canonical) está en `siteUrl`, en `src/app/layout.tsx`. Cambialo si la v2 se publica en otro dominio.

## Datos de las sucursales

Todo el contenido por local vive en un solo lugar: [`src/lib/locations.ts`](src/lib/locations.ts).

**Real** (viene directo del bio de Instagram de @dresde.co): las 5 direcciones y sus links de WhatsApp, y la foto de fachada de cada local (`images[0]`).

Son 5 sucursales en total (lo confirma el caption de un post de aniversario del propio Instagram), así que las 5 direcciones ya cargadas son la lista completa.

**Mock / placeholder** (reemplazar antes de lanzar):
- Horarios, precios de servicios, nombres y roles de barberos (salvo Franco Lanza en Dresde Alem, que es real).
- Las 2 fotos secundarias de la galería de cada local (interior, sillón de trabajo).
- La sección Instagram (`src/lib/gallery.ts`) tiene 2 fotos reales bajadas del perfil (una es el cover de un Reel) y 4 placeholders. Sumar más posts reales cuando se elijan.

Para agregar o editar un local, solo hace falta tocar `locations.ts`: todos los componentes leen de esa estructura, no hay nada hardcodeado en el JSX.

## Transición hero → contenido

`hero-scene-transition.tsx` funde el Hero y un video en una sola escena continua controlada por scroll: no hay un bloque de video aparte entre dos secciones. El contenedor mide `SCENE_VH` (260vh), pero `scrollYProgress` (Motion `useScroll`) no sigue solo eso: usa `offset: ["start start", "end start"]` para trackear el recorrido COMPLETO del sticky, no solo su fase "pineada".

Esto importa porque un panel `sticky` de 100lvh (el alto grande del viewport, para que en mobile cubra también cuando se esconde la barra del navegador) dentro de un contenedor de 260vh tiene dos fases: se queda fijo (`top:0`) mientras se scrollean los primeros 160vh (`PINNED_VH`), y después necesita otros 100vh completos (su propia altura) para deslizarse fuera de pantalla una vez que se despega. Es inherente al mecanismo de `position: sticky`, no algo agregado. Con el offset típico (`"end end"`), `progress` solo cubre esa fase fija y se congela en 1 apenas el panel se despega, dejando el resto (~100vh, "~2 scrolls") sin ninguna animación: lo que sea que haya quedado en pantalla en ese instante se ve congelado durante todo ese tramo. Con `"end start"`, `progress` 0→1 cubre los 260vh enteros (fase fija + deslizamiento), así que se puede seguir animando durante el deslizamiento también.

Los momentos de la fase fija se escriben como proporción de ella con `pin(share)` (0 = arriba, 1 = cuando el panel se despega):

1. `pin(0)`→`pin(0.075)`: zona muerta, nada se mueve todavía. Sin esto, el hero empezaba a desvanecerse con el primer píxel de scroll, lo que se sentía prematuro.
2. `pin(0.075)`→`pin(0.375)`: el hero se desvanece y sube (`opacity`/`translateY`).
3. `pin(0.375)`→`pin(0.72)`: recién cuando el hero terminó de retirarse, el video se revela desde el borde inferior hacia arriba vía `clip-path: inset()` (no vía opacity), con un leve dolly-in (`scale` 0.88→1.08) que termina en `pin(1)`, justo cuando el panel se despega.
4. El video se mantiene completamente visible durante casi todo el deslizamiento.
5. En los últimos 27vh el video se desvanece y llega a `opacity: 0` justo cuando el panel termina de salir de pantalla, así que no queda ningún tramo negro antes de "Elegí tu Dresde".

**Para cambiar la velocidad de la transición, se toca un solo número: `SCENE_VH`.** Más vh = más scroll = más lenta; todos los momentos escalan con él. Pasó de 180vh a 260vh para que la transición sea más lenta (el doble de recorrido en la fase fija).

El hero vive en su propia capa (`z-10`) por encima del video (`z-0`). No es un cross-dissolve: mientras el hero tiene cualquier opacidad, el video literalmente no tiene área visible (`clip-path` en `inset(100%)`), así que nunca se ve el video "atravesando" o mezclado con el logo. Todo depende de `scrollYProgress` (Motion `useScroll` + `useTransform`), nunca de una duración fija, así que scrollear para arriba revierte la escena exactamente frame a frame. Con `prefers-reduced-motion` se muestran hero y video en bloques estáticos, sin sticky ni transform, y el video queda como un cuadro fijo (sin autoplay).

`VIDEO_OBJECT_POSITION` ("70% center") corrige el encuadre en mobile. En desktop `object-cover` apenas recorta el clip horizontalmente y se ve el cuadro casi completo (la acción de corte cae notoriamente a la derecha del centro, con fondo desenfocado vacío a la izquierda). En un viewport angosto/portrait, `object-cover` recorta mucho más el ancho, y el anclaje por defecto (50%, centro) caía justo en esa zona vacía: se veía "el lado izquierdo" en vez de la acción. Si hace falta afinarlo más, es ese único valor.

El `clip-path` (reveal) y el `scale` (dolly-in) del video viven en dos elementos distintos a propósito: una máscara siempre del tamaño exacto del viewport que solo tiene el `clip-path`, y adentro un `<video>` sobredimensionado (130% ancho/alto) que solo tiene el `scale`. Ponerlos en el mismo elemento hacía que, al achicarse a 0.88 al inicio del reveal, el video dejara franjas negras en los bordes (se veía "cortado" arriba, negro abajo). Con el video siempre de sobra más grande que la máscara, cualquier escala dentro de su rango sigue cubriendo el 100% de la ventana revelada. El ancho del video usa `vw`/`maxWidth:none` explícitos porque el preflight de Tailwind le pone `max-width: 100%` a todo `<video>`/`<img>`, que de otro modo recortaba el ancho de vuelta a 100% del contenedor pese al `width` explícito (el alto no tiene ese preflight y sí escalaba bien; la asimetría fue la pista para encontrar la causa).

**Importante: por qué el `sticky` necesita `overflow-x-clip`, no `overflow-x-hidden`, en `html`/`body`.** Por spec de CSS, poner overflow explícito en un solo eje fuerza el otro eje a `auto` en el elemento. Con `overflow-x-hidden` en `<html>` y `<body>` (`layout.tsx`), ambos terminaban con `overflow-y: auto` implícito: dos contenedores de scroll al mismo tiempo, que rompe el cálculo de `position: sticky` en Chrome (el panel nunca queda fijo, se desplaza como contenido normal). `overflow-clip` no participa de esa propagación: previene el overflow horizontal sin convertir a html/body en scroll containers. Si en el futuro hace falta volver a tocar el overflow de html/body, mantener ambos ejes explícitos (`overflow-x-clip overflow-y-visible`) para no reintroducir el bug.

El `opacity` del hero y el `clip-path`/`opacity` del video se escriben al DOM a mano desde sus `MotionValue` (`useMotionValueEvent`) en lugar de vía el `style` prop de Framer Motion: en este componente, cualquier propiedad no-transform mezclada con `scale`/`y` en el mismo objeto de estilo, Framer la recalculaba bien pero no la commiteaba al DOM (sí lo hacía con las props de transform). `scale`/`y` siguen yendo por el camino normal de Framer sin problema.

El video (no es contenido de Dresde: clip de stock genérico, `public/video/clipper-curtain.mp4`, licencia libre de Pexels) se reproduce solo mientras la escena está en viewport (`useInView`). Reemplazable por cualquier otro clip corto (sin gente hablando, sin texto en pantalla) cambiando `VIDEO_SRC`.

## Estructura

```
src/
  app/                    # layout, página, metadata/SEO, favicon (águila del logo) y OG con el logo real
  components/dresde/      # componentes propios del sitio (locations-grid.tsx adapta el hover-expand de @skiper-ui/skiper52)
  lib/                    # tipos, datos, horarios, helpers de WhatsApp/mapa, tokens de motion
public/
  brand/                  # logo
  gallery/                # fotos reales del Instagram
  locations/              # fotos de fachada
  team/                   # fotos de barberos
  video/                  # clip de la transición hero → contenido
anti-slop/                # auditorías y plan de diseño de la v2
```
