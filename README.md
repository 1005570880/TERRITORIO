# TERRITORIO

Plataforma de gestión territorial, participación ciudadana y trazabilidad comunitaria.

## Módulos implementados en esta versión

- **Resumen:** indicadores operativos de solicitudes, compromisos y actividades.
- **Territorio:** mapa base y componente de cobertura geográfica agregada.
- **Organizaciones:** directorio institucional y comunitario.
- **Solicitudes:** registro, búsqueda y actualización del estado de necesidades ciudadanas.
- **Agenda:** registro y consulta de actividades comunitarias.
- **Tareas:** compromisos, responsables, fechas límite y estados.
- **Observación:** fichas de trazabilidad documental para formularios y resultados oficiales agregados.
- **Analítica:** indicadores operativos agregados.

## Estado técnico

Esta entrega es una **interfaz funcional de demostración**. Las altas y cambios se conservan únicamente en el estado de la sesión del navegador; al recargar la página se reinician. Todavía no hay autenticación, base de datos, almacenamiento documental ni persistencia conectada.

No ingresar información personal real ni documentos reservados hasta implementar y verificar autenticación, autorización, políticas de acceso, cifrado, retención y procedimientos de protección de datos.

## Privacidad y alcance

TERRITORIO está orientado a gestión comunitaria y participación ciudadana. El directorio se limita a organizaciones y canales institucionales autorizados. La observación electoral se restringe a trazabilidad de documentos y resultados oficiales agregados. La aplicación no incorpora perfiles de votantes, inferencias de intención de voto, segmentación política individual ni domicilios o ubicaciones personales en mapas.

El tratamiento de datos personales deberá cumplir la Ley 1581 de 2012 y las normas concordantes, con finalidad determinada, minimización, autorización cuando corresponda, controles de acceso y mecanismos para ejercer los derechos de los titulares.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## Variables de entorno previstas

Copiar `.env.example` y configurar las credenciales únicamente en el entorno de despliegue cuando se integre Supabase. Nunca publicar claves privadas en el repositorio.
