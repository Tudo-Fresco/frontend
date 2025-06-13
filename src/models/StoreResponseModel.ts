import { StoreType } from "../enums/StoreType";
import AddressResponseModel from "./AddressResponseModel";
import { BaseResponseModel } from "./BaseResponseModel";
import { UserResponseModel } from "./UserResponseModel";


export class StoreResponseModel extends BaseResponseModel {
  images?: string[];
  cnpj?: string;
  address?: AddressResponseModel;
  reputation?: number;
  trade_name?: string;
  legal_name?: string;
  owner?: UserResponseModel;
  legal_phone_contact?: string;
  preferred_phone_contact?: string;
  legal_email_contact?: string;
  preferred_email_contact?: string;
  store_type: StoreType = StoreType.SUPPLIER;
  opening_date?: Date;
  size?: string;
  legal_nature?: string;
  cnae_code?: string;
  branch_classification?: string;
}
