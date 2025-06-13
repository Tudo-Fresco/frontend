import { ProductType } from "../enums/ProductType";
import { UnitType } from "../enums/UnitType";
import { BaseResponseModel } from "./BaseResponseModel";

interface ProductResponseModel extends BaseResponseModel {
    name: string;
    unit_type: UnitType;
    type: ProductType;
    images: string[];
    search_name: string;
}

export default ProductResponseModel;