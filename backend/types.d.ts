import type { Profile } from "passport-google-oauth20";

export interface SessionUser extends Express.User {
    profile:     Profile;
}