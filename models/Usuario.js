import mongoose from "mongoose"
import bcrypt from "bcrypt"

//Definir un Schema para que se registren los usuarios
const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require:true,
        trim: true,
        unique: true
    },
    token:{
        type: String,
        trim: true
    },
    confirmado:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

//Hashear los password
usuarioSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//Compruebe el password
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario