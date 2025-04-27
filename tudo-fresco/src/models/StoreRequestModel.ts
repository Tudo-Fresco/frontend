import { StoreType } from "../enums/StoreType";

export interface StoreRequestModel {
  cnpj: string;
  trade_name: string;
  legal_name: string;
  legal_phone_contact: string;
  preferred_phone_contact: string;
  legal_email_contact: string;
  preferred_email_contact: string;
  address_uuid: string;
  store_type: StoreType;
  opening_date: string;
  size: string;
  legal_nature: string;
  cnae_code: string;
  images?: string[];
  branch_classification?: string;
}
