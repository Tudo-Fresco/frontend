export interface AddressRequestModel {
    zip_code: string;
    street_address: string;
    latitude: number;
    longitude: number;
    province: string;
    city: string;
    neighbourhood: string;
    number: string;
    additional_info?: string;
  }
  
  export default AddressRequestModel;
  