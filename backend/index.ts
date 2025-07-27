import express from "express";
import router from "./routes";
import session from 'express-session';
import passport from "passport";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "secret token",
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`)
});