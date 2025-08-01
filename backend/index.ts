import express from "express";
import router from "./routes";
import session from 'express-session';
import passport from "passport";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || "secret token",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, 
        sameSite: 'none',
        httpOnly: true
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`)
});