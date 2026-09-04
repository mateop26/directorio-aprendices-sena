# 🛠️ Guía Rápida de Comandos Git (Cheat Sheet)

Esta guía de referencia rápida te servirá durante el taller y en toda tu vida profesional como desarrollador.

---

## 🗺️ El Flujo de Trabajo en Git

```text
+-----------------------+      git add       +-----------------------+      git commit     +-----------------------+      git push      +-----------------------+
|   Directorio Local    | -----------------> |      Área de Staging  | ------------------> |   Repositorio Local   | -----------------> |  Repositorio Remoto   |
|  (Working Directory)  |                    |     (Preparación)     |                     |        (.git)         |                    |       (GitHub)        |
+-----------------------+ <----------------- +-----------------------+                     +-----------------------+ <----------------- +-----------------------+
                              git restore                                                                                          git pull / fetch
```

---

## 📋 Comandos Esenciales por Categoría

### 1. Configuración Inicial (Solo se hace una vez)
| Comando | Descripción |
| :--- | :--- |
| `git config --global user.name "Tu Nombre"` | Define tu nombre de autor para los commits. |
| `git config --global user.email "tu@correo.com"` | Define tu correo de autor (vinculado a GitHub). |
| `git config --list` | Muestra la configuración actual de Git. |

### 2. Iniciar y Clonar
| Comando | Descripción |
| :--- | :--- |
| `git init` | Inicializa un nuevo repositorio Git en la carpeta actual. |
| `git clone <URL>` | Descarga una copia completa de un repositorio remoto a tu máquina. |

### 3. Estados e Inspección
| Comando | Descripción |
| :--- | :--- |
| `git status` | Muestra el estado de los archivos (modificados, en staging, sin seguimiento). |
| `git log --oneline` | Muestra el historial de commits resumido en una línea por cambio. |
| `git log --graph --oneline --all` | Muestra el árbol visual de ramas y commits. |
| `git diff` | Muestra las diferencias exactas de código sin añadir al staging. |

### 4. Preparar y Guardar Cambios (Staging & Commit)
| Comando | Descripción |
| :--- | :--- |
| `git add <archivo>` | Agrega un archivo específico al área de preparación (staging). |
| `git add .` | Agrega todos los archivos nuevos y modificados al staging. |
| `git commit -m "mensaje"` | Guarda permanentemente los cambios del staging con un mensaje explicativo. |
| `git commit --amend -m "nuevo mensaje"` | Corrige el mensaje del último commit realizado. |

### 5. Trabajo con Ramas (Branches)
| Comando | Descripción |
| :--- | :--- |
| `git branch` | Lista todas las ramas locales existentes. |
| `git branch <nombre-rama>` | Crea una nueva rama sin moverse a ella. |
| `git checkout -b <nombre-rama>` | Crea una nueva rama y se mueve inmediatamente a ella. |
| `git checkout <nombre-rama>` | Cambia a una rama existente. |
| `git switch <nombre-rama>` | Forma moderna para cambiar de rama. |
| `git merge <nombre-rama>` | Fusiona la rama especificada dentro de la rama en la que estás ubicado. |
| `git branch -d <nombre-rama>` | Elimina una rama local que ya fue fusionada. |

### 6. Sincronización con GitHub (Remotos)
| Comando | Descripción |
| :--- | :--- |
| `git remote -v` | Lista los servidores remotos conectados (`origin`, `upstream`, etc.). |
| `git remote add origin <URL>` | Vincula el repositorio local a un repositorio remoto en GitHub. |
| `git remote set-url origin <URL>` | Cambia la URL del repositorio remoto `origin`. |
| `git push -u origin <rama>` | Sube la rama al repositorio remoto y la establece como seguimiento por defecto. |
| `git push` | Sube los nuevos commits a la rama remota configurada. |
| `git pull` | Descarga e integra automáticamente los cambios del repositorio remoto al local. |

---

## 💡 Buenas Prácticas para Mensajes de Commit (`Conventional Commits`)

Un buen commit explica **qué se hizo** y **por qué**:

- `feat(perfil): agregar tarjeta de presentación de Juan Perez` (Nueva funcionalidad)
- `fix(css): corregir desbordamiento del avatar en pantallas móviles` (Corrección de error)
- `docs(readme): actualizar instrucciones de despliegue en GitHub Pages` (Documentación)
- `style(cards): ajustar espaciado y colores institucionales SENA` (Formato visual sin cambio de lógica)
- `refactor(js): optimizar función de filtrado de aprendices` (Refactorización de código)

---

## 🆘 Preguntas Frecuentes y Casos de Emergencia

### ¿Cómo descarto los cambios de un archivo antes de hacer commit?
```bash
git restore ruta/al/archivo.ext
```

### ¿Cómo saco un archivo del Staging Area si le di `git add` por error?
```bash
git restore --staged ruta/al/archivo.ext
```

### ¿Cómo veo qué rama tengo activa en este momento?
```bash
git branch --show-current
```

### Git me pide usuario y contraseña al hacer push:
Desde 2021, GitHub requiere un **Personal Access Token (PAT)** o autenticación mediante **GitHub Desktop / SSH / VS Code OAuth** en lugar de tu contraseña tradicional. En VS Code, simplemente haz clic en "Permitir / Iniciar sesión con GitHub" en la ventana emergente.

---

*Conserva esta guía como referencia para tus proyectos formativos y de desarrollo.*
