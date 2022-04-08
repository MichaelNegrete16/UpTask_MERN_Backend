import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectar from './config/db.js'
import router from './routes/usuariosRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'


const app = express()
app.use(express.json())

dotenv.config()

conectar()

// Configurar Cors
const whitelist = [process.env.FRONTEDN_URL]
const corsOptions = {
    origin: function(origin,callback){
        // console.log(origin)
        if(whitelist.includes(origin)){
            //Puede consultar la api
            callback(null,true)
        }else{
            //No esta permitido su request
            callback(new Error('Error de Cors'))
        }
    }
}

app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios',router)
app.use('/api/proyectos',proyectoRoutes)
app.use('/api/tareas',tareaRoutes)

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () =>{
    console.log(`Servidor Corriendo en el puerto ${PORT}`)
})

// Socket Io
import {Server} from 'socket.io'

const io = new Server(servidor, {
    pingTimeout:60000,
    cors:{
        origin: process.env.FRONTEDN_URL,
    }
})

io.on('connection', (socket) =>{
    console.log('Conectado a socket.io')

    //definir los eventos de socket io
    socket.on('abrir proyecto',(proyecto)=>{
        socket.join(proyecto)
    })

    socket.on('nuevaTarea', tarea =>{

        //destructirin cambia para evitar problemas
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tareaAgregada',tarea)

    })

    // socket.on('eliminarTarea', tarea =>{
    //     const proyecto = tarea.proyecto
    //     socket.to(proyecto).emit('tareaEliminada',tarea)
    // })

    // socket.on('actualizarTarea', tarea => {
    //     const proyecto = tarea.proyecto._id
    //     socket.to(proyecto).emit('tareaActualizada',tarea)
    // })
})