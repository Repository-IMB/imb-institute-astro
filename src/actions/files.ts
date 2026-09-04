import { ActionError } from 'astro:actions';

export interface FileRule {
  field: string;
  required?: boolean;
  extensions: string[];
  maxFiles?: number;
  maxFileSizeMB?: number;
  maxTotalSizeMB?: number;
  encodeAttachments?: boolean;
}

export interface FileAttachment {
  name: string;
  content: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function readFormFiles(
  formData: FormData,
  rule: FileRule,
): Promise<{ files: File[]; metadata: FileMetadata[]; attachments: FileAttachment[] }> {
  const files = formData
    .getAll(rule.field)
    .filter((value): value is File => value instanceof File && value.name.length > 0 && value.size > 0);

  if (rule.required && files.length === 0) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: 'Adjunta el archivo obligatorio antes de enviar el formulario.',
    });
  }

  const maxFiles = rule.maxFiles ?? 1;
  if (files.length > maxFiles) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `Puedes adjuntar un máximo de ${maxFiles} archivos.`,
    });
  }

  const maxFileSize = (rule.maxFileSizeMB ?? 5) * 1024 * 1024;
  const maxTotalSize = rule.maxTotalSizeMB ? rule.maxTotalSizeMB * 1024 * 1024 : undefined;
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  if (maxTotalSize && totalSize > maxTotalSize) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `El peso total de los archivos supera el máximo de ${rule.maxTotalSizeMB} MB.`,
    });
  }

  const metadata: FileMetadata[] = [];
  const attachments: FileAttachment[] = [];

  for (const file of files) {
    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!rule.extensions.includes(extension)) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `El archivo “${file.name}” no tiene un formato permitido.`,
      });
    }
    if (file.size > maxFileSize) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `El archivo “${file.name}” supera el máximo de ${rule.maxFileSizeMB ?? 5} MB.`,
      });
    }

    metadata.push({ name: file.name, size: file.size, type: file.type });
    if (rule.encodeAttachments !== false) {
      attachments.push({ name: file.name, content: arrayBufferToBase64(await file.arrayBuffer()) });
    }
  }

  return { files, metadata, attachments };
}
