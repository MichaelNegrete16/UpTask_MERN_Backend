import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) =>{
    const {email,nombre,token} = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email

      const info = await transport.sendMail({
          from: '"UpTask - Administrador De Proyectos Mamalones 4k" <noreply@uptask.com>',
          to: email,
          subject: "UpTask - Cole comprueba tu cuenta para ver si no te metieron este mensaje sin querer :D",
          text:" Compruebala Aqui Vale mia :D",
          html:` <h1>He vale mia, Hola: ${nombre} Compuerba tu cuenta en UpTask </h1>
            <h2>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</h2>

            <a href="${process.env.FRONTEDN_URL}/confirmar/${token}">Click Aqui mi herma</a>

            <p>Si tu no creaste esta cuenta, Puedes ignorar el mensaje</p>

            <h2>Este Proyecto fue creado por @Jackson</h2>
            <p>Todos Los derechos estan reservados</p>
            <a href="https://github.com/MichaelNegrete16">Link Github</a>

          `
      })

}

export const emailForgotPassword = async (datos) =>{
  const {email,token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador De Proyectos Mamalones 4k" <noreply@uptask.com>',
    to: email,
    subject: "UpTask - Cole Pediste Cambio de contraseña",
    text:" Cambiar contraseña",
    html:` <h1>Hola, Se pidio un cambio de contraseña al correo ${email}</h1>
      <h2>Tu cambio de contraseña esta casi lista, solo debes dar click aqui:</h2>

      <a href="${process.env.FRONTEDN_URL}/olvide-password/${token}">Click Aqui mi herma</a>

      <p>Si no pediste este cambio de contraseña, Puedes ignorar el mensaje</p>

      <h2>Este Proyecto fue creado por @Jackson</h2>
      <p>Todos Los derechos estan reservados</p>
      <a href="https://github.com/MichaelNegrete16">Link Github</a>

    `
})

}