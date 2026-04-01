import fs from "node:fs/promises";
import { formidable } from "formidable";

const normalizeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );

export const parseMultipartForm = async (req, fileFieldName) => {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFiles: 1,
    allowEmptyFiles: false
  });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (error, parsedFields, parsedFiles) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields: parsedFields, files: parsedFiles });
    });
  });

  const rawFile = files[fileFieldName];
  const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

  return {
    fields: normalizeFields(fields),
    file: file
      ? {
          buffer: await fs.readFile(file.filepath),
          originalname: file.originalFilename || file.newFilename || fileFieldName,
          mimetype: file.mimetype || "application/octet-stream"
        }
      : null
  };
};
