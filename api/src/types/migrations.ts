export type Migration = {
  name: string;
  timestamp: Date;
  status: "success" | "failed";
};
