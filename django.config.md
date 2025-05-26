# Guía de Integración con Django REST Framework

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración del Backend](#configuración-del-backend)
3. [Modelos y Migraciones](#modelos-y-migraciones)
4. [API y Serializers](#api-y-serializers)
5. [Autenticación](#autenticación)
6. [Configuración del Frontend](#configuración-del-frontend)
7. [Ejecución del Proyecto](#ejecución-del-proyecto)

## Requisitos Previos

- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn
- Git (opcional)

## Configuración del Backend

### 1. Crear y activar entorno virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.0
pip install djangorestframework-simplejwt==5.3.0
pip install python-dotenv==1.0.0
```

### 3. Crear proyecto Django

```bash
django-admin startproject backend
cd backend
```

### 4. Crear apps

```bash
python manage.py startapp users
python manage.py startapp students
python manage.py startapp subjects
python manage.py startapp grades
python manage.py startapp attendance
```

### 5. Configurar settings.py

```python
# backend/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    # Local apps
    'users',
    'students',
    'subjects',
    'grades',
    'attendance',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

## Modelos y Migraciones

### 1. Modelo de Usuario (users/models.py)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('administrator', 'Administrator'),
        ('teacher', 'Teacher'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    name = models.CharField(max_length=255)
```

### 2. Modelo de Estudiante (students/models.py)

```python
from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, unique=True)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    enrollment_date = models.DateField()
    grade = models.CharField(max_length=50)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

### 3. Modelo de Asignatura (subjects/models.py)

```python
from django.db import models
from users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField()
    credits = models.IntegerField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
```

### 4. Modelo de Notas (grades/models.py)

```python
from django.db import models
from students.models import Student
from subjects.models import Subject

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=3, decimal_places=1)
    date = models.DateField()
    semester = models.IntegerField(choices=[(1, '1° Semestre'), (2, '2° Semestre')])
    comments = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.score}"
```

### 5. Modelo de Asistencia (attendance/models.py)

```python
from django.db import models
from students.models import Student
from subjects.models import Subject

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Presente'),
        ('absent', 'Ausente'),
        ('late', 'Atrasado'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    justification = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.date}"
```

### 6. Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

## API y Serializers

### 1. Serializers

Crear serializers para cada modelo. Ejemplo para students/serializers.py:

```python
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
```

### 2. Views

Crear vistas para cada modelo. Ejemplo para students/views.py:

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
```

### 3. URLs

Configurar las URLs en backend/urls.py:

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from students.views import StudentViewSet
# Importar otros ViewSets

router = DefaultRouter()
router.register(r'students', StudentViewSet)
# Registrar otros ViewSets

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
```

## Autenticación

### 1. Configurar vistas de autenticación

Crear users/views.py:

```python
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = self.user
            response.data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'name': user.name
            }
        return response
```

### 2. Configurar URLs de autenticación

Actualizar backend/urls.py:

```python
from django.urls import path
from users.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ... otras URLs ...
    path('api/auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

## Configuración del Frontend

### 1. Configurar variables de entorno

Crear archivo .env en la raíz del proyecto frontend:

```env
VITE_API_URL=http://localhost:8000
```

### 2. Actualizar servicios

Actualizar los servicios para usar la API de Django. Ejemplo para src/services/authService.ts:

```typescript
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data.user;
};
```

## Ejecución del Proyecto

### 1. Iniciar el backend

```bash
# Activar entorno virtual
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Iniciar servidor
python manage.py runserver
```

### 2. Iniciar el frontend

```bash
npm run dev
```

### 3. Crear superusuario

```bash
python manage.py createsuperuser
```

## Notas Importantes

1. Asegúrate de que tanto el backend como el frontend estén ejecutándose en puertos diferentes
2. El backend debe estar en http://localhost:8000
3. El frontend debe estar en http://localhost:5173
4. Verifica que las variables de entorno estén correctamente configuradas
5. Asegúrate de que CORS esté correctamente configurado en Django
6. Mantén actualizados los tokens JWT para la autenticación