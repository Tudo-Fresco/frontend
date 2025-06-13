import ProductResponseModel from "../models/ProductResponseModel";
import { ApiConnector } from "../utils/ApiConnector";

const api = new ApiConnector();

export async function create(demandData: ProductResponseModel): Promise<void> {
    await api.post<void>(
        '/product',
        JSON.stringify(demandData),
        {
            'Content-Type': 'application/json',
        }
    );
}

export async function search(name: string = '*', page: number = 1, pageSize: number = 30): Promise<Array<ProductResponseModel>> {
    return await api.get<Array<ProductResponseModel>>(
        `/product/search?name=${name}&page=${page}&per_page=${pageSize}`,
        {
            'Content-Type': 'application/json'
        }
    );
}