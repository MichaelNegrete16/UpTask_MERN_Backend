import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import {emailRegistro,emailForgotPassword} from '../helpers/email.js'

const registrar = async (req,res) =>{

    //Evitar registros duplicados
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({ email})
    
    if(existeUsuario){
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({msg: error.message})
    }

    try {

        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()

        //Enviar el Email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'Usuario creado correctamente, Revisa tu email para confirmar tu cuenta'})

    } catch (error) {
        console.log(error)
    }
}


const autenticar = async (req,res) => {

    const {email,password} = req.body

    //Comprobar si el usuairio existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //Comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('El password es incorrecto')
        return res.status(403).json({msg: error.message})
    }

}

const confirmar = async (req,res) => {

    const {token} = req.params
    const usuairioConfirmar = await Usuario.findOne({token})

    if(!usuairioConfirmar){
        const error = new Error('Token no valido')
        return res.status(403).json({msg: error.message})
    }

    try {
        
        usuairioConfirmar.confirmado = true
        usuairioConfirmar.token = ''
        await usuairioConfirmar.save()
        res.json({msg:"Usuario confirmado correctamente"})

    } catch (error) {
        console.log(error)
    }

    console.log(usuairioConfirmar)
}

const forgetPassword = async (req,res) =>{
    const {email} = req.body

    //Comprobar si el usuairio existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        emailForgotPassword({
            email: usuario.email,
            token: usuario.token
        })
        res.json({msg:"Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error)
    }


}

const comprobarToken = async (req,res) => {
    const {token} = req.params
    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        res.json({msg:"Token Valido y el usuario existe"})
    }else{
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message})
    }

}

const nuevoPassword = async (req,res) =>{
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({msg:"Contraseña Cambiada correctamente"})
        } catch (error) {
            console.log(error)
        }
    }else{
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message})
    }

}

const perfil = async (req,res) =>{
    const {usuario} = req

    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    forgetPassword,
    comprobarToken,
    nuevoPassword,
    perfil
}