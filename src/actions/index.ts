import { contacto } from './contacto';
import { asesor } from './asesor';
import { matricula } from './matricula';
import { becarios } from './becarios';
import { soporte } from './soporte';
import { reclamaciones } from './reclamaciones';
import { alianzas } from './alianzas';
import { staff } from './staff';
import { reclutamientoDocente } from './reclutamientoDocente';
import { registroDocentes } from './registroDocentes';
import { fichaDatos } from './fichaDatos';
import { matriculaPortugues } from './matriculaPortugues';
import { adminActions } from './admin';

export const server = {
  ...adminActions,
  contacto,
  asesor,
  matricula,
  becarios,
  soporte,
  reclamaciones,
  alianzas,
  staff,
  reclutamientoDocente,
  registroDocentes,
  fichaDatos,
  matriculaPortugues,
};