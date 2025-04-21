export enum GenderType {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NOT_APPLICABLE = 'NOT_APPLICABLE',
    NOT_KNOWN = 'NOT_KNOWN'
  }
  
  export enum UserAccess {
    ADMIN = 'ADMIN',
    GUEST = 'STORE_OWNER'
  }
  
  export interface UserRequestModel {
    name: string;
    email: string;
    date_of_birth: string;
    gender: GenderType;
    phone_number: string;
    profile_picture: string;
    password: string;
    user_access: UserAccess;
  }
  