# Sistema CRUD con Autenticación JWT

Sistema completo con API REST en Express.js y frontend en React que maneja autenticación JWT y un CRUD de usuarios. Soporta PostgreSQL y MongoDB con cambio dinámico entre bases de datos.

## 🚀 Características

- ✅ Autenticación con JWT (Login y Signup)
- ✅ CRUD completo de usuarios
- ✅ Soporte para PostgreSQL y MongoDB
- ✅ Switch en el frontend para cambiar entre bases de datos
- ✅ Interfaz moderna y responsiva
- ✅ Protección de rutas con middleware

## 📋 Requisitos Previos

### Opción 1: Con Docker (Recomendado)
- Docker Desktop instalado
- Docker Compose

### Opción 2: Sin Docker
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🔧 Instalación

### 🐳 Opción 1: Con Docker (Recomendado)

**La forma más fácil de ejecutar el proyecto:**

1. Asegúrate de tener Docker Desktop instalado y corriendo

2. Desde la raíz del proyecto, ejecuta:
```bash
docker-compose up --build
```

3. ¡Eso es todo! El sistema completo estará disponible en:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432
   - MongoDB: localhost:27017

**Comandos útiles de Docker:**

```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (limpia las bases de datos)
docker-compose down -v

# Reconstruir las imágenes
docker-compose up --build
```

### 💻 Opción 2: Sin Docker (Instalación Manual)

#### Backend

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en el archivo `.env`:
```env
PORT=5000
JWT_SECRET=tu_super_secreto_jwt_cambiame_en_produccion

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=crud_db
PG_USER=postgres
PG_PASSWORD=tu_contraseña

# MongoDB
MONGO_URI=mongodb://localhost:27017/crud_db
```

4. Asegúrate de que PostgreSQL y MongoDB estén corriendo

5. Inicia el servidor:
```bash
npm start
# o para desarrollo con nodemon
npm run dev
```

#### Frontend

1. Navega a la carpeta frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 🎯 Uso

1. **Seleccionar Base de Datos**: Al abrir la aplicación, verás un switch para elegir entre MongoDB o PostgreSQL

2. **Registro**: Crea una nueva cuenta con usuario, email y contraseña

3. **Login**: Inicia sesión con tus credenciales

4. **Panel de Control**: Una vez autenticado, podrás:
   - Ver todos los usuarios
   - Editar usuarios
   - Eliminar usuarios
   - Ver qué base de datos estás usando

## 📁 Estructura del Proyecto

```
CRUD/
├── backend/
│   ├── config/
│   │   └── database.js       # Configuración de bases de datos
│   ├── middleware/
│   │   └── auth.js            # Middleware de autenticación JWT
│   ├── models/
│   │   ├── userMongo.js       # Modelo de usuario para MongoDB
│   │   └── userPostgres.js    # Modelo de usuario para PostgreSQL
│   ├── routes/
│   │   ├── auth.js            # Rutas de autenticación
│   │   └── users.js           # Rutas CRUD de usuarios
│   ├── .env                   # Variables de entorno
│   ├── .dockerignore          # Archivos ignorados por Docker
│   ├── Dockerfile             # Configuración Docker del backend
│   ├── package.json
│   └── server.js              # Punto de entrada del servidor
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js        # Panel principal con CRUD
│   │   │   ├── DatabaseSwitch.js   # Switch de bases de datos
│   │   │   ├── DatabaseSwitch.css
│   │   │   ├── Login.js            # Componente de login
│   │   │   └── Signup.js           # Componente de registro
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .dockerignore          # Archivos ignorados por Docker
│   ├── Dockerfile             # Configuración Docker del frontend
│   └── package.json
│
└── docker-compose.yml         # Orquestación de todos los servicios
```

## 🔐 API Endpoints

### Autenticación

- `POST /api/auth/signup` - Registrar nuevo usuario
  ```json
  {
    "username": "usuario123",
    "email": "user@email.com",
    "password": "password123",
    "dbType": "mongodb" // o "postgres"
  }
  ```

- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "user@email.com",
    "password": "password123",
    "dbType": "mongodb" // o "postgres"
  }
  ```

### Usuarios (Requieren autenticación)

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

**Header requerido:**
```
Authorization: Bearer <token>
```

## 🛠️ Tecnologías Utilizadas

### Backend
- Express.js - Framework web
- JWT - Autenticación
- bcryptjs - Hash de contraseñas
- Mongoose - ODM para MongoDB
- pg - Cliente PostgreSQL
- dotenv - Variables de entorno
- cors - Middleware CORS

### Frontend
- React - Librería UI
- Axios - Cliente HTTP
- CSS3 - Estilos

### DevOps
- Docker - Contenedorización
- Docker Compose - Orquestación de servicios
- PostgreSQL 15 (Alpine)
- MongoDB 7.0

## 📝 Notas

- El switch de base de datos permite cambiar entre PostgreSQL y MongoDB
- Cada usuario se registra en la base de datos seleccionada
- El token JWT almacena qué base de datos está usando el usuario
- Las contraseñas se hashean con bcrypt antes de almacenarse
- Los tokens expiran en 24 horas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📄 Licencia

ISC
