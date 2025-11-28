# Código frontend v1 (UI decente + gráfica + reset)

La estructura del proyecto (lado frontend) queda así:

```text
simple-savings/
└─ frontend/
   ├─ index.html
   ├─ css/
   │  └─ styles.css
   └─ js/
      ├─ charts.js
      └─ app.js
```

## README v1 (Fase 1 – frontend estático)

Crea un `README.md` en la raíz del repo con algo así:

# SimpleSavings – Simulador de Ahorro con Interés Compuesto

**Fase 1 – Frontend estático (S3 + CloudFront)**

SimpleSavings es una app web sencilla que permite simular cómo crecería un ahorro con:

- Aporte mensual
- Tasa de interés anual
- Plazo en años

La app calcula el crecimiento mes a mes y muestra:

- Total aportado
- Valor futuro
- Intereses generados
- Gráfica de crecimiento
- Tabla de detalle mensual

## Lógica financiera

Se asume un aporte mensual constante con capitalización mensual:

- `P` = aporte mensual  
- `r` = tasa anual (decimal)  
- `i` = tasa mensual = `r / 12`  
- `n` = número de meses = años × 12  

Valor futuro aproximado:

$$
FV = P \cdot \frac{(1 + i)^n - 1}{i}
$$

En el código se calcula mes a mes para poder generar la tabla y la gráfica.

## Arquitectura – Fase 1

Fase 1: solo frontend estático, desplegado en **AWS S3 + CloudFront**:

```text
[User Browser]
      |
      v
[CloudFront Distribution]  --->  [S3 Static Website Bucket]
                                     - Versioning ON
```

* **S3** : hosting de archivos estáticos (HTML, CSS, JS)
* **CloudFront** : CDN para servir el sitio con baja latencia y HTTPS

## Cómo correrlo en local

1. Clonar el repo
2. Ir a la carpeta `frontend/`
3. Abrir `index.html` en el navegador

## Despliegue en AWS (resumen)

1. Crear bucket S3 con versioning habilitado
2. Activar "Static website hosting" y subir los archivos de `frontend/`
3. Crear distribución CloudFront apuntando al bucket S3
4. Usar la URL de CloudFront como enlace público del proyecto
Con eso ya documentas la Fase 1 de forma clara.

---

## C. Despliegue en AWS S3 + CloudFront (paso a paso)

Te lo dejo **como receta**, pensando que vas empezando.

### ✅ Pre-requisitos

- Tener una cuenta de AWS.
- Tener configurado un usuario IAM con permisos para S3 y CloudFront (y tus credenciales configuradas en AWS CLI en tu laptop).

---

### 1️⃣ Crear el bucket S3

1. Entra a la consola de AWS.  
2. Ve a **S3**.  
3. Click en **Create bucket**.
4. Nombre (ejemplo): `simple-savings-frontend-fer-12345`  
   - Region: por ejemplo `us-east-1` (N. Virginia).
5. Desmarca cualquier opción que bloquee *por completo* el acceso público si vas a usar website endpoint directo (si vas a ir por CloudFront con OAC lo puedes dejar más cerrado, pero para empezar manténlo simple).
6. Crea el bucket.

#### Habilitar versioning

1. Dentro del bucket → pestaña **Properties**.  
2. Busca **Bucket Versioning** → haz click en **Edit**.  
3. Activa **Enable**.

---

### 2️⃣ Activar "Static Website Hosting"

1. En el bucket, pestaña **Properties**.  
2. Baja hasta **Static website hosting**.  
3. Click en **Edit**.  
4. Marca **Enable**.  
5. **Index document**: `index.html`  
6. **Error document**: puedes poner `index.html` también (para SPA simple) o `error.html` si llegas a crear uno.  
7. Guarda.

Te va a aparecer una URL tipo:

```text
http://simple-savings-frontend-fer-12345.s3-website-us-east-1.amazonaws.com
```

(Esa es la URL directa del sitio en S3 – sin HTTPS.)

---

### 3️⃣ Subir los archivos del frontend

Desde tu PC, en la carpeta raíz del proyecto tienes `/frontend`.

Dentro de `frontend` deben estar estos archivos y carpetas:

```text
frontend/
├─ index.html
├─ css/
│  └─ styles.css
└─ js/
   ├─ charts.js
   └─ app.js
```

#### Opción A – Subir por consola web

1. En el bucket → pestaña  **Objects** .
2. Click  **Upload** .
3. Sube la carpeta `frontend` o su contenido (si subes la carpeta, cuida la ruta).
4. Verifica que `index.html` quede en la raíz del bucket (no adentro de otra carpeta como `frontend/index.html`).

#### Opción B – Subir con AWS CLI

Desde la terminal (PowerShell):

```bash
cd ruta/donde/esta/simple-savings
aws s3 sync ./frontend s3://simple-savings-frontend-fer-12345 --delete
```

* `--delete` elimina archivos en S3 que ya no existan en tu carpeta local → útil para mantener orden.

---

### 4️⃣ Probar el sitio directo en S3 (sin CloudFront)

Abre en el navegador la URL que te dio S3 en  **Static website hosting** .

Deberías poder:

* Ver la UI dark.
* Meter un aporte mensual, tasa y años.
* Ver resultados, gráfica y tabla.
* Usar el botón de  **Nueva consulta** .

Si eso funciona → v1 está bien.

---

### 5️⃣ Crear distribución CloudFront

Ahora lo hacemos “bien” con CloudFront, para tener:

* HTTPS
* CDN
* URL más estable para tu portafolio

1. Ve a **CloudFront** en la consola AWS.
2. Click en  **Create distribution** .

En  **Origin** :

* **Origin domain** :
* Puedes seleccionar tu bucket S3.
* **Origin path** : déjalo vacío.
* Si te deja elegir:
  * Puedes usar el *bucket* como origin (no el website endpoint).
  * Para algo sencillo de portafolio, cualquiera te sirve, lo importante es que apunte al contenido.

En  **Default cache behavior** :

* **Viewer protocol policy** : `Redirect HTTP to HTTPS`.

En  **Settings** :

* **Default root object** → `index.html`.

Crea la distribución.

Cuando el **Status** esté en `Deployed` y **State** en `Enabled`, tendrás un dominio tipo:

```text
https://dxxxxxxxxxxxx.cloudfront.net
```

Esa es tu URL pública “bonita” (con HTTPS).

---

### 6️⃣ Probar el sitio vía CloudFront

Abre la URL de CloudFront:

* Haz varias simulaciones: cambia aporte, tasa, años.
* Verifica:
  * Que la gráfica cambie.
  * Que la tabla se actualice.
  * Que el botón de “Nueva consulta” limpie todo.

Si algo falla, casi siempre es porque:

* Algún archivo no se subió donde debe (`css/styles.css`, `js/app.js`, etc.).
* O porque `index.html` no está en la raíz del bucket.

---
