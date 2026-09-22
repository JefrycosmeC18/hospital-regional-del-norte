import { sql } from './neon-config.js';

export async function guardarRegistro(datos) {
  // Genera un código único de seguimiento tipo COD-87654321
  const codigo = 'COD-' + Date.now().toString().slice(-8);

  await sql`
    INSERT INTO citas_medicas (
      codigo_seguimiento,
      nombre_paciente,
      dni,
      especialidad,
      fecha_preferida
    ) VALUES (
      ${codigo},
      ${datos.nombre},
      ${datos.dni},
      ${datos.especialidad},
      ${datos.fecha_preferida}
    );
  `;

  return codigo;
}