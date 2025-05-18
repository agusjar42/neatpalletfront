Este es un proyecto de [Next.js](https://nextjs.org/) creado con [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Autores

- [@AlejandroCaicedo](https://www.linkedin.com/in/alejandrocaicedopalacios/)


# Proyecto WEB Neatpallet

A continuación se describe todo lo necesario para configurar e instalar este proyecto web en local y en el servidor.


## Requisitos
Tener instalado Node, en este caso se uso la versión:
- Node: v20.13.1


## Instalaciones

```bash
  NextJS: npm install -g next@lates
    Sass: npm install -g sass
```
## Dependencias básicas
```bash
 "dependencies": {
        "@fullcalendar/daygrid": "^6.1.8",
        "@fullcalendar/interaction": "^6.1.8",
        "@fullcalendar/react": "^6.1.8",
        "@fullcalendar/timegrid": "^6.1.8",
        "@types/node": "20.3.1",
        "@types/react": "18.2.12",
        "@types/react-dom": "18.2.5",
        "chart.js": "4.2.1",
        "next": "13.4.8",
        "primeflex": "^3.3.1",
        "primeicons": "^6.0.1",
        "primereact": "10.2.1",
        "quill": "^1.3.7",
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "typescript": "5.1.3"
    },
    "devDependencies": {
        "eslint": "8.43.0",
        "eslint-config-next": "13.4.6",
        "prettier": "^2.8.8",
        "sass": "^1.77.3"
    }
```
## Configuración

Tenemos que configurar el archivo next.config.mjs para que nos permita compilar el proyecto como archivos estaticos y subirlos al servidor.

```javascript
// @ts-check
 
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export', //-> Crea una compilación estática para subirlos al servidor, crea la carpeta compilada /out
  trailingSlash: true, //-> Sirve para que al actualizar una pagina se mantenga en la misma pagina y no regrese al index.html
}
 
export default nextConfig
```
Cuando se compile el proyecto este creara una carpeta llamada /out con todos los archivos estaticos.

Para mas información: 
- https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- https://nextjs.org/docs/app/api-reference/next-config-js/trailingSlash

## Iniciar

Ejecutar proyecto en modo Desarrollo (Local)

```bash
  npm run dev
```
Ejecutar proyecto en modo Producción (Local)

```bash
  npx serve out
```

Abrir con tu navegador para ver el resultado. [http://localhost:3000](http://localhost:3000)


## Compilar y Desplegar en el servidor
Para compilar el proyecto debemos usar el comando:
```bash
  npm run build
```
Una vez termine de compilar, debemos tomar los archivos y directorios de la carpeta /out y subirlos al servidor.



## Configurar Tema

Se puede desarrollar un tema personalizado siguiendo los siguientes pasos.

- Elija un nombre de tema personalizado como "mitema".
- Cree una carpeta llamada "mitema" en la carpeta tema/theme-light/ .
- Cree un archivo como theme.scss dentro de su carpeta "mitema".
- Defina las variables que se enumeran a continuación en su archivo e importe las dependencias.
- Estas son las variables necesarias para crear un tema.

Ruta archivo: public\theme\theme-light\mitema\theme.scss
```javascript
$primaryColor: #8b5cf6 !default;
$primaryLightColor: #ddd6fe !default;
$primaryDarkColor: #7c3aed !default;
$primaryDarkerColor: #6d28d9 !default;
$primaryTextColor: #ffffff !default;
$primary500: #8b5cf6 !default;

$highlightBg: #f5f3ff !default;
$highlightTextColor: $primaryDarkerColor !default;

@import "../_variables";
@import "../../theme-base/_components";
@import "../_extensions";
@import "../../extensions/_fullcalendar";

```

Luego de esto debemos compilar con Sass el archivo que hemos creado (theme.scss)
```bash
  sass .\public\theme\theme-light\mitema\theme.scss .\public\theme\theme-light\mitema\theme.css
```
Esto nos creara un archivo css en la misma carpeta.

### Incluir el tema en la aplicación
Una vez compilado el tema, debemos tocar algunos componentes de React para poderlo ver en la aplicación.

- app\layout.tsx
```html
<head>
    <link
        id="theme-link"
        href={`/theme/theme-light/mitema/theme.css`}
        rel="stylesheet"
    ></link>
</head>
```
- layout\context\layoutcontext.tsx
```javascript
const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: "outlined",
        menuMode: "static",
        menuTheme: "colorScheme",
        colorScheme: "light",
        theme: "mitema",
        scale: 14,
    });
```
- layout\AppConfig.tsx
```javascript
  const componentThemes = [
        { name: "indigo", color: "#6366F1" },
        { name: "blue", color: "#3B82F6" },
        { name: "purple", color: "#8B5CF6" },
        { name: "teal", color: "#14B8A6" },
        { name: "cyan", color: "#06b6d4" },
        { name: "green", color: "#10b981" },
        { name: "orange", color: "#f59e0b" },
        { name: "pink", color: "#d946ef" },
        { name: "mitema", color: "#db336e" },
    ];
```

Ya con esta configuración tendriamos un tema personalizado en nuestra aplicación.

## GENERAR CLIENTE API AXIOS
- Para generar nuevamente el cliente de la API debemos ir a la carpeta: \app\api-neatpallet\backend
- Copiamos el JSON generado por el Backend API en el archivo: openapi.json
- Ejecutamos el .bat para generar la carpeta "axios": .\update.bat
- Esto nos generará una carpeta llamada "axios-2", debemos eliminar la carpeta "axios" antigua y renombrar la carpeta "axios-2" por "axios" 

Y en este punto si todo ha salido bien, ya podriamos usar los endpoints de la API.

## Leer más

Para obtener más información sobre Next.js, consulte los siguientes recursos:

- [Next.js Documentation](https://nextjs.org/docs) - Obtenga más información sobre las funciones y la API de Next.js.
- [Learn Next.js](https://nextjs.org/learn) - Un tutorial interactivo de Next.js.

## 🛠 Skills
Node, React, NextJS, Tailwind CSS, Sass, Javascript, HTML, CSS...