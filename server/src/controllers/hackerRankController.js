import { SiteContent } from "../models/SiteContent.js";
import { fetchHackerRankCertificates } from "../services/hackerRankService.js";

export const getHackerRankProfile = async (req, res) => {
  const site = await SiteContent.findOne();
  const profileUrl = site?.hackerrank || "https://www.hackerrank.com/profile/rohanvaradaraju1";

  const result = await fetchHackerRankCertificates(profileUrl);

  return res.json({
    profileUrl,
    certificates: result.certificates || [],
    warning: result.warning || ""
  });
};
