import { DemandStatus } from "../enums/DemandStatus";
import { BaseResponseModel } from "./BaseResponseModel";


interface DemandRequestModel extends BaseResponseModel {
    store_uuid: string;
    product_uuid: string;
    responsible_uuid?: string;
    needed_count: number;
    description: string;
    deadline: string;
    status: DemandStatus;
    minimum_count?: number;
}

export default DemandRequestModel;