import { Router, Request, Response } from "express";
import { getDataRepo } from "../repository/repo";

export async function startExportHandler(req: Request, res: Response) {
  try {
    const result = await getDataRepo().startExport();
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
