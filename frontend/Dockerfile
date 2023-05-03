# Establecer la imagen base
FROM node:14.17.0-alpine3.13

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos al directorio de trabajo
COPY . .

# Compilar la aplicación de Angular para producción
RUN npm run build --prod

# Establecer el servidor web que se utilizará para servir la aplicación
FROM nginx:1.21.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/dist/my-app /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar el servidor web de Nginx
CMD ["nginx", "-g", "daemon off;"]


#! sudo docker build -t alvarosp24/semi_frontend . --force-rm --no-cache
#! sudo docker run  -p 80:4200 alvarosp24/semi_frontend