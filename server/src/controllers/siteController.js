import { SiteContent } from "../models/SiteContent.js";
import { ensureDefaultDocuments } from "../utils/ensureDefaults.js";

export const getSiteContent = async (req, res) => {
  await ensureDefaultDocuments();
  const site = await SiteContent.findOne();
  return res.json(site);
};

export const updateSiteContent = async (req, res) => {
  await ensureDefaultDocuments();
  const site = await SiteContent.findOne();
  const updates = req.body;

  if (Array.isArray(updates.aboutSections)) {
    updates.aboutSections = updates.aboutSections
      .map((section, index) => ({
        title: String(section?.title || "").trim(),
        content: String(section?.content || "").trim(),
        order: Number(section?.order ?? index)
      }))
      .filter((section) => section.title && section.content)
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({ ...section, order: index }));
  }

  if (Array.isArray(updates.heroImages)) {
    updates.heroImages = updates.heroImages
      .map((item, index) => ({
        url: String(item?.url || "").trim(),
        publicId: String(item?.publicId || "").trim(),
        order: Number(item?.order ?? index)
      }))
      .filter((item) => item.url)
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ ...item, order: index }));
  }

  Object.assign(site, updates);
  await site.save();

  return res.json(site);
};
