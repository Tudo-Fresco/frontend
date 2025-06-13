import { ProductType } from "../enums/ProductType";
import { UnitType } from "../enums/UnitType";
import { BaseResponseModel } from "./BaseResponseModel";

interface ProductRequestModel extends BaseResponseModel {
    name: string;
    unit_type: UnitType;
    type: ProductType;
    images?: string[];
}

export default ProductRequestModel;