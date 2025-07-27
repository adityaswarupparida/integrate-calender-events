import { Router } from "express";
import passport from "passport";
const router = Router();

const SCOPES = [
    'openid', 
    'email', 
    'profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.readonly'
];

router.get('/',
    passport.authenticate('google', { 
        scope: SCOPES,
        accessType: "offline",
        prompt: "consent"
    }));


router.get("/callback",
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect("/home");
});

export default router;