# AI Design Studio

Quiero construir una aplicación web interna de AI-assisted graphic design para equipos de marketing y diseño.

IMPORTANTE:

Este proyecto NO es simplemente un generador de imágenes con IA.

El objetivo es construir el primer prototipo funcional de un "AI Design Copilot / AI Creative Director" que ayude a un equipo de diseño a producir piezas gráficas para redes sociales mucho más rápido, manteniendo consistencia visual, jerarquía, legibilidad y calidad.

La aplicación debe ser construida inicialmente como un prototipo funcional y visualmente pulido, preparado para posteriormente ser exportado a GitHub, continuar su desarrollo en Cursor y utilizar Claude Code para implementar las integraciones y lógica avanzada.

NO quiero que intentes construir todas las integraciones externas todavía.

NO quiero depender de APIs pagas para que el prototipo pueda demostrarse.

NO quiero una arquitectura cerrada que después sea difícil de extender.

Quiero una arquitectura modular, limpia y preparada para conectar posteriormente Gemini, OpenAI, Higgsfield, Canva y otros servicios.

==================================================

1. CONTEXTO DEL PRODUCTO

==================================================

La organización produce contenido gráfico para redes sociales.

Actualmente, un diseñador humano debe recibir un brief, interpretar el contenido, buscar una referencia visual, decidir composición, tipografía, colores, imágenes, jerarquía, CTA, etc., y posteriormente construir la pieza manualmente.

El objetivo de esta aplicación es reducir ese tiempo.

El usuario debería poder:

1. Subir una imagen de referencia.

2. Explicar qué contenido quiere comunicar.

3. Seleccionar el formato de la pieza.

4. Indicar la marca.

5. Hacer que la IA analice la referencia.

6. Convertir esa referencia en un conjunto de reglas visuales llamado "Design DNA".

7. Generar diferentes propuestas de composición.

8. Ver las propuestas visualmente.

9. Editar texto, elementos y composición.

10. Regenerar partes específicas.

11. Ejecutar una revisión de calidad.

12. Exportar la pieza.

13. En futuras versiones, enviar el diseño a Canva para continuar editándolo.

La filosofía central del producto es:

REFERENCIA + CONTENIDO + BRAND DNA

→ ANÁLISIS

→ DIRECCIÓN DE ARTE

→ COMPOSICIÓN

→ QA

→ EDICIÓN

→ EXPORTACIÓN

==================================================

2. PRINCIPIO FUNDAMENTAL

==================================================

NO queremos depender de un modelo generativo de imágenes para crear toda la pieza final.

La aplicación debe separar:

A. INTELIGENCIA / RAZONAMIENTO

B. GENERACIÓN DE ASSETS VISUALES

C. COMPOSICIÓN

D. TEXTO

E. EDICIÓN

F. CONTROL DE CALIDAD

La IA debería decidir cómo debe construirse el diseño.

La aplicación debería encargarse de renderizar el diseño.

El texto debe ser texto real y editable, no texto incrustado dentro de una imagen generada.

Las imágenes deben ser elementos independientes.

Los botones, CTA, logos, títulos, subtítulos y demás elementos deben ser independientes.

La pieza final debe poder reconstruirse a partir de una estructura de datos tipo JSON.

Esto es MUY importante para futuras integraciones con Canva y otros editores.

==================================================

3. NOMBRE PROVISIONAL

==================================================

Utiliza como nombre provisional:

DESIGN AI

Subtítulo:

AI-powered visual production for creative teams

El nombre es provisional y debe ser fácil de cambiar posteriormente.

No utilizar logos ni branding de OpenAI, Google, Gemini, Canva, Higgsfield u otras compañías.

==================================================

4. OBJETIVO DEL MVP

==================================================

El MVP inicial debe demostrar este flujo:

SUBIR REFERENCIA

↓

ESCRIBIR CONTENIDO

↓

SELECCIONAR FORMATO

↓

ANALIZAR REFERENCIA

↓

GENERAR DESIGN DNA

↓

GENERAR 3 PROPUESTAS DE LAYOUT

