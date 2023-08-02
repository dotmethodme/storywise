import DeviceDetector from "device-detector-js";
import { uaParserToModel } from "../utils/extractEvent";

const deviceDetector = new DeviceDetector();

const countries = [
  "DK",
  "SE",
  "UK",
  "US",
  "DE",
  "FR",
  "ES",
  "IT",
  "NL",
  "NO",
  "FI",
  "PL",
  "RU",
  "CN",
  "JP",
  "IN",
  "BR",
  "CA",
  "AU",
  "NZ",
  "MX",
  "AR",
  "ZA",
  "EG",
  "NG",
  "KE",
  "ET",
  "TZ",
  "UG",
  "GH",
  "CI",
  "CM",
  "SN",
  "ZW",
  "RW",
  "MZ",
  "AO",
  "NA",
  "ZM",
  "MW",
  "MG",
  "MU",
  "SC",
  "SZ",
  "LS",
  "BW",
  "LY",
  "TN",
  "MA",
  "DZ",
  "SA",
  "AE",
  "QA",
  "OM",
  "KW",
  "BH",
  "YE",
  "IQ",
  "SY",
  "JO",
  "LB",
  "IL",
  "TR",
  "IR",
  "PK",
  "AF",
  "BD",
  "LK",
  "NP",
  "MM",
  "TH",
  "VN",
  "MY",
  "ID",
  "PH",
  "KH",
  "LA",
  "KR",
  "TW",
  "HK",
  "MO",
  "SG",
];

const languages = [
  "en-GB,en;q=0.7",
  "en-US,en;q=0.5",
  "en-CA,en;q=0.3",
  "en-IE,en;q=0.1",
  "da-DK,da;q=0.9",
  "da;q=0.7",
  "da-DK;q=0.5",
  "da-DK;q=0.3",
  "de-DE,de;q=0.9",
  "de;q=0.7",
  "de-DE;q=0.5",
  "es-ES,es;q=0.9",
  "es;q=0.7",
  "es-ES;q=0.5",
  "fr-FR,fr;q=0.9",
  "fr;q=0.7",
];
const userAgents = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 Mobile Safari/537.36",
];

const referrers = [
  "https://www.google.com/",
  "https://twitter.com/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.instagram.com/",
  "https://www.linkedin.com/",
  null,
];

const paths = [
  "/",
  "/about/",
  "/contact/",
  "/mission/",
  "/posts/",
  "/posts/why-i-love-python/",
  "/posts/why-i-love-javascript/",
  "/posts/why-i-love-rust/",
  "/posts/why-i-love-go/",
  "/posts/why-i-love-c/",
  "/posts/why-i-love-c++/",
  "/posts/why-i-love-c#/",
  "/posts/why-i-do-not-love-java/",
  "/posts/why-i-love-php/",
  "/posts/why-i-love-ruby/",
  "/posts/why-i-love-swift/",
  "/posts/why-i-love-kotlin/",
  "/posts/why-i-love-scala/",
  "/where-i-work/",
  "/where-i-work/awesome-company/",
  "/where-i-work/awesome-company/awesome-team/",
  "/where-i-work/awesome-company/awesome-team/awesome-person/",
  "/what-i-do/",
  "/what-i-do/awesome-thing/",
  "/what-i-do/awesome-thing/awesome-sub-thing/",
];

const screenSizes = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 800, height: 600 },
  { width: 640, height: 480 },
];

export function getRandomScreenSize() {
  return screenSizes[Math.floor(Math.random() * screenSizes.length)];
}

export function getRandomPath() {
  return paths[Math.floor(Math.random() * paths.length)];
}

export function getRandomReferrer() {
  return referrers[Math.floor(Math.random() * referrers.length)];
}

function generateRandomCountry() {
  return countries[Math.floor(Math.random() * countries.length)];
}

function generateRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function generateRandomLanguage() {
  return languages[Math.floor(Math.random() * languages.length)];
}

function generateRandomIP(): string {
  const ipParts = [];

  for (let i = 0; i < 4; i++) {
    const part = Math.floor(Math.random() * 256);
    ipParts.push(part);
  }

  return ipParts.join(".");
}

function generateRandomSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

export function generateUsers(numberOfVirtualUsers = 200) {
  const users = [];
  for (let i = 0; i < numberOfVirtualUsers; i++) {
    const ua = generateRandomUserAgent();
    const userAgentInfo = uaParserToModel(deviceDetector.parse(ua));
    const user = {
      country: generateRandomCountry(),
      user_agent: ua,
      ip: generateRandomIP(),
      session_id: generateRandomSessionId(),
      language: generateRandomLanguage(),
      ...userAgentInfo,
      screen_size_temp: getRandomScreenSize(),
    };
    users.push(user);
  }

  return users;
}
