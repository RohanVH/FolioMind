import cloudinary from "../config/cloudinary.js";

export const uploadBuffer = ({
  buffer,
  folder = "foliomind",
  resourceType = "auto",
  format
}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });

export const uploadImageBuffer = (buffer, folder = "foliomind") =>
  uploadBuffer({
    buffer,
    folder,
    resourceType: "image"
  });

export const deleteUploadedAsset = async ({ publicId, resourceType = "raw" }) => {
  if (!publicId) {
    return { result: "not_found" };
  }
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
