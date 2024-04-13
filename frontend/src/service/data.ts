import { Admin } from "@/generated/Admin";
import axios from "axios";

export async function createApp(name: string) {
  await axios.post(`/admin/api/apps`, { name });
}

export async function updateApp(id: string, name: string) {
  await axios.put(`/admin/api/apps`, { id, name });
}

export async function deleteApp(id: string) {
  await axios.delete(`/admin/api/apps`, { data: { id } });
}

export async function startExport() {
  await axios.get(`/admin/api/export/start`);
}

export async function listDataIo() {
  const res = await axios.get(`/admin/api/data_io/list`);
  return res.data;
}

export async function deleteDataIo(id: string) {
  await axios.delete(`/admin/api/data_io/${id}`);
}

export const generatedApi = new Admin({});
