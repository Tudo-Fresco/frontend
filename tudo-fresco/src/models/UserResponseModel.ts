import { GenderType } from '../enums/GenderType';
import { UserAccess } from '../enums/UserAccess';
import { UserVerificationStatus } from '../enums/UserVerificationStatus';
import { BaseResponseModel } from './BaseResponseModel';

export class UserResponseModel extends BaseResponseModel {
  name: string;
  email: string;
  date_of_birth: Date;
  gender: GenderType;
  phone_number: string;
  profile_picture: string;
  user_access: UserAccess;
  verification_status: UserVerificationStatus;
  constructor(
    name: string,
    email: string,
    date_of_birth: Date,
    gender: GenderType,
    phone_number: string,
    profile_picture: string,
    user_access: UserAccess,
    verification_status: UserVerificationStatus
  ) {
    super();
    this.name = name;
    this.email = email;
    this.date_of_birth = date_of_birth;
    this.gender = gender;
    this.phone_number = phone_number;
    this.profile_picture = profile_picture;
    this.user_access = user_access;
    this.verification_status = verification_status;
  }
}
