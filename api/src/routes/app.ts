import { Request, Response } from "express";
import { getDataRepo } from "../repository/repo";

export async function list(req: Request, res: Response) {
  try {
    const result = await getDataRepo().listApps();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;
    await getDataRepo().createApp(name);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id, name } = req.body;
    await getDataRepo().updateApp(id, name);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.body;
    await getDataRepo().deleteApp(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
