# 📱 **Reserva y Gestión de Parcelas - App Ionic**

Esta aplicación móvil permite a los usuarios gestionar reservas y marcar ingresos y salidas de parcelas mediante escaneo de códigos QR o ingreso manual. Está diseñada para que los usuarios puedan gestionar sus reservas de manera eficiente y recibir notificaciones sobre el estado de las mismas, además de facilitar la gestión de accesos a parcelas.

---

## 🚀 **Funcionalidades**

### 1. 📝 **Carga de Reservas**
- Los usuarios pueden realizar reservas proporcionando los siguientes datos:
  - **Nombre completo**
  - **Número de socio**
  - **Correo electrónico**
- Se valida que todos los campos sean completados correctamente.

### 2. 📧 **Estado de Reservas**
- Las reservas pasan por tres estados:
  - **Pendiente**: La reserva aún no ha sido aprobada.
  - **Aprobada**: La reserva ha sido confirmada.
  - **Desaprobada**: La reserva ha sido rechazada.
- Cada cambio de estado genera una notificación por correo electrónico al usuario.

### 3. ⛔ **Validación de Disponibilidad**
- **Reservas aprobadas** bloquean la fecha de reserva para otros usuarios.
- **Reservas pendientes** no bloquean la fecha, lo que permite que más usuarios intenten reservar ese día hasta que se apruebe una de ellas.

### 4. 📲 **Escaneo de QR - Marcaje de Ingreso/Salida**
- La aplicación cuenta con un servicio para escanear códigos QR y marcar el **ingreso** y **salida** de usuarios en parcelas.
- Las parcelas son gestionadas por un servicio independiente, pero la app ofrece esta funcionalidad como integración.

### 5. 🔄 **Ingreso Manual en Caso de Fallo del QR**
- Si el escaneo de QR no está disponible, se permite el ingreso manual de los datos para marcar ingreso o salida.

### 6. 👥 **Restricciones en el Marcaje de Salida**
- **Solo el número de socio** que registró el ingreso inicialmente puede marcar la salida.
- **Usuarios administradores** pueden marcar la salida desde una aplicación paralela, pero esta funcionalidad no está presente en esta app.

---

## 📦 **Librerías Utilizadas**

| Librería                              | Versión   | Instalación                                              | Funcionalidad                                                                                 |
| ------------------------------------- | --------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **@capacitor-mlkit/barcode-scanning** | `^6.1.0`  | `npm install @capacitor-mlkit/barcode-scanning`           | Permite el escaneo de códigos QR para marcar el ingreso y la salida de las parcelas.           |
| **@meddv/ngx-pinch-zoom**             | `^18.0.1` | `npm install @meddv/ngx-pinch-zoom`                       | Añade la funcionalidad de zoom a imágenes para mejorar la visualización dentro de la app.      |
| **@ng-icons/core**                    | `^28.1.0` | `npm install @ng-icons/core`                              | Sistema de iconos SVG ligero y optimizado para Angular.                                        |
| **@ng-icons/heroicons**               | `^28.1.0` | `npm install @ng-icons/heroicons`                         | Conjunto de iconos de alta calidad y consistencia visual para usar en la app.                  |
| **ionicons**                          | `^7.2.1`  | `npm install ionicons`                                    | Librería de iconos oficial de Ionic utilizada para mejorar la interfaz de usuario.             |
| **swiper**                            | `^11.1.6` | `npm install swiper`                                      | Biblioteca que proporciona carruseles y deslizadores responsivos y suaves para las interfaces. |
| **tailwindcss**                       | `^3.4.5`  | `npm install tailwindcss`                                 | Framework de CSS utilitario para diseñar interfaces de usuario de manera rápida y eficiente.   |

---

## 🛠 **Configuración de la App**

Para comenzar a usar la aplicación, sigue estos pasos:

1. Clona el repositorio en tu máquina local.
   ```bash
   git clone https://github.com/BlisterRAqueveque/magisterio-app.git

2. Instala las dependencias del proyecto.
   ```bash
   npm install

3. Configura las variables de entorno necesarias.

4. Ejecuta la aplicación en modo de desarrollo.
   ```bash
    ionic serve

## 📧 **Contacto**
Si tienes alguna duda o sugerencia sobre la aplicación, no dudes en contactarnos a través del correo electrónico: soporte@app.com.

## **¡Gracias por utilizar nuestra aplicación!** 🚀