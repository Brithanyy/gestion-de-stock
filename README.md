# Mirador Beach Club Barra — Sistema de Stock (prototipo)

## Descripción
SPA en Angular para gestión de stock de bebidas. Backend simulado con JSON-Server (db.json). Exportes a PDF/Excel y envío de reportes mediante EmailJS.

## Requisitos
- Node.js >= 16
- npm >= 8
- Angular CLI (opcional, para desarrollo): `npm install -g @angular/cli`
- json-server (global o local): `npm i -g json-server` o usar como dependencia dev.

## Estructura del repo
- `src/` - código Angular
- `db.json` - persistencia JSON para json-server
- `README.md`, `API_SPEC.md`

## Instalación
```bash
git clone <repo-url>
cd repo
npm install
# (si no tenés json-server en dev deps)
npm i -D json-server concurrently
