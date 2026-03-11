import { SiteContent } from "../models/SiteContent.js";
import { ThemeSettings } from "../models/ThemeSettings.js";

export const ensureDefaultDocuments = async () => {
  const site = await SiteContent.findOne();
  if (!site) {
    await SiteContent.create({});
  }

  const theme = await ThemeSettings.findOne();
  if (!theme) {
    await ThemeSettings.create({});
  }
};

