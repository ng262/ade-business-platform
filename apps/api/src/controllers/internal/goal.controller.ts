/*
import {
  getGoalsService,
  updateGoalService,
} from "@/services/internal/goal.service";
import { Request, Response } from "express";

export async function getGoals(req: Request, res: Response) {
  const { cid, title } = req.query;
  const goals = await getGoalsService(cid, title);
  res.success(goals);
}

export async function updateGoal(req: Request, res: Response) {
  const goal = await updateGoalService(req.body);
  res.success(goal);
}
*/
