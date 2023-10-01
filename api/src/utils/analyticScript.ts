import fs from "fs";
import path from "path";
import { config } from "./config";

const jsFile = path.join(__dirname, "../../templates/script.js");
const jsFileContent = fs.readFileSync(jsFile, "utf8");

export async function getAnalyticsCode(appId = "default") {
  return jsFileContent.replace("{{API_BASE_URL}}", config.API_BASE_URL).replace("{{APP_ID}}", appId);
}
