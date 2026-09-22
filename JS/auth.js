import { sql } from './neon-config.js';

export async function registrarUsuario(nombre, correo, contrasena) {
  try {
    const resultado = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena)
      VALUES (${nombre}, ${correo}, ${contrasena})
      RETURNING id, nombre, correo;
    `;
    return { exito: true, usuario: resultado[0] };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.message && error.message.includes('unique constraint')) {
      return { exito: false, mensaje: 'El correo electrónico ya se encuentra registrado.' };
    }
    return { exito: false, mensaje: 'Error al conectar con la base de datos.' };
  }
}

export async function iniciarSesion(correo, contrasena) {
  try {
    const resultado = await sql`
      SELECT id, nombre, correo, contrasena FROM usuarios
      WHERE correo = ${correo};
    `;

    if (resultado.length === 0) {
      return { exito: false, mensaje: 'Usuario no encontrado.' };
    }

    const usuario = resultado[0];
    if (usuario.contrasena !== contrasena) {
      return { exito: false, mensaje: 'Contraseña incorrecta.' };
    }

    sessionStorage.setItem('usuario_hospital', JSON.stringify({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo
    }));

    return { exito: true, usuario };
  } catch (error) {
    console.error('Error en login:', error);
    return { exito: false, mensaje: 'Error al verificar credenciales.' };
  }
}

export function obtenerUsuarioActual() {
  const usuarioStr = sessionStorage.getItem('usuario_hospital');
  return usuarioStr ? JSON.parse(usuarioStr) : null;
}

export function cerrarSesion() {
  sessionStorage.removeItem('usuario_hospital');
  window.location.href = 'login.html';
}

export function verificarSesionProtegida() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    window.location.href = 'login.html';
  }
  return usuario;
}