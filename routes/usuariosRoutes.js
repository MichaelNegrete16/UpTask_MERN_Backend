import express from "express";
const router = express.Router()
import {registrar,autenticar,confirmar,forgetPassword,comprobarToken,nuevoPassword,perfil } from "../controllers/usuarioControlller.js";
import checkAuth from '../middleware/checkAuth.js'

//Autenticacion, Registro y confirmacion de usuarios
router.post("/",registrar)//Crea un nuevo usuario
router.post("/login",autenticar)
router.get("/confirmar/:token", confirmar)
router.post("/olvide-password", forgetPassword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil)



export default router