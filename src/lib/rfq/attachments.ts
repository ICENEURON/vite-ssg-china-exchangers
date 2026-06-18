export const RFQ_ATTACHMENT_BUCKET = 'rfqs';
export const MAX_RFQ_ATTACHMENT_FILES = 5;
export const MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const RFQ_ATTACHMENT_ACCEPT = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv';

const ALLOWED_DOCUMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']);
const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv',
]);

export type RfqAttachmentValidationErrorCode = 'too_many_files' | 'file_too_large' | 'unsupported_file_type';

export interface RfqAttachmentValidationError {
  code: RfqAttachmentValidationErrorCode;
  fileName?: string;
  maxFiles?: number;
  maxFileSize?: string;
}

export interface RfqAttachmentValidationResult {
  files: File[];
  errors: RfqAttachmentValidationError[];
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.trim().toLowerCase() || '';
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAllowedRfqAttachment(file: File) {
  if (file.type.startsWith('image/')) return true;
  if (ALLOWED_DOCUMENT_MIME_TYPES.has(file.type)) return true;
  return ALLOWED_DOCUMENT_EXTENSIONS.has(getFileExtension(file.name));
}

export function mergeRfqAttachmentFiles(currentFiles: File[], incomingFiles: File[]): RfqAttachmentValidationResult {
  const errors: RfqAttachmentValidationError[] = [];
  const nextFiles = [...currentFiles];
  const existingKeys = new Set(currentFiles.map((file) => `${file.name}:${file.size}:${file.lastModified}`));

  incomingFiles.forEach((file) => {
    const fileKey = `${file.name}:${file.size}:${file.lastModified}`;

    if (existingKeys.has(fileKey)) return;

    if (nextFiles.length >= MAX_RFQ_ATTACHMENT_FILES) {
      errors.push({
        code: 'too_many_files',
        maxFiles: MAX_RFQ_ATTACHMENT_FILES,
      });
      return;
    }

    if (file.size > MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES) {
      errors.push({
        code: 'file_too_large',
        fileName: file.name,
        maxFileSize: formatFileSize(MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES),
      });
      return;
    }

    if (!isAllowedRfqAttachment(file)) {
      errors.push({
        code: 'unsupported_file_type',
        fileName: file.name,
      });
      return;
    }

    existingKeys.add(fileKey);
    nextFiles.push(file);
  });

  return {
    files: nextFiles,
    errors: errors.filter((error, index) => (
      errors.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(error)) === index
    )),
  };
}

export function sanitizeRfqAttachmentFileName(fileName: string) {
  const extension = getFileExtension(fileName);
  const baseName = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;
  const sanitizedBaseName = baseName
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s.,'!&$@=;:+?()_-]/gu, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90)
    || 'attachment';

  return extension ? `${sanitizedBaseName}.${extension}` : sanitizedBaseName;
}
