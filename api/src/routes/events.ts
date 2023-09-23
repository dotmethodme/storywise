import { Request, Response } from "express";
import { getDataRepo } from "../repository/repo";
import { EventCreateRequest } from "../types/models";
import { extractEvent } from "../utils/extractEvent";

export async function createEventHandler(req: Request<{}, {}, EventCreateRequest>, res: Response) {
  try {
    const event = extractEvent(req);
    await getDataRepo().createEvent(event);
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEventHandler(req: Request, res: Response) {
  try {
    const event = extractEvent(req);
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