↓

VISUALIZARLAS

↓

SELECCIONAR UNA

↓

EDITARLA

↓

EJECUTAR DESIGN QA

↓

EXPORTAR

IMPORTANTE:

El MVP debe poder funcionar en DEMO MODE sin ninguna API paga.

Por lo tanto:

- Crear una arquitectura de servicios desacoplada.

- Crear una interfaz AIProvider.

- Crear inicialmente un MockAIProvider.

- La aplicación debe poder producir respuestas simuladas usando datos locales.

- Posteriormente Claude Code podrá reemplazar MockAIProvider por Gemini/OpenAI/etc.

- No incluir claves API reales.

- No hardcodear secrets.

- Utilizar variables de entorno para futuras integraciones.

==================================================

5. TECNOLOGÍA

==================================================

Construye el proyecto utilizando:

- React

- TypeScript

- Vite o la arquitectura React que Lovable considere más estable para este proyecto

- Tailwind CSS

- componentes reutilizables

- Lucide Icons o una librería de iconos consistente

- estado de aplicación bien estructurado

- arquitectura modular

Evitar dependencias innecesarias.

El código debe ser limpio y fácil de continuar en Cursor + Claude Code.

NO crear un proyecto monolítico.

Separar:

components

pages

services

types

data

utils

hooks

lib

cuando corresponda.

==================================================

6. FILOSOFÍA UX

==================================================

La aplicación debe sentirse como una herramienta profesional de diseño/creative operations.

NO debe parecer:

- un chatbot

- un playground de IA

- una aplicación genérica de generación de imágenes

- un SaaS barato

- una landing page de IA

Debe sentirse como una herramienta interna premium.

Referencia conceptual:

Figma + Canva + Linear + herramientas AI modernas.

La interfaz debe ser:

- minimalista

- profesional

- editorial

- limpia

- rápida

- visual

- con mucho espacio negativo

- sin exceso de elementos

- orientada a productividad

Utilizar fondo claro/off-white y elementos oscuros.

Evitar gradientes excesivos.

Evitar glassmorphism exagerado.

Evitar colores saturados innecesarios.

Evitar estética "AI startup genérica".

==================================================

7. ESTRUCTURA PRINCIPAL DE LA APP

==================================================

Crear un layout principal con:

SIDEBAR IZQUIERDO

Logo:

DESIGN AI

Navigation:

Dashboard

Create

Projects

References

Brand DNA

Templates

Settings

Separadores visuales cuando sea necesario.

Parte inferior:

User / Team

Demo Mode

MAIN CONTENT

Área principal dinámica.

==================================================

8. DASHBOARD

==================================================

Crear una pantalla Dashboard profesional.

Header:

Good afternoon

Create something great.

Debajo:

BOTÓN PRINCIPAL:

+ New Design

Sección:

Recent Projects

Mostrar tarjetas de proyectos.

Ejemplos:

"5 cosas gratis en línea"

"3 errores de publicidad digital"

"Cómo crear contenido que convierte"

"30X Podcast — Episode 08"

Cada tarjeta debe mostrar:

- thumbnail

- nombre

- formato

- fecha

- estado

Estados:

Draft

In Review

Approved

Agregar una sección:

Design Activity

Mostrar actividad reciente:

"Design generated"

"Reference analyzed"

"Design approved"

"QA completed"

==================================================

9. CREATE FLOW

==================================================

Esta es la funcionalidad principal.

Crear una página:

CREATE DESIGN

Debe tener un flujo visual muy claro.

Utilizar un wizard de pasos.

STEP 01

REFERENCE

STEP 02

CONTENT

STEP 03

BRAND

STEP 04

GENERATE

STEP 05

REVIEW

==================================================

10. STEP 01 — REFERENCE

==================================================

Crear una pantalla donde el usuario pueda subir una imagen.

Título:

What's your visual reference?

Descripción:

Upload a design you want the AI to analyze and use as visual direction.

Área drag & drop grande.

Permitir:

- PNG

- JPG

