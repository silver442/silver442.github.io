# Claude Context — silver442.github.io

## Propósito del Proyecto

Portafolio personal profesional de **Silvestre Hernández Hernández**, desarrollador de software. Alojado en GitHub Pages como tarjeta de presentación online.

## Tecnologías

- HTML5, CSS3 vanilla, JavaScript vanilla (sin frameworks ni npm)
- Google Fonts: Inter (body), Poppins (headings)
- Sin build tools — se sirve directamente como archivos estáticos

## Estructura de Archivos

```
silver442.github.io/
├── index.html            # Página principal (única página activa)
├── segundapagina.html    # Segunda página (vacía, sin uso activo)
├── css/
│   ├── style.css         # Estilos base + variables CSS (571 líneas)
│   ├── movil.css         # Media queries < 768px (menú hamburguesa, layout)
│   ├── tablet.css        # Breakpoint 600px+ (actualmente vacío)
│   └── desktop.css       # Breakpoint 800px+ (timeline alternada)
├── js/
│   └── main.js           # Carrusel + menú hamburguesa (93 líneas)
└── Img/
    ├── Logo.png / Logo.ico / Logo2.png / Yo.jpg
    ├── HabilidadesLogo/   # 8 SVGs de tecnologías
    ├── Certificados/      # 6 imágenes de certificaciones
    └── proyectos/         # Capturas de proyectos
```

## Secciones del Portafolio (index.html)

| Sección | Descripción |
|---|---|
| Header/Nav | Navegación fija, logo, menú hamburguesa en móvil |
| Hero | Saludo, título profesional, CTA "Ver mis proyectos" |
| Experiencia | Timeline con 2 empleos: BAINUB (2025–hoy) y E-Software (2023) |
| Proyectos | HEB-POS y DigiTutos, con links a demo, GitHub y YouTube |
| Habilidades | 8 tecnologías: HTML5, CSS3, JS, Git, Figma, Python, Java, React |
| Certificados | Carrusel automático de 6 certificaciones |
| Footer | Email, LinkedIn, GitHub |

## Sistema de Estilos

Variables CSS definidas en `style.css`:

```css
--bg-main: #0f172a       /* Fondo oscuro principal */
--primary-color: #38bdf8 /* Acento cyan */
--text-main: #f8fafc     /* Texto claro */
--text-muted: #94a3b8    /* Texto secundario */
```

- Tema visual: dark mode moderno con acentos cyan/turquoise
- Layout: Flexbox para nav/hero/footer, CSS Grid para proyectos y habilidades
- Responsividad: Mobile-first, breakpoints en 600px y 800px
- Efectos: hover con translateY, escala, sombras, transiciones 0.3s ease
- Scroll Timeline API para animación del header al hacer scroll

## JavaScript (main.js)

1. **Carrusel de certificados:** Automático cada 3.5s, botones prev/next, pausa en hover, transform CSS
2. **Menú hamburguesa:** Toggle clase "active", cierre al navegar, animación de barras → X

## Cache Busting

Los archivos CSS y JS llevan query param `?v=1.1`:
```html
<link rel="stylesheet" href="css/style.css?v=1.1">
<script src="js/main.js?v=1.1"></script>
```
Al modificar archivos, incrementar la versión para forzar recarga en browsers.

## Convenciones del Proyecto

- Idioma del código: español en comentarios y commits
- Sin dependencias externas (no instalar npm packages sin razón fuerte)
- Mobile-first: cualquier cambio de estilos debe verificarse en móvil primero
- Commits descriptivos en español: `se añade X`, `se modifica Y`, `se corrige Z`
- Ramas: `main` (producción) y `Develop`

## Proyectos Showcaseados

| Proyecto | Links |
|---|---|
| HEB-POS | Demo + repositorio GitHub |
| DigiTutos | Sitio web + canal YouTube |
