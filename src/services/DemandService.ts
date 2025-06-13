import DemandRequestModel from "../models/DemandRequestModel";
import { ApiConnector } from "../utils/ApiConnector";
import DemandResponseModel from '../models/DemandResposeModel';
import { ProductType } from "../enums/ProductType";

const api = new ApiConnector();

export async function create(demandData: DemandRequestModel): Promise<void> {
    await api.post<void>(
        '/demand',
        JSON.stringify(demandData),
        {
            'Content-Type': 'application/json',
        }
    );
}

export async function listByStore(storeUUID: string, page: number = 1, pageSize: number = 100, radiusMeters: number = 10000, productType: ProductType = ProductType.ANY): Promise<Array<DemandResponseModel>> {
    return await api.get<Array<DemandResponseModel>>(
        `/demand/list-by-store?store_uuid=${storeUUID}&page=${page}&per_page=${pageSize}&radius_meters=${radiusMeters}&product_type=${productType}`,
        {
            'Content-Type': 'application/json',
        }
    );
}