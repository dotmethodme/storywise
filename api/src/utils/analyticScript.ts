import fs from "fs";
import path from "path";

const jsFile = path.join(__dirname, "../../templates/script.js");
const jsFileContent = fs.readFileSync(jsFile, "utf8");

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function getAnalyticsCode() {
  return jsFileContent.replace("{{API_BASE_URL}}", API_BASE_URL);
}