- WEBP

Mostrar preview después de subir.

Opciones:

Upload image

o

Use example reference

Crear 3 referencias demo.

Una de ellas debe representar el estilo del ejemplo proporcionado en esta conversación:

- fondo blanco/off-white

- composición editorial

- headline grande y pesado

- subtítulo delgado

- elemento fotográfico central

- mucho espacio negativo

- CTA tipo pill

- logo pequeño en esquina inferior

- estética minimalista/premium

IMPORTANTE:

No copiar literalmente ninguna marca.

La referencia se utiliza para demostrar análisis de estilo, composición y jerarquía.

Después de subir:

Mostrar una tarjeta:

REFERENCE ANALYSIS

Estado inicial:

Ready to analyze

Botón:

Analyze reference →

==================================================

11. STEP 02 — CONTENT

==================================================

Crear formulario para definir el contenido.

Campos:

CONTENT / HEADLINE

textarea

Ejemplo:

"5 cosas gratis en línea que vale la pena aprovechar"

SUBHEADLINE

textarea

Ejemplo:

"Herramientas que pueden ayudarte a trabajar más rápido"

BODY / KEY POINTS

textarea

CTA

input

Ejemplo:

"Desliza"

TONE

select:

Educational

Editorial

Bold

Professional

Playful

Premium

Inspirational

Promotional

OBJECTIVE

select:

Educate

Engage

Convert

Build Authority

Announce

Tell a Story

Mostrar contador de caracteres para headline.

El sistema debe advertir visualmente cuando el texto sea demasiado largo para el formato.

==================================================

12. STEP 03 — BRAND

==================================================

Crear selector de Brand.

Inicialmente incluir:

30X

Demo Brand

La marca debe mostrar:

Logo

Primary colors

Typography

Visual characteristics

Crear un Brand DNA demo para 30X.

IMPORTANTE:

El Brand DNA debe estar separado de la referencia.

Conceptualmente:

REFERENCE DNA

+

BRAND DNA

+

CONTENT

=

FINAL DESIGN

Crear una estructura editable de Brand DNA.

Ejemplo:

30X BRAND DNA

Colors:

Off-white

Charcoal

Black

Yellow accent

Typography:

Bold sans-serif

Light sans-serif

Visual principles:

High negative space

Editorial

Minimal

Strong hierarchy

Modern

Premium

Elements:

Pill CTAs

Minimal borders

Small logo placement

==================================================

13. STEP 04 — GENERATE

==================================================

Crear una pantalla de generación.

Debe mostrar un proceso visual.

No utilizar una animación exagerada.

Mostrar:

Analyzing reference...

✓

Extracting visual hierarchy...

✓

Understanding typography...

✓

Mapping composition...

✓

Applying Brand DNA...

✓

Generating layouts...

...

Luego mostrar:

3 design directions.

Las tres propuestas deben tener diferencias controladas.

OPTION A

"Closest to reference"

Descripción:

Maximum visual fidelity to the reference structure.

OPTION B

"Balanced"

Descripción:

Reference-inspired with stronger content hierarchy.

OPTION C

"Creative"

Descripción:

More original interpretation while maintaining brand DNA.

IMPORTANTE:

Las tres propuestas deben generarse utilizando datos estructurados.

No depender inicialmente de una imagen generada por IA.

Utilizar HTML/SVG/CSS para renderizar los diseños demo.

==================================================

14. DESIGN DNA

==================================================

Crear un panel de análisis visual.

Cuando la referencia es analizada, mostrar:

DESIGN DNA

Style

Editorial Minimal

Color palette

[swatches]

Typography

Headline:

Bold Sans Serif

Secondary:

Light Sans Serif

Composition

Centered

High negative space

Hierarchy

1. Headline

2. Secondary text

3. Hero visual

4. CTA

5. Logo

Visual language

Premium

Minimal

Modern

Editorial

Spacing

Generous

Image treatment

High contrast

Studio-like

CTA

Rounded pill

Logo

Bottom left

Crear un confidence indicator.

Ejemplo:

Visual understanding

92%

No presentar este porcentaje como una medición científica real.

Es una señal visual de demostración.

Agregar:

"View analysis"

==================================================

15. DESIGN CANVAS

==================================================

Crear un editor visual.

IMPORTANTE:

El editor debe parecer un editor real, no simplemente una imagen.

Layout:

LEFT SIDEBAR

Sections:

Layers

Elements

Text

Images

Brand

Layout

CENTER:

Canvas

RIGHT SIDEBAR

Properties

Cuando el usuario selecciona un elemento, mostrar sus propiedades.

Por ejemplo:

TEXT

Content

Font

Size

Weight

Line height

Alignment

Color

Position

Width

IMAGE

Replace

Crop

Position

Scale

SHAPE

Fill

Border

Radius

==================================================

16. CANVAS FORMATS

==================================================

Agregar selector de formato.

Inicialmente:

Instagram Portrait

1080 × 1350

Instagram Square

1080 × 1080

Instagram Story

1080 × 1920

LinkedIn Portrait

1080 × 1350

Facebook Post

1200 × 1500

Mostrar visualmente la proporción.

==================================================

17. DESIGN JSON

==================================================

MUY IMPORTANTE:

El diseño debe estar representado internamente mediante un objeto estructurado.

Crear tipos TypeScript para:

Design

DesignElement

TextElement

ImageElement

ShapeElement

ButtonElement

LogoElement

DesignDNA

BrandDNA

DesignBrief

DesignQA

Ejemplo conceptual:

Design:

{

  id,

  name,

  format,

  width,

  height,

  background,

  elements,

  referenceId,

  brandId,

  designDNA,

  createdAt,

  updatedAt

}

Cada elemento debe tener:

id

type

x

y

width

height

rotation

zIndex

opacity

TextElement:

content

fontFamily

fontSize

fontWeight

lineHeight

letterSpacing

color

alignment

ImageElement:

src

crop

objectFit

borderRadius

ButtonElement:

text

background

color

radius

padding

NO hacer que el canvas dependa de una imagen plana.

==================================================

18. LAYERS

==================================================

El panel de Layers debe mostrar:

Background

Headline

Subtitle

Hero Image

CTA

Logo

Permitir:

- seleccionar

- ocultar

- reordenar

- bloquear

No es necesario implementar drag-and-drop complejo en la primera versión si dificulta el proyecto.

Pero la arquitectura debe permitirlo posteriormente.

==================================================

19. DESIGN QA

==================================================

Crear una función:

AI DESIGN QA

Debe analizar conceptualmente:

Hierarchy

Legibility

Spacing

Brand consistency

Reference alignment

Content completeness

Visual balance

Mostrar:

Design QA

Hierarchy

94

Legibility

98

Spacing

88

Brand consistency

96

Reference alignment

91

Content completeness

100

IMPORTANTE:

Estos valores inicialmente son mock/demo values.

No fingir que existe una IA real evaluando el diseño si estamos en Demo Mode.

Mostrar claramente:

Demo analysis

Posteriormente esto será reemplazado por una llamada real a un modelo multimodal.

Mostrar warnings:

"CTA may be too small."

"Headline is approaching maximum width."

"Hero image competes slightly with headline."

Agregar botón:

Auto-fix

En Demo Mode, Auto-fix puede aplicar cambios simples al JSON:

- aumentar CTA

- modificar posición

- reducir headline

- cambiar spacing

==================================================

20. AUTO-FIX

==================================================

El botón:

Fix automatically

debe modificar el diseño estructurado.

Ejemplo:

Antes:

CTA size = 22

Después:

CTA size = 26

Antes:

Headline width = 900

Después:

Headline width = 760

Mostrar una pequeña notificación:

"3 design issues fixed."

Agregar:

Undo

==================================================

21. REFERENCIA VS RESULTADO

==================================================

Crear una vista:

Compare

Mostrar:

REFERENCE

vs

GENERATED

con slider o dos paneles.

Esto será fundamental para futuras evaluaciones de similitud visual.

==================================================

22. DESIGN VARIATIONS

==================================================

Cuando el usuario está editando un diseño:

botón:

Generate variations

Mostrar:

3 variations.

Cada una debe modificar:

- composición

- proporciones

- tamaño de imagen

- ubicación del CTA

- tratamiento del headline

pero mantener:

Brand DNA

Content

Format

==================================================

23. ASSET LIBRARY

==================================================

Crear una sección:

Assets

Permitir subir imágenes.

Categorías:

People

Products

Backgrounds

Logos

Icons

Other

Inicialmente usar local/mock storage.

No necesitamos backend real para la primera versión.

==================================================

24. REFERENCES

==================================================

Crear página:

References

Grid de referencias.

Cada referencia muestra:

thumbnail

name

style

tags

Ejemplos:

Editorial Minimal

Bold Typography

Premium Product

Data Visualization

Storytelling

Educational

Crear botón:

Analyze reference

==================================================

25. BRAND DNA

==================================================

Crear una página donde el equipo pueda administrar marcas.

Cada Brand debe tener:

Logo

Colors

Fonts

Design principles

CTA style

Image style

Spacing rules

Forbidden styles

Examples

Crear:

30X

como ejemplo.

IMPORTANTE:

El sistema debe diferenciar:

"Brand DNA"

de:

"Reference DNA"

Esto es central para el producto.

==================================================

26. TEMPLATES

==================================================

Crear sección:

Templates

Tipos:

Hero

Educational

Quote

List

Storytelling

Data

Announcement

Promotional

Cada template debe ser una estructura JSON.

Ejemplo:

Editorial Hero

- headline

- subtitle

- hero image

- CTA

- logo

El usuario podrá seleccionar:

Use template

==================================================

27. MOCK AI ARCHITECTURE

==================================================

Crear un servicio:

AIProvider

Debe tener métodos conceptuales:

analyzeReference()

generateDesignDNA()

generateLayouts()

evaluateDesign()

generateVariations()

autoFixDesign()

Crear:

MockAIProvider

Este provider debe devolver respuestas demo.

No llamar ninguna API externa en Demo Mode.

Crear una configuración:

AI_MODE=demo

Futuro:

AI_MODE=production

==================================================

28. FUTURA ARQUITECTURA DE IA

==================================================

Preparar el proyecto para poder implementar posteriormente:

Gemini

OpenAI

Higgsfield

Canva

No implementarlos todavía.

La arquitectura futura será:

AI ORCHESTRATOR

        ↓

TASK ROUTER

        ↓

┌────────────┬─────────────┬──────────────┐

│            │             │              │

GPT         Gemini      Higgsfield      Canva

Reasoning   Vision      Visual          Design

QA          Image       Generation      Editing

Copy        Analysis

El sistema debe poder cambiar de proveedor sin modificar la interfaz.

==================================================

29. FUTURO GEMINI

==================================================

Posteriormente Gemini será utilizado para:

- analizar referencias

- interpretar imágenes

- extraer composición

- identificar estilo

- generar visual assets

- evaluar referencias

Crear una futura implementación:

GeminiProvider

pero mantenerla desactivada.

No incluir API keys.

==================================================

30. FUTURO OPENAI

==================================================

Posteriormente OpenAI podrá utilizarse para:

- reasoning

- copy

- design direction

- content structuring

- QA

- orchestration

Crear:

OpenAIProvider

pero mantenerlo como placeholder.

==================================================

31. FUTURO HIGGSFIELD

==================================================

Higgsfield podrá utilizarse posteriormente para:

- hero visuals

- complex image generation

- product scenes

- surreal concepts

- advanced visual assets

No integrar todavía.

==================================================

32. FUTURO CANVA

==================================================

Canva será posteriormente el editor externo.

Flujo:

DESIGN AI

↓

Design JSON

↓

Canva integration

↓

Editable Canva design

Crear un botón en la interfaz:

Open in Canva

Pero inicialmente debe mostrar:

"Canva integration coming soon."

No crear una falsa integración.

==================================================

33. EXPORT

==================================================

Crear botón:

Export

Opciones:

PNG

JPG

En el MVP debe ser funcional.

El sistema debe renderizar el canvas y descargar la pieza.

IMPORTANTE:

La exportación debe representar correctamente:

- texto

- imágenes

- formas

- CTA

- logo

- background

==================================================

34. DEMO MODE

==================================================

Este punto es CRÍTICO.

La aplicación debe funcionar completamente en Demo Mode sin API keys.

Crear una etiqueta discreta:

DEMO MODE

en Settings o header.

En Demo Mode:

- usar ejemplos

- usar datos locales

- usar imágenes placeholder

- generar Design DNA predefinido

- generar 3 layouts

- generar QA simulado

- permitir edición

- permitir exportación

El usuario debe poder hacer una demostración completa sin pagar por APIs.

==================================================

35. DEMO REFERENCE

==================================================

Crear una referencia demo inspirada en el diseño suministrado para este proyecto.

Características:

- canvas vertical

- background off-white

- headline grande en mayúsculas

- headline bold

- secondary text delgado

- fuerte contraste tipográfico

- gran cantidad de espacio negativo

- hero visual centrado hacia la parte inferior

- CTA en forma de pill

- pequeño logo inferior izquierdo

- estética editorial

- estética premium

- minimalismo

- sensación tecnológica

No copiar literalmente el diseño.

Crear una interpretación genérica que demuestre el concepto.

==================================================

36. DEMO CONTENT

==================================================

Utilizar como contenido inicial:

Headline:

COSAS GRATIS

Subheadline:

en línea que vale la pena aprovechar

CTA:

Desliza

Brand:

30X

Crear posteriormente otra demo:

Headline:

5 herramientas de IA que pueden ahorrarte horas

Subheadline:

Herramientas que puedes empezar a usar hoy

CTA:

Desliza

==================================================

37. RESPONSIVE

==================================================

La aplicación está pensada principalmente para desktop.

Debe funcionar correctamente en:

1440px

1280px

1024px

No priorizar mobile para el editor.

El dashboard sí debe ser razonablemente responsive.

==================================================

38. ESTADOS DE LA APP

==================================================

Crear estados claros:

Empty

Loading

Analyzing

Generating

Success

Error

Warning

Saved

Las animaciones deben ser sutiles.

No utilizar loaders genéricos eternos.

==================================================

39. ERROR HANDLING

==================================================

Preparar mensajes claros:

"Something went wrong while analyzing the reference."

"Try again."

"Your image format isn't supported."

"Your content is too long for this layout."

"Design generation failed."

Nunca mostrar stack traces al usuario.

==================================================

40. AUTOSAVE

==================================================

El editor debe guardar automáticamente el estado en localStorage durante el MVP.

Mostrar:

Saved

o:

Saving...

No implementar todavía base de datos si no es necesaria.

==================================================

41. DESIGN SYSTEM DE LA APP

==================================================

Usar:

Background:

Off-white / very light neutral

Primary:

Near-black

Secondary:

Neutral gray

Accent:

Una tonalidad amarilla muy discreta puede utilizarse para acciones importantes.

Borders:

Muy sutiles.

Radius:

Moderado.

Typography:

Inter o una sans-serif moderna equivalente.

Headings:

Bold.

Body:

Regular.

Labels:

Small / medium.

==================================================

42. COMPONENTES REUTILIZABLES

==================================================

Crear componentes reutilizables:

Button

Card

Input

Textarea

Select

Modal

Dialog

Badge

Tabs

Sidebar

Header

Canvas

CanvasToolbar

LayersPanel

PropertiesPanel

DesignCard

ReferenceCard

BrandCard

QualityScore

ProgressSteps

UploadZone

AssetCard

Toast

EmptyState

==================================================

43. NO HACER

==================================================

NO:

- crear una landing page gigante

- agregar pricing

- agregar billing

- agregar login complejo

- agregar pagos

- agregar chat genérico

- agregar funcionalidades sociales

- agregar comunidad

