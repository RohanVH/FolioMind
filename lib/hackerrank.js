import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { SiteContent } from "../server/src/models/SiteContent.js";
import { fetchHackerRankCertificates } from "../server/src/services/hackerRankService.js";

export const getHackerRankResponse = async (req, res) => {
  try {
    await connectDb();
    const site = await SiteContent.findOne().lean();
    const profileUrl = site?.hackerrank || "https://www.hackerrank.com/profile/rohanvaradaraju1";
    const result = await fetchHackerRankCertificates(profileUrl);

    return ok(res, {
      profileUrl,
      certificates: Array.isArray(result?.certificates) ? result.certificates : [],
      warning: result?.warning || ""
    });
  } catch (error) {
    console.error("HACKERRANK ERROR:", error);
    return ok(res, {
      profileUrl: "",
      certificates: [],
      warning: error.message || "Unable to fetch HackerRank profile"
    });
  }
};
