import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { SiteContent } from "../server/src/models/SiteContent.js";
import { ensureDefaultDocuments } from "../server/src/utils/ensureDefaults.js";

const fallbackSite = {
  heroTitle: "FolioMind",
  heroSubtitle: "",
  heroIntro: "",
  aboutText: "",
  aboutSections: [],
  heroImages: [],
  resumeLink: "",
  resumePublicId: "",
  contactEmail: "",
  github: "",
  hackerrank: ""
};

export const getSiteResponse = async (req, res) => {
  try {
    await connectDb();
    await ensureDefaultDocuments();
    const site = await SiteContent.findOne().lean();
    return ok(res, site || fallbackSite);
  } catch (error) {
    console.error("SITE ERROR:", error);
    return ok(res, fallbackSite);
  }
};
