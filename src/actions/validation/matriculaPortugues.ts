import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const email = z.email();
const phone = z.string().trim().min(8);
const choice = z.string().trim().min(1);

export const matriculaPortuguesSchema = z.object({
  programa: text,
  nome: text,
  documento: text,
  data_nascimento: optionalText,
  familiaridade_tecnologica: choice,
  email,
  whatsapp: phone,
  pais: text,
  area_formacao: optionalText,
  empresa: text,
  cargo: text,
  faturamento: choice,
  razao_social: text,
  numero_faturamento: text,
});