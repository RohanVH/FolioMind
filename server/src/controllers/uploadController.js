import { deleteUploadedAsset, uploadBuffer, uploadImageBuffer } from "../services/uploadService.js";

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const result = await uploadImageBuffer(req.file.buffer, "foliomind/projects");
  return res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id
  });
};

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  const result = await uploadBuffer({
    buffer: req.file.buffer,
    folder: "foliomind/resume",
    resourceType: "raw"
  });

  return res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id
  });
};

export const deleteResumeFile = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ message: "publicId is required" });
  }

  const result = await deleteUploadedAsset({
    publicId,
    resourceType: "raw"
  });

  return res.json({ result: result.result || "ok" });
};
