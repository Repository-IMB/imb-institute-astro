// Importamos la configuración de Zod (Traducciones al español)
import './utils';

import { contactoActions } from './contacto';
import { institucionalActions } from './institucional';
import { academicoActions } from './academico';
import { adminActions } from './admin';

export const server = {
  ...contactoActions,
  ...institucionalActions,
  ...academicoActions,
  ...adminActions,
};
