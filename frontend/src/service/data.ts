import axios from "axios";
import type {
  SessionItem,
  HitsPerPage,
  Referrer,
  Stats,
  SiteConfig,
  Country,
} from "@shared/types";

export async function getSessions(days = 30) {
  const res = await axios.get<SessionItem[]>(
    `/admin/api/sessions_per_day?days=${days}`
  );
  return res.data;
}

export async function getUniqueSessionsPerPage(days = 30) {
  const url = `/admin/api/unique_sessions_per_page?days=${days}`;
  const res = await axios.get<HitsPerPage[]>(url);
  return res.data;
}

export async function getHitsPerPage(days = 30) {
  const url = `/admin/api/hits_per_page?days=${days}`;
  const res = await axios.get<HitsPerPage[]>(url);
  return res.data;
}

export async function getTopReferrers(days = 30) {
  const url = `/admin/api/top_referrers?days=${days}`;
  const res = await axios.get<Referrer[]>(url);
  return res.data;
}

export async function getUniqueVisitorsByCountry(days = 30) {
  const url = `/admin/api/unique_sessions_by_country?days=${days}`;
  const res = await axios.get<Country[]>(url);
  return res.data;
}

export async function getStats(days = 30) {
  const url = `/admin/api/stats?days=${days}`;
  const res = await axios.get<Stats>(url);
  return res.data;
}

export async function getSiteConfig() {
  const res = await axios.get<SiteConfig>(`/admin/api/config`);
  return res.data;
}
