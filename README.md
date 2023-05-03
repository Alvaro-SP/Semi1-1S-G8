# -Semi1-Practica2_G8

<p>UNIVERSIDAD DE SAN CARLOS DE GUATEMALA</p>
<p>FACULTAD DE INGENIERIA</p>
<p>ESCUELA DE CIENCIAS Y SISTEMAS</p>
<p>SISTEMAS OPERATIVOS 1</p>
<p>PRIMER SEMESTRE 2023</p>

---

---

---

---

---

---

---

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&width=435&lines=DOCUMENTACION)](https://git.io/typing-svg)

---

---

---

---

---

---

---

---

| Nombre                               |  Carnet   |
| ------------------------------------ | :-------: |
| Alvaro Emmanuel Socop Pérez          | 202000194 |
| Fabian Esteban Reyna Juárez          | 202003919 |
| Javier Alejandro Gutiérrez de León   | 202004765 |
| Bryan Eduardo Gonzalo Méndez Quevedo | 201801528 |

---

## <a name="intro" ></a>ÍNDICE

| Topico                           | Link          |
| -------------------------------- | ------------- |
| Introducción                     | [Ir](#intro)  |
| Objetivos y alcances del sistema | [Ir](#ob)     |
| Componentes utilizados           | [Ir](#sis)    |
| Sistema Operativo                | [Ir](#sis)    |
| Vistas de la aplicación          | [Ir](#vistas) |
| Tecnologías utilizadas           | [Ir](#tech)   |
| Interfaz del programa            | [Ir](#inter)  |
| Conclusiones                     | [Ir](#Conclu) |

# PhotoBucket in AWS Cloud Tools

## <a name="intro" ></a>INTRODUCCIÓN

Amazon Web Services (AWS) es una plataforma de servicios de nube que ofrece potencia de cómputo, almacenamiento de bases de datos, entrega de contenido y otra funcionalidad para ayudar a las empresas a escalar y crecer.

## Objetivos

- General

  Implementar los servicios de seguridad y desarrollo de AWS

- Específicos

○ Crear un entorno de desarrollo para una aplicación web
○ Implementar una arquitectura personalizada
○ Integrar servicios y APIs de AWS

## Arquitectura utilizada

- Amazon S3:
  para almacenar las imágenes de la aplicación de forma escalable y duradera. Las imágenes se pueden cargar y descargar mediante una API RESTful proporcionada por Amazon S3.

- Amazon EC2:
  para ejecutar las instancias de la aplicación que se conectarán al balanceador de carga. La aplicación se puede empaquetar en un contenedor de Docker para una fácil implementación y escalabilidad.

- Amazon LEX:
  Para el servicio de Amazon Lex, la arquitectura utilizada en AWS se basa en una combinación de varios servicios. El núcleo de la arquitectura es el servicio de Amazon Lex en sí, que proporciona la capacidad de comprensión y procesamiento del lenguaje natural a través de la tecnología de aprendizaje automático.

- Amazon Rekognition:
  servicio de análisis de imágenes y video que utiliza la tecnología de aprendizaje profundo para detectar objetos, escenas y rostros, además de realizar análisis de contenido en imágenes y videos. La arquitectura utilizada en AWS para Amazon Rekognition se basa en una combinación de varios servicios, incluyendo Amazon S3 para almacenar y recuperar imágenes y videos, y Amazon DynamoDB para almacenar y consultar metadatos relacionados con el contenido.

![a](assets/arq2.png)

## Configuraciones Principales

Estas son algunas configuraciones necesarias para establecer la aplicacion web PhotoBucket que se ha realizado utilizando herramientas de AWS

### Configuracion de las EC2

- Acceder a la consola de AWS y seleccionar el servicio de EC2.

![a](assets/ec1.png)

- Hacer clic en "Launch Instance" para comenzar a crear una instancia.

![a](assets/ec2.png)

- Elegir una AMI (Amazon Machine Image) que contenga el sistema operativo y software que necesites para tu aplicación.

![a](assets/ec3.png)

- Elegir el tipo de instancia.

![a](assets/ec4.png)

- Configurar las opciones de almacenamiento, incluyendo el tipo y el tamaño de la instancia EBS (Elastic Block Store).
- Configurar las opciones de seguridad, como la creación o selección de un grupo de seguridad que permita el tráfico necesario para tu aplicación.

![a](assets/ec5.png)

- Añadir etiquetas a la instancia para identificarla fácilmente.

- Revisar y confirmar los detalles de la instancia antes de lanzarla.

Esperar a que se inicie la instancia y obtener su dirección IP pública o DNS.

![a](assets/ec6.png)

- instancias corriendo:

![a](assets/insrun.jpg)

Posteriormente con algun cliente SSH podemos acceder a la api

![a](assets/insrun2.jpg)

### Configuracion de S3 Bucket para almacenar fotos

- bucket con sus carpetas correspondientes.

![a](assets/buck1.png)

- Politica del bucket.

![a](assets/buck2.png)

### Configuracion de ChatBot de Amazon Lex

- primeros pasos configurando el Amazon Lex

![a](assets/BOT1.png)

- teniendo el bot creado se procede a configurar el chat

![a](assets/BOT2.png)

![a](assets/BOT3.png)

- se procede a configurar el chatbot para que pueda ser utilizado en la pagina web

![a](assets/BOT4.png)

### Configuracion de S3 Bucket para Pagina web Estatica

- Acceder a la consola de AWS con el usuario IAM con permisos de S3 e ir a dicha consola.

![a](assets/s3_1.PNG)

- Crear el bucket con el nombre _practica1-g8-paginaweb_

![a](assets/s3_2.PNG)

- Desactivar la opcion de _Bloquear todo el acceso publico_

![a](assets/s3_3.PNG)

- Subir los objetos al bucket

![a](assets/s3_4.PNG)

- Configurar _alojamiento de sitios web estaticos_

![a](assets/s3_5.PNG)

- En la pestaña de permisos, colocar la politica del bucket

![a](assets/s3_6.PNG)

- Para acceder se utiliza el link generado en la seccion de _alojamiento de sitios web estaticos_
  ![a](assets/s3_7.PNG)

## <a name="vistas" ></a> Api Gateway

API Gateway es un servicio completamente administrado por AWS que permite crear, publicar, mantener, supervisar y proteger APIs RESTful y WebSocket a cualquier escala. A continuación, se presentan los pasos para usar API Gateway en AWS:

PASOS REALIZADOS :

- Crear una API RESTful: En el panel de control de AWS, seleccione API Gateway y haga clic en Crear API. Elija el tipo de API que desea crear (RESTful o WebSocket). Luego, cree un recurso, como una ruta o un punto final.

- Configurar el punto final: Configure el punto final de la API para determinar la dirección URL a la que se dirigirán las solicitudes. Puede crear un nuevo punto final o usar uno existente.

- Crear un método: Seleccione el recurso y cree un método HTTP, como GET, POST, PUT o DELETE. Configure el método para especificar el tipo de integración, la fuente de datos y el tipo de respuesta.

- Configurar integraciones: Configure la integración de la API con otros servicios de AWS o servicios externos. API Gateway admite integraciones con Lambda, DynamoDB, S3, HTTP, HTTPS, y otros servicios.

- Agregar autorización: Agregue opciones de autorización para controlar el acceso a la API. Las opciones de autorización incluyen IAM, Lambda, OAuth, Cognito y personalizado.

- Pruebas y depuración: Use la herramienta de prueba integrada en API Gateway para probar y depurar su API antes de publicarla. La herramienta de prueba le permite enviar solicitudes HTTP y ver las respuestas en tiempo real.

- Publicar su API: Cuando esté satisfecho con su API, publíquela para que otros puedan usarla. API Gateway admite la publicación en diferentes etapas, como dev, prueba, producción, etc.

- Monitoreo y análisis: Use la herramienta de análisis de API Gateway para supervisar el rendimiento de su API. La herramienta le permite ver estadísticas de uso, errores, latencia y otros datos clave para ayudar a optimizar su API.

## <a name="vistas" ></a> Vistas de la aplicación

- Vista de la pagina de login
  ![a](assets/i2.png)
- Vista de la pagina de ver info
  ![a](assets/1.png)
- Vista de la pagina de publicaciones
  ![a](assets/2.png)
- Vista de la pagina de subir fotos
  ![a](assets/3.png)
- Vista de la pagina de perfil
  ![a](assets/i7.png)
- Vista de la pagina de ChatBot
  ![a](assets/i8.png)
- Vista de la pagina de chat y amigos
  ![a](assets/4.png)
  Vista de la pagina de de notificaciones y los usuarios
  ![a](assets/5.png)

## Tecnologias utilizadas

La aplicación de Fotos se compone de varios componentes, cada uno de los cuales se describe a continuación:

### Angular

Angular se utiliza para crear la interfaz de usuario de la aplicacion de FOTOS la cual muestra cada uno de los modulos.

### NodeJS

Se ha creado el servidor web de la aplicación

## Conclusiones

Los servicios de AWS son altamente escalables, lo que significa que pueden crecer o disminuir según las necesidades de la aplicación. Esto es especialmente importante para una aplicación como Photobucket que puede tener un gran número de usuarios y archivos.

El uso de los servicios de AWS como S3, RDS y ELB puede proporcionar una serie de ventajas importantes para una aplicación web como Photobucket, incluyendo escalabilidad, confiabilidad, seguridad, fácil integración y ahorro de costos.

## Anexos

### Requisitos previos

Antes de comenzar la implementación de la arquitectura, se deben cumplir los siguientes requisitos previos:

- Una cuenta de AWS con permisos para crear y configurar los servicios necesarios.

- Conocimientos básicos de programación en Go y Node.js.

- Conocimientos básicos de Docker y Docker Compose.

- Una imagen de la aplicación Go y otra de la aplicación Node.js listas para ser implementadas.

- Creación de los servicios de AWS
  Para crear la arquitectura descrita, se deben crear los siguientes servicios de AWS:

- Un bucket de Amazon S3 para almacenar las imágenes de la aplicación.

- Una instancia de Amazon RDS con MySQL.

- Una instancia de Amazon EC2 con Docker instalado para ejecutar las instancias de la aplicación.

- Un balanceador de carga de Amazon ELB para distribuir la carga de tráfico.

- Una función de AWS Lambda para procesar las imágenes.

### Configuración de la base de datos de MySQL

Después de crear la instancia de Amazon RDS con MySQL, se deben configurar las siguientes opciones:

- Crear una base de datos para almacenar los enlaces a las imágenes.

- Crear un usuario con permisos de lectura y escritura en la base de datos.

- Configurar el grupo de seguridad para permitir el acceso a la instancia de Amazon EC2 que alojará la aplicación.

- Configuración de la instancia de Amazon EC2

- Configurar las variables de entorno de LA EC2 para incluir las credenciales de acceso a la base de datos y al bucket de Amazon S3.

- Configurar el archivo de Docker Compose para definir los servicios de la aplicación Go y Node.js.

- Configurar el grupo de seguridad para permitir el acceso al balanceador de carga de Amazon ELB.

- Configuración del balanceador de carga de Amazon ELB
  Después de crear el balanceador de carga de Amazon ELB, se deben configurar las siguientes opciones:

- Configurar el balanceador de carga para distribuir la carga de tráfico entre las instancias de la aplicación.

- Configurar el grupo de seguridad para permitir el acceso al balanceador de carga desde Internet.
