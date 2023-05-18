import * as mongoose from "mongoose";
import { type } from "os";
import { z } from "zod";

const Schema = mongoose.Schema;

export const UserDTO = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export const LoginDTO = z.object({
  password: z.string().min(8),
  email: z.string().email(),
});

export type ILogin = z.infer<typeof LoginDTO>;

export type IUser = z.infer<typeof UserDTO>;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
