const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const rutas = require("./Routes/routerController")

app.set('port', process.env.PORT || 4000);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());



const users = {};
// configuracion del Websocket
io.on('connection', (socket) => {
    console.log('nuevo usuario conectado ', socket.id, ' id=', socket.handshake.query.userId);
    const userId = socket.handshake.query.userId;
    const idSocket = socket.id;
    users[userId] = idSocket; //se recomienda guardar todo , pero solo guardare el id
    // INCOMING MESSAGES FRON THIS USER
    socket.on('message', (data) => {
        // send the message to an specific user
        const recipientid = data.recipientid;
        let idEncontrado = users[recipientid]
        // const recipientSocket = Array.from(io.sockets.sockets.get(idEncontrado));
        // console.log(io.sockets.sockets);
        // es aqui donde se manda el mensaje hacia el usuario
        console.log(idEncontrado)
        io.to(idEncontrado).emit('message', data);
    });
    // DISCONNECT
    socket.on('disconnect', () => {
        console.log('usuario desconectado');
        delete users[socket.id];
    });
});

http.listen(app.get('port'), () => {
    console.log('Server On Port ', app.get('port'))
});

app.use("/", rutas);