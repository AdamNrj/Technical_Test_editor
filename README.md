Vitexl Visual Editor (tldraw + Next.js + tRPC)

Editor visual simple basado en [tldraw](https://tldraw.com/) con autosave vía tRPC, i18n (next-intl), Tailwind + shadcn/ui, y plantillas (flujo / mapa mental). Incluye exportaciones (PNG, SVG, JSON), barra de comandos, onboarding, temas accesibles y atajos de teclado.

## Tecnologías

- **Next.js App Router** (React) – SSR/ISR y rutas `/app`
- **TailwindCSS** – estilos utilitarios
- **shadcn/ui** – componentes de UI
- **tRPC** – API type-safe (client + server)
- **tldraw v3** – canvas/figuras/serialización
- **next-intl** – internacionalización (en/es)
- **react-query** – caché/estado de datos tRPC
- **superjson** – transformer tRPC
- **sonner** – toasts

## Estructura relevante

app/
[locale]/
layout.tsx
page.tsx # Home
editor/
page.tsx # Editor
api/
trpc/[trpc]/route.ts # Handler tRPC

modules/
editor/
presentation/
store/
client.tsx # tRPC client/provider
doc-store.ts # getDocument / saveDocument (in-memory)
templates/
flow.ts
mindmap.ts
ai/
videtz-generate.ts # Generación de flujo desde texto
hooks/
use-tldraw-autosave.ts
use-keyboard-shortcuts.ts
use-download-blob.ts
use-onboarding.ts
components/
commons/
toolbar.tsx
save-indicator.tsx
command-bar.tsx
onboarding.tsx
...
i18n/
messages/
en.json
es.json
routing.ts

## Instalación

Requisitos: Node 18+

```bash
# 1) Clonar
git clone <repo-url>
cd <repo>

# 2) Instalar
pnpm i
# o npm i / yarn

# 3) Desarrollo
pnpm dev
# Abre http://localhost:3000/en

Scripts

pnpm dev           # modo desarrollo
pnpm build         # build producción
pnpm start         # ejecutar build
pnpm lint          # lint
pnpm test          # tests (si usas vitest)

Configuración de i18n (next-intl)

    i18n/routing.ts: define locales soportados (en, es).

    app/[locale]/layout.tsx: carga NextIntlClientProvider con getMessages.

    Ficheros de traducción en i18n/messages/en.json y i18n/messages/es.json.

Endpoints tRPC

    document.get → devuelve el documento (snapshot) por id.

    document.save → persiste el snapshot.

Probar API (ejemplos)

    tRPC usa batch y JSON envuelto; lo más simple es abrir el editor y observar las llamadas en red (/api/trpc/document.get?batch=1&input=...).

cURL (aproximado)

# GET (document.get): recuerda que tRPC espera batch con "json"
curl "http://localhost:3000/api/trpc/document.get?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22id%22%3A%22main%22%7D%7D%7D"

# POST (document.save)
curl -X POST "http://localhost:3000/api/trpc/document.save?batch=1" \
  -H "content-type: application/json" \
  -d '{"0":{"json":{"id":"main","store":{"schema":{...},"store":{...}},"updatedAt":1700000000000}}}'

    Sugerencia: usa el cliente tRPC del frontend; estos cURL sirven solo para verificar que el handler responde y el path es correcto.

Autosave

    Hook use-tldraw-autosave escucha cambios editor.store.listen({ scope: 'document' }), serializa con getSnapshot y hace document.save con debounce (500ms).

    Restaura un snapshot existente con loadSnapshot en onMount.

Exportaciones

    PNG / SVG: exportToBlob({ editor, ids, format, opts })

    JSON: descarga del snapshot (getSnapshot) como .json

    Los botones se deshabilitan si no hay shapes; además, los handlers muestran un toast “nothing to export”.

Plantillas y generación

    Flow y Mind Map: crean shapes geo + text por separado y flechas con bindings.

    Videtz Generate: desde un prompt tipo "A -> B, B -> C" crea nodos y flechas.

CSP (Content-Security-Policy)

Configurado en next.config.ts headers:

    img-src 'self' data: blob: https://cdn.tldraw.com

    font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com

    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com

    script-src 'self' 'unsafe-eval' 'unsafe-inline' (para HMR/turbopack en dev)

    connect-src 'self' ws: wss: https://cdn.tldraw.com

    media-src 'self' blob:

Ajusta si tu navegador bloquea recursos adicionales.
Atajos

    Ctrl+K – Command bar

    Ctrl+S – Guardar (toast de confirmación)

    Ctrl+M – Crear/modificar figura

    Ctrl+Shift+O – Auto organizar

    Ctrl++ / Ctrl+- / Ctrl+0 – Zoom/Reset

Testing (sugerido)
Vitest (unit)

    doc-store.test.ts:

        getDocument devuelve snapshot vacío la primera vez.

        saveDocument persiste y luego getDocument lo devuelve.

    videtz-generate.test.ts:

        Con input "A -> B, B -> C", crea 3 nodos (3 geos+text) y 2 flechas.

E2E (Playwright/Cypress)

    Cargar /en/editor, pulsar “Modify Shape” y comprobar que aparece una shape.

    Exportar JSON y comprobar que se descarga archivo.

Decisiones

    tRPC + superjson para transporte type-safe y serialización estable.

    tldraw v3 con getSnapshot/loadSnapshot (APIs recomendadas).

    next-intl con App Router, mensajes por locale.

    CSP relajada en dev (HMR) y estricta para fuentes/imágenes (tldraw).

Roadmap

    Guardado en base de datos (SQLite/Prisma) en lugar de in-memory.

    Tests E2E completos.

    Colaboración en tiempo real (WebSocket).

    IA (autolayout, prompts más complejos).
```
