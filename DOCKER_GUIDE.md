# Guía rápida de Docker

## 🐳 Comandos Docker Esenciales

### Iniciar el proyecto
```bash
# Primera vez (construir imágenes e iniciar)
docker-compose up --build

# Iniciar normalmente
docker-compose up

# Iniciar en segundo plano (modo detached)
docker-compose up -d
```

### Detener el proyecto
```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (limpia las bases de datos)
docker-compose down -v
```

### Ver el estado
```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f mongodb
```

### Reconstruir servicios
```bash
# Reconstruir un servicio específico
docker-compose build backend

# Reconstruir todo
docker-compose build

# Reconstruir y reiniciar
docker-compose up --build
```

### Acceder a los servicios
```bash
# Acceder al shell del contenedor backend
docker-compose exec backend sh

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d crud_db

# Acceder a MongoDB
docker-compose exec mongodb mongosh crud_db
```

### Limpiar todo
```bash
# Detener y eliminar todo (contenedores, redes, volúmenes)
docker-compose down -v

# Limpiar imágenes sin usar
docker system prune -a
```

## 🔧 Solución de problemas

### Puerto ya en uso
Si obtienes un error de puerto ya en uso:
```bash
# En Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Luego matar el proceso
taskkill /PID <PID> /F
```

### Reconstruir desde cero
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Ver espacio usado por Docker
```bash
docker system df
```

## 📝 Estructura de docker-compose.yml

El archivo configura 4 servicios:
1. **postgres** - Base de datos PostgreSQL en el puerto 5432
2. **mongodb** - Base de datos MongoDB en el puerto 27017
3. **backend** - API Express.js en el puerto 5000
4. **frontend** - App React en el puerto 3000

Todos los servicios están conectados en la misma red `crud-network`.
