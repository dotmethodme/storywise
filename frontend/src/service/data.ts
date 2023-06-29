import axios from "axios";
import type { SessionItem, HitsPerPage, Referrer } from "./types";

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
