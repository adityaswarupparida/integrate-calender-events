import { Router } from "express";
import passport from "passport";
import { Strategy } from 'passport-google-oauth20';
import authRouter from "./auth";
import eventRouter from "./events";
import type { SessionUser } from "../types";
import { TokenManager } from "../services/TokenManager";

const router = Router();
const BACKEND_URL = process.env.BACKEND_URL;

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${BACKEND_URL}/auth/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    const tokens = new TokenManager(profile.id);
    (async () => {
        await tokens.saveTokens(accessToken, refreshToken);
    })()
    const user: SessionUser = {
        profile
    }
    return done(null, user)
  }
));

passport.serializeUser((user, done) => {
    return done(null, user)
});

passport.deserializeUser((user, done) => {
    return done(null, user as Express.User)
});

router.use("/auth", authRouter);
router.use("/events", eventRouter);

router.get("/home", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    }
    res.send("Hey there");
});

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

router.get("/", (req, res) => {
    res.send("<a href='/auth'>Sign in with Google</a>");
    // res.redirect("/auth");
});

export default router;