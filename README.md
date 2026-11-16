# Sistema de Biblioteca

Aplicación web para la gestión de biblioteca desarrollada con MySQL, FastAPI y React.

---

## Requisitos previos

* Python 3.10 o superior
* Node.js 18 o superior
* MySQL / MariaDB (XAMPP o servicio local)

---

## 1. Base de datos

1. Iniciar el servicio de MySQL (por ejemplo desde el panel de XAMPP).
2. Crear la base de datos `biblioteca` o importar directamente el archivo:
   ```bash
   mysql -u root -p < biblioteca.sql
   ```
   *(También se puede importar desde phpMyAdmin seleccionando la opción **Importar** y eligiendo el archivo `biblioteca.sql`)*.

---

## 2. Backend (FastAPI)

1. Abrir una terminal y posicionarse en la carpeta del backend:
   ```bash
   cd backend
   ```

2. Crear y activar el entorno virtual:
   * **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **Linux / Mac**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Iniciar el servidor:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * La API quedará disponible en: `http://127.0.0.1:8000`
   * Documentación interactiva Swagger: `http://127.0.0.1:8000/docs`

---

## 3. Frontend (React)

1. Abrir otra terminal en la raíz del proyecto e instalar las dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   * La aplicación abrirá en: `http://localhost:5173`

---

## Credenciales de acceso por defecto

* **Usuario**: `admin`
* **Contraseña**: `1234`
* **Rol**: Administrador