- crear una red social

- crear un marketplace

- integrar 10 APIs innecesariamente

- inventar una integración real con Canva

- inventar IA real en Demo Mode

- poner API keys en frontend

- utilizar imágenes generadas como reemplazo del editor estructurado

- crear un canvas imposible de mantener

- sobrecomplicar la arquitectura

==================================================

44. PRIORIDAD ABSOLUTA

==================================================

Prioriza en este orden:

1. UX

2. Visual quality

3. Design editor

4. Design JSON architecture

5. Reference analysis architecture

6. Demo generation

7. Export

8. Extensibility

==================================================

45. PRODUCT PRINCIPLE

==================================================

La aplicación debe comunicar visualmente esta idea:

"AI doesn't replace the designer.

It accelerates the designer."

El diseñador sigue siendo quien:

- decide

- aprueba

- corrige

- dirige

La IA ayuda a:

- analizar

- proponer

- estructurar

- generar

- revisar

- automatizar

==================================================

46. FUTURE PRODUCT VISION

==================================================

La visión futura del producto es:

A designer uploads a reference.

The AI understands:

- visual hierarchy

- typography

- spacing

- composition

- imagery

- visual tone

Then the user provides content.

The AI combines:

REFERENCE DNA

+

BRAND DNA

+

CONTENT

Then:

AI CREATIVE DIRECTOR

↓

LAYOUT GENERATOR

↓

IMAGE GENERATOR

↓

DESIGN COMPOSER

↓

AI DESIGN CRITIC

↓

AUTO-FIX

↓

HUMAN APPROVAL

↓

CANVA

The system should eventually learn from the designers.

If a designer repeatedly changes:

- spacing

- typography

- image scale

- CTA position

the system should eventually learn those preferences.

This is a future feature and does NOT need to be implemented now.

==================================================

47. IMPORTANT DEVELOPMENT INSTRUCTION

==================================================

Build the application as if another senior developer will take over the codebase tomorrow.

Use:

- clean TypeScript

- meaningful variable names

- reusable components

- clear separation of concerns

- comments only where useful

- no unnecessary complexity

- no hardcoded business logic inside UI components

Keep mock data separate.

Keep AI providers separate.

Keep rendering logic separate.

Keep design types centralized.

==================================================

48. INITIAL DELIVERABLE

==================================================

I want you to build the first functional prototype.

At the end I should be able to:

1. Open Dashboard.

2. Click New Design.

3. Upload/use a reference.

4. Enter content.

5. Select 30X.

6. Select Instagram Portrait.

7. Click Analyze.

8. See Design DNA.

9. Click Generate.

10. See 3 design proposals.

11. Select one.

12. Open the editor.

13. Click text and edit it.

14. Select elements.

15. Modify properties.

16. Run Design QA.

17. See warnings.

18. Click Auto-Fix.

19. See the design improve.

20. Export PNG/JPG.

21. Return to Projects.

22. See the saved project.

All of this must work WITHOUT requiring paid APIs.

==================================================

49. FINAL UX TEST

==================================================

Before considering the prototype complete, test the following user journey:

Dashboard

→ New Design

→ Reference

→ Content

→ Brand

→ Generate

→ 3 proposals

→ Select design

→ Edit

→ QA

→ Auto-fix

→ Export

→ Project saved

There should be no dead-end buttons.

Buttons that are future integrations must explicitly say:

Coming soon

rather than pretending they work.

==================================================

50. FINAL PRODUCT FEEL

==================================================

When someone from a professional design team opens this prototype, I want their reaction to be:

"Okay, this could actually become an internal AI design system."

NOT:

"This is just another AI image generator."

The product must demonstrate that the core concept is:

REFERENCE

+

CONTENT

+

BRAND

+

AI CREATIVE DIRECTION

+

STRUCTURED DESIGN

+

HUMAN REVIEW

Build the first version now.

Focus on making the core workflow feel real, polished, and demonstrable.

Do not spend time implementing future integrations yet.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/858b26e7-62e6-4930-ba11-257e67b925c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
