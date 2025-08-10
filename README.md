// README.md

# Dos Plats Web

Proyecto de página web para el restaurante **Dos Plats** (Lleida), desarrollado con **Next.js** y **Supabase**.

## Características
- Visualización del menú del día en PDF.
- Subida de PDF diaria por parte del propietario.
- Diseño moderno y responsive.
- Multilenguaje: Español (por defecto), Català e English.

## Requisitos
- Node.js 20 o superior
- Cuenta de Supabase configurada con bucket para menús.

## Variables de entorno
Copia `.env.example` a `.env.local` y rellena con tus datos de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

## Scripts
- `npm run dev` → Ejecuta el servidor de desarrollo.
- `npm run build` → Construye la aplicación.
- `npm start` → Inicia la app en producción.

## Estructura del proyecto
- `/pages` → Páginas principales (inicio, subida de menú).
- `/components` → Componentes reutilizables (Header, Footer, PdfViewer).
- `/public` → Imágenes y recursos estáticos.
- `/styles` → Estilos globales.
- `/lib` → Conexión a Supabase.

## Despliegue
Se recomienda desplegar en **Vercel** para integración fácil con Next.js.
