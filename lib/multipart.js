import { Writable } from "node:stream";
import { formidable } from "formidable";

const normalizeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );

export const parseMultipartForm = async (req, fileFieldName) => {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    allowEmptyFiles: false,
    fileWriteStreamHandler: () => {
      const chunks = [];
      const stream = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(Buffer.from(chunk));
          callback();
        }
      });
      stream._chunks = chunks;
      return stream;
    }
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
  const chunks = file?._writeStream?._chunks || [];

  return {
    fields: normalizeFields(fields),
    file: file
      ? {
          buffer: Buffer.concat(chunks),
          originalname: file.originalFilename || file.newFilename || fileFieldName,
          mimetype: file.mimetype || "application/octet-stream"
        }
      : null
  };
};
