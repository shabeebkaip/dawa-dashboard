import { SessionOptions } from "iron-session";

export interface UserData {
  _id: string;
  name: string;
  username: string;
  adminPanelAccess: boolean;
  active: boolean;
  author: boolean;
  featured: boolean;
  subjectCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SessionData {
  user?: UserData;
  token?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "dawa-admin-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  },
};
