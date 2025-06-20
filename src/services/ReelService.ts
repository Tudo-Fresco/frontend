import { ApiConnector } from "../utils/ApiConnector";
import DemandResponseModel from '../models/DemandResposeModel';
import { ProductType } from "../enums/ProductType";
import { DemandStatus } from "../enums/DemandStatus";
import PostResponseModel from "../models/PostResponseModel";

const api = new ApiConnector();


export async function getPosts(storeUUID: string, page: number = 1, pageSize: number = 100, radiusMeters: number = 10000, productType: ProductType = ProductType.ANY, demandStatus: DemandStatus = DemandStatus.ANY): Promise<Array<DemandResponseModel>> {
    return await api.get<Array<PostResponseModel>>(
        `/reel/posts?store_uuid=${storeUUID}&page=${page}&per_page=${pageSize}&radius_meters=${radiusMeters}&product_type=${productType}&status=${demandStatus}`,
        {
            'Content-Type': 'application/json',
        }
    );
}