import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { ensureDemoAssignments } from "../services/demo-seed.service.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export async function mockAuth(req: Request, _res: Response, next: NextFunction) {
  const user = await UserModel.findOneAndUpdate(
    { email: "john.doe@dpsbokaro.edu" },
    {
      name: "John Doe",
      email: "john.doe@dpsbokaro.edu",
      avatarUrl: "/avatars/teacher.png",
      school: { name: "Delhi Public School", city: "Bokaro Steel City" }
    },
    { upsert: true, new: true }
  );

  req.userId = user.id;
  await ensureDemoAssignments(user.id);
  next();
}
