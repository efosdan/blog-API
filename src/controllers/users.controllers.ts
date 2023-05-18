import { Request, Response } from "express";
import UserService from "../services/user";

class UserController {
  async create(req: Request, res: Response, next: any) {
    try {
      const service = new UserService();
      const user = await service.create(req.sanitizedData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: any) {
    try {
      const service = new UserService();
      const user = await service.login(req.sanitizedData);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
