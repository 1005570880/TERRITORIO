# TERRITORIO

Plataforma de gestión territorial y participación comunitaria.

## Estado actual
Primera interfaz navegable de demostración construida con Next.js 15, React y TypeScript. Incluye resumen, directorio con búsqueda, formulario local de registro, vista territorial ilustrativa y agenda.

**Importante:** los registros de esta versión son datos de demostración y se mantienen solo en el estado del navegador. No hay autenticación ni persistencia conectada. No ingresar datos personales reales hasta implementar y verificar consentimiento, seguridad, control de acceso y políticas de tratamiento.

## Desarrollo
```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## Próximos pasos
- Conectar Supabase Auth y PostgreSQL con políticas RLS.
- Implementar consentimiento informado y gestión de derechos de titulares conforme a la Ley 1581 de 2012.
- Reemplazar datos ilustrativos por registros autorizados.
- Integrar mapa con cartografía y ubicaciones voluntariamente suministradas.
- Configurar variables de entorno desde `.env.example`.

La aplicación está diseñada para gestión comunitaria no partidista. No incluye inferencias de intención de voto ni segmentación electoral.
