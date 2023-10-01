import { Request, Response } from "express";
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

export async function listDataIoHandler(req: Request, res: Response) {
  try {
    const result = await getDataRepo().listDataIo();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteDataIoHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await getDataRepo().deleteDataIo(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function downloadFileHandler(req: Request, res: Response) {
  try {
    const { file_path } = req.query;
    if (!file_path || typeof file_path !== "string") {
      return res.status(400).json({ message: "Missing file_path" });
    }

    return res.sendFile(file_path);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
