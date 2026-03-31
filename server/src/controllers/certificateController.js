import { Certificate } from "../models/Certificate.js";

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ visible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return res.json(certificates);
  } catch (error) {
    console.error("Error fetching public certificates:", error);
    return res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

export const getAllCertificates = async (req, res) => {
  // For admin panel - includes hidden certificates
  try {
    const certificates = await Certificate.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return res.json(certificates);
  } catch (error) {
    console.error("Error fetching all certificates:", error);
    return res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, skill, certificate_link, image, date } = req.body;

    if (!title?.trim() || !skill?.trim() || !certificate_link?.trim()) {
      return res.status(400).json({
        message: "Title, skill, and certificate link are required"
      });
    }

    // Validate URL format
    if (!certificate_link.trim().startsWith("http")) {
      return res.status(400).json({
        message: "Certificate link must be a valid URL (starting with http/https)"
      });
    }

    // Get the highest order number
    const highestOrder = await Certificate.findOne()
      .sort({ order: -1 })
      .lean();
    const newOrder = (highestOrder?.order || 0) + 1;

    const certificate = new Certificate({
      title: title.trim(),
      skill: skill.trim(),
      certificate_link: certificate_link.trim(),
      image: image?.trim() || null,
      date: date ? new Date(date) : null,
      order: newOrder
    });

    await certificate.save();
    return res.status(201).json(certificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ message: "Failed to create certificate" });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, skill, certificate_link, image, date, visible, order } = req.body;

    if (!title || !skill || !certificate_link) {
      return res.status(400).json({
        message: "Title, skill, and certificate link are required"
      });
    }

    const updateData = {
      title: title.trim(),
      skill: skill.trim(),
      certificate_link: certificate_link.trim(),
      image: image?.trim() || null,
      date: date ? new Date(date) : null
    };

    if (visible !== undefined) {
      updateData.visible = visible;
    }

    if (order !== undefined) {
      updateData.order = order;
    }

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    return res.json(certificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    return res.status(500).json({ message: "Failed to update certificate" });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    return res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return res.status(500).json({ message: "Failed to delete certificate" });
  }
};

export const reorderCertificates = async (req, res) => {
  try {
    const { certificates } = req.body;

    if (!Array.isArray(certificates)) {
      return res.status(400).json({ message: "Certificates array is required" });
    }

    // Update order for all certificates
    const updates = await Promise.all(
      certificates.map((cert, index) =>
        Certificate.findByIdAndUpdate(
          cert.id,
          { order: index },
          { new: true }
        )
      )
    );

    return res.json(updates);
  } catch (error) {
    console.error("Error reordering certificates:", error);
    return res.status(500).json({ message: "Failed to reorder certificates" });
  }
};
