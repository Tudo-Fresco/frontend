import { DemandStatus } from "../enums/DemandStatus";
import { BaseResponseModel } from "./BaseResponseModel";
import ProductResponseModel from "./ProductResponseModel";
import { StoreResponseModel } from "./StoreResponseModel";
import { UserResponseModel } from "./UserResponseModel";

interface PostResponseModel extends BaseResponseModel {
    store: StoreResponseModel;
    product: ProductResponseModel;
    responsible: UserResponseModel;
    needed_count: number;
    description: string;
    deadline: string;
    status: DemandStatus;
    minimum_count: number;
}

export default PostResponseModel;