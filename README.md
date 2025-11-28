# SimpleSavings – Simulador de Ahorro con Interés Compuesto

**Nivel:** Principiante  
**Enfoque:** Frontend + Arquitectura Cloud en AWS  

SimpleSavings es una aplicación web sencilla que permite simular cómo crecería un ahorro con **aportaciones mensuales** y **tasa de interés compuesta**. El usuario ingresa:

- Aporte mensual
- Tasa de interés anual
- Plazo en años o meses

La app calcula:

- El **valor futuro** del ahorro al final del periodo
- La **curva de crecimiento** mes a mes en una gráfica
- Una **tabla detallada** con el capital acumulado, interés generado y saldo final por mes

### Objetivo del proyecto

Demostrar dominio de conceptos básicos de **finanzas personales** (interés compuesto) y al mismo tiempo habilidades de **arquitectura cloud en AWS**, desplegando una app estática de forma profesional.

### Arquitectura Cloud (AWS)

Versión base (sin backend):

- **Amazon S3**: hosting estático del frontend (HTML, CSS, JavaScript)
- **Amazon CloudFront**: CDN para entregar el sitio con baja latencia y HTTPS
- **S3 Versioning**: habilitado para mantener el historial de versiones del sitio
- **IAM**: usuario/rol con permisos mínimos para despliegue

Versión opcional (con backend serverless):

- **API Gateway** + **AWS Lambda**: endpoint REST que recibe los parámetros del simulador y devuelve el plan de ahorro calculado (para separar lógica del frontend)
- (Opcional futuro) **Amazon DynamoDB**: para guardar escenarios por usuario y compararlos

### Funcionalidad principal

- Formulario interactivo con validación de inputs
- Cálculo de interés compuesto sobre aportaciones mensuales
- Gráfica de crecimiento del ahorro (por ejemplo con **Chart.js**)
- Tabla con el detalle mensual del ahorro e intereses
- Manejo básico de errores (inputs vacíos, negativos, tasas irreales, etc.)

### Skills demostrados

- Modelos financieros básicos (interés compuesto y aportes periódicos)
- Construcción de una **Single Page App** simple con JavaScript
- Despliegue de un sitio estático en **S3 + CloudFront**
- Configuración de **versioning** en S3 para rollback de despliegues
- (Opcional) Diseño de una función **serverless** con Lambda para lógica de negocio

### Posibles mejoras

- Guardar escenarios por usuario en DynamoDB
- Comparar diferentes tasas/plazos en la misma gráfica
- Autenticación ligera (por ejemplo, Amazon Cognito)
- Internacionalización (moneda, idioma, formato de fecha)

