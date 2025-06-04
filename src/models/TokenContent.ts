import { UserAccess } from "../enums/UserAccess";

export interface TokenContent {
    sub: string;
    role: UserAccess;
    exp: string;
}