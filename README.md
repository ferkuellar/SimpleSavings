# SimpleSavings – Simulador de Ahorro con Interés Compuesto en AWS

**Nivel:** Principiante → Intermedio  
**Rol objetivo:** Cloud Architect / Data Engineer (focus en finanzas personales)  

SimpleSavings es una aplicación web diseñada para simular el crecimiento de un ahorro con **aportaciones periódicas** y **tasa de interés compuesta**, desplegada sobre una arquitectura **serverless en AWS**.

El usuario puede configurar:

- 💰 Aporte mensual
- 📈 Tasa de interés anual
- ⏱️ Plazo (en años)

La app calcula:

- El **valor futuro** del ahorro
- El **total aportado** vs **intereses generados**
- La **curva de crecimiento mes a mes** con una gráfica interactiva
- Una **tabla detallada** con el saldo acumulado por mes

Este proyecto está diseñado como pieza de portafolio para mostrar:
- Entendimiento de conceptos financieros básicos (interés compuesto)  
- Diseño de arquitectura cloud escalable y de bajo costo en AWS  
- Uso de servicios serverless (S3, CloudFront, Lambda, API Gateway, DynamoDB)

---

## 🚀 Objetivos del Proyecto

1. **Modelar interés compuesto** con aportes periódicos de forma clara y visual.  
2. **Aplicar buenas prácticas de arquitectura Cloud en AWS** usando servicios administrados.  
3. Evolucionar desde una **SPA estática en S3** hasta una **arquitectura serverless completa**:
   - Fase 1: Frontend estático (S3 + CloudFront)  
   - Fase 2: Lógica de negocio en Lambda (API REST)  
   - Fase 3: Persistencia de escenarios con DynamoDB  

---

## 🧩 Funcionalidades

### Funcionalidad principal

- Formulario interactivo donde el usuario define:
  - Aporte mensual (ej. 1,000 MXN)
  - Tasa de interés anual (ej. 12%)
  - Plazo en años (ej. 10 años)
- Cálculo de:
  - Valor futuro al final del periodo
  - Total aportado vs intereses
- Visualizaciones:
  - Gráfico de línea con el crecimiento del saldo mes a mes (Chart.js u otra librería JS)
  - Tabla con:
    - Mes
    - Aporte del mes
    - Saldo acumulado
    - Interés generado (opcional)

### Validaciones

- Bloqueo de:
  - Valores negativos
  - Tasa de interés cero o negativa
  - Plazos no válidos
- Mensajería de error amigable (inputs vacíos o fuera de rango)

### Versión mejorada (backend)

- El cálculo puede ejecutarse en el **frontend** o delegarse a un **endpoint REST en AWS**:
  - Envío de parámetros: `monthlyContribution`, `annualRate`, `years`
  - Respuesta JSON con:
    - Resumen: `total_contributed`, `final_balance`, `total_interest`
    - Detalle mes a mes para alimentar gráfica y tabla

### Persistencia de escenarios (fase avanzada)

- Opción para que el usuario guarde escenarios de ahorro (ej. “Plan retiro”, “Fondo de emergencia”).
- Registro de:
  - Aporte mensual
  - Tasa
  - Plazo
  - Fecha de creación
  - Resultado final
- Comparación visual de múltiples escenarios en una sola gráfica.

---

## ☁️ Arquitectura Cloud en AWS

El proyecto está pensado en **fases**, para mostrar evolución de arquitectura.

### 🔹 Fase 1 – Frontend estático (SimpleSavings v1)

**Servicios AWS:**

- **Amazon S3**
  - Hosting de sitio estático (HTML, CSS, JS)
  - **Versioning habilitado** para poder hacer rollback de despliegues
- **Amazon CloudFront**
  - CDN para baja latencia y HTTPS
  - Origin configurado hacia el bucket S3
- **IAM**
  - Rol/usuario con permisos mínimos para despliegue (S3 + invalidaciones en CloudFront)

**Diagrama lógico (Fase 1):**

```text
[User Browser]
      |
      v
[CloudFront Distribution]  --->  [S3 Static Website Bucket]
                                     - Versioning ON
                                     - Solo accesible vía CloudFront (OAC / bucket policy)
````

---

### 🔹 Fase 2 – Backend serverless para cálculo (SimpleSavings v2)

En esta fase se mueve la lógica de cálculo de interés compuesto al backend, convirtiendo la app en un **cliente ligero** que consume una **API REST**.

**Servicios adicionales:**

* **AWS Lambda**

  * Función en Node.js/Python que recibe parámetros y ejecuta la simulación
  * Retorna JSON con detalle de saldos por mes
* **Amazon API Gateway**

  * Exposición de un endpoint REST `POST /simulate`
  * CORS habilitado para frontend
* **Amazon CloudWatch**

  * Logs de Lambda (seguimiento de errores y performance)

**Flujo de datos (Fase 2):**

```text
[User Browser]
   |
   | (1) GET HTML/CSS/JS
   v
[CloudFront] ---> [S3 Static Bucket]

[User Frontend]
   |
   | (2) POST /simulate  { monthlyContribution, annualRate, years }
   v
[API Gateway] ---> [Lambda Function] ---> [Simulation Logic]
                                      |
                                      | (3) Response JSON
                                      v
                                 [API Gateway] ---> [Frontend]
```

---

### 🔹 Fase 3 – Persistencia y comparación de escenarios (SimpleSavings v3)

En esta fase se agrega un componente de **persistencia** y **comparación de escenarios**, mostrando skills más cercanas a Data Engineer / Architect.

**Servicios adicionales:**

* **Amazon DynamoDB**

  * Tabla `SavingsScenarios` (ejemplo):

    * Partition key: `userId`
    * Sort key: `scenarioId`
    * Atributos: `monthly`, `annualRate`, `years`, `createdAt`, `finalBalance`, etc.
* (Opcional) **Amazon Cognito**

  * Manejo de usuarios autenticados (login básico)

**Endpoints adicionales:**

* `POST /scenario` → guarda un escenario en DynamoDB
* `GET /scenario` → lista los escenarios del usuario
* `GET /scenario/{id}` → obtiene un escenario específico

**Diagrama simplificado (Fase 3):**

```text
[User Browser] 
   |
   v
[CloudFront] ---> [S3 Frontend]
   |
   +--(REST)--> [API Gateway] ---> [Lambda]
                                  /   \
                                 v     v
                          [Simulation Logic]   [DynamoDB - SavingsScenarios]
```

---

## 🧮 Lógica de Interés Compuesto

El modelo asume aportes mensuales constantes con capitalización mensual:

* `P` = aporte mensual
* `r` = tasa de interés anual (decimal)
* `i` = tasa mensual = `r / 12`
* `n` = número total de meses = años × 12

**Valor futuro aproximado:**
Valor futuro aproximado:

$$
FV = P \cdot \frac{(1 + i)^n - 1}{i}
$$


En la implementación se calcula **mes por mes**, para poder generar:

* Tabla detallada
* Gráfica de crecimiento

---

## 🛠️ Stack Técnico

**Frontend**

* HTML5 + CSS3
* JavaScript Vanilla (o framework ligero si se desea)
* Chart.js (o librería similar) para la gráfica

**Backend serverless (v2 / v3)**

* AWS Lambda (Node.js o Python)
* Amazon API Gateway (REST)
* Amazon DynamoDB (persistencia de escenarios)
* Amazon CloudWatch (logs y monitoreo)

**Infraestructura Cloud**

* Amazon S3 (static website hosting + versioning)
* Amazon CloudFront (CDN + HTTPS)
* IAM (principio de mínimo privilegio)
* (Opcional) Amazon Cognito para autenticación básica

---

## 🎯 Skills Demostrados

Este proyecto está pensado para demostrar:

* **Cloud Architecture (AWS)**

  * Diseño de arquitectura estática + serverless
  * Uso de S3 + CloudFront para hosting de frontends
  * Exposición de APIs REST con API Gateway + Lambda
  * Persistencia NoSQL con DynamoDB
  * Versionado y despliegue controlado de sitios estáticos

* **Finanzas y lógica de negocio**

  * Modelado de **interés compuesto** con aportes periódicos
  * Interpretación de resultados: aportes vs intereses
  * Presentación visual amigable para usuarios no técnicos

* **Buenas prácticas técnicas**

  * Separación de frontend y backend
  * Validación de inputs
  * Respuestas JSON estructuradas
  * Evolución del proyecto por fases (v1 → v2 → v3)

---

## ▶️ Cómo Ejecutar (vista general)

> **Nota:** Ajusta estos pasos con tu configuración real de AWS y tu script de despliegue.

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/simple-savings.git
cd simple-savings
```

2. **Probar frontend en local**

* Abrir `index.html` en el navegador
* Verificar:

  * Cálculos correctos
  * Gráfica se renderiza bien
  * Tabla muestra los datos por mes

3. **Desplegar a S3**

```bash
aws s3 sync ./frontend s3://simple-savings-bucket --delete
```

4. **Configurar CloudFront**

* Crear distribución apuntando al bucket S3
* Asociar certificado SSL (ACM) si usas dominio propio

5. **Configurar Lambda + API Gateway (versión mejorada)**

* Crear función Lambda con la lógica de simulación
* Crear API REST en API Gateway (`POST /simulate`)
* Habilitar CORS para el dominio de CloudFront

6. **(Opcional) Activar DynamoDB y endpoints de escenarios**

* Crear tabla `SavingsScenarios`
* Actualizar Lambda para leer/escribir en DynamoDB
* Extender el frontend para guardar y comparar escenarios

---

## 🗺️ Roadmap / Próximos Pasos

* [ ] Agregar autenticación con Amazon Cognito
* [ ] Agregar modo “Comparar escenarios” con varias curvas en la misma gráfica
* [ ] Internacionalización: soporte multi-moneda y diferentes idiomas
* [ ] Añadir tests unitarios básicos para la lógica de simulación
* [ ] Pipeline de CI/CD simple para automatizar el despliegue a S3 y CloudFront

---

## 🧑‍💻 Notas para Reclutadores

Este proyecto no solo muestra una calculadora de interés compuesto; está diseñado para reflejar cómo pienso como **Cloud Architect**:

* Empiezo con una **versión mínima funcional**, pero desde el inicio con arquitectura en mente.
* Evoluciono hacia un modelo **serverless**, con separación clara entre frontend, lógica de negocio y datos.
* Uso servicios administrados para maximizar **escalabilidad, resiliencia y bajo costo**.

Si quieres revisar el código, la arquitectura o discutir cómo extender este concepto a productos financieros reales, estaré encantado de explicarlo.


