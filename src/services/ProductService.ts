import ProductResponseModel from "../models/ProductResponseModel";
import { ApiConnector } from "../utils/ApiConnector";

const api = new ApiConnector();

export async function create(demandData: ProductResponseModel): Promise<ProductResponseModel> {
    return await api.post<ProductResponseModel>(
        '/product',
        JSON.stringify(demandData),
        { 'Content-Type': 'application/json' }
    );
}

export async function search(name = '*', page = 1, pageSize = 30): Promise<Array<ProductResponseModel>> {
    return await api.get<Array<ProductResponseModel>>(
        `/product/search?name=${name}&page=${page}&per_page=${pageSize}`
    );
}

export async function uploadProductImage(productUuid: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post<void>(`/product/product-picture?product_uuid=${productUuid}`, formData);
}
