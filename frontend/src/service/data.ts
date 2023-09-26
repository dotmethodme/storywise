import axios from "axios";
import type {
  SessionItem,
  CountHitsPerPage,
  CountByReferrer,
  Stats,
  SiteConfig,
  CountByCountry,
  UserAgentQueryKeys,
  CountByKeyValue,
} from "@shared/types";
import type { App } from "@shared/app";

export async function getSessions(days = 30) {
  const res = await axios.get<SessionItem[]>(`/admin/api/sessions_per_day?days=${days}`);
  return res.data;
}

export async function getUniqueSessionsPerPage(days = 30) {
  const url = `/admin/api/unique_sessions_per_page?days=${days}`;
  const res = await axios.get<CountHitsPerPage[]>(url);
  return res.data;
}

export async function getHitsPerPage(days = 30) {
  const url = `/admin/api/hits_per_page?days=${days}`;
  const res = await axios.get<CountHitsPerPage[]>(url);
  return res.data;
}

export async function getTopReferrers(days = 30) {
  const url = `/admin/api/top_referrers?days=${days}`;
  const res = await axios.get<CountByReferrer[]>(url);
  return res.data;
}

export async function getUniqueVisitorsByCountry(days = 30) {
  const url = `/admin/api/unique_sessions_by_country?days=${days}`;
  const res = await axios.get<CountByCountry[]>(url);
  return res.data;
}

export async function getStats(days = 30) {
  const url = `/admin/api/stats?days=${days}`;
  const res = await axios.get<Stats>(url);
  return res.data;
}

export async function getSessionCountByUserAgent(key: UserAgentQueryKeys, days = 30) {
  const url = `/admin/api/count_sessions_by_user_agent?days=${days}&key=${key}`;
  const res = await axios.get<CountByKeyValue[]>(url);
  return res.data;
}

export async function getSiteConfig() {
  const res = await axios.get<SiteConfig>(`/admin/api/config`);
  return res.data;
}

export async function getApps() {
  const res = await axios.get<App[]>(`/admin/api/apps`);
  return res.data;
}

export async function createApp(name: string) {
  await axios.post(`/admin/api/apps`, { name });
}

export async function updateApp(id: number, name: string) {
  await axios.put(`/admin/api/apps`, { id, name });
}

export async function deleteApp(id: number) {
  await axios.delete(`/admin/api/apps`, { data: { id } });
}
