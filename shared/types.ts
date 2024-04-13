export type DataIo = {
  id: string;
  type: string;
  status: string;
  file_path?: string;
  created_at: Date;
  updated_at: Date;
  data: any;
};
