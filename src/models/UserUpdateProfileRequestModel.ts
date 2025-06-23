import { GenderType } from "../enums/GenderType";

export interface UserUpdateProfileRequestModel {
    uuid: string;
    name: string;
    email: string;
    date_of_birth: string;
    gender: GenderType;
    phone_number: string;
    password?: string;
    current_password?: string;
  }
  