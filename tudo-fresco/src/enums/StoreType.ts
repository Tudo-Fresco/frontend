export enum StoreType {
  SUPPLIER = 'SUPPLIER',
  RETAILER = 'RETAILER'
}

export const storeTypeDisplayMap: Record<StoreType, string> = {
  [StoreType.SUPPLIER]: 'Produtor',
  [StoreType.RETAILER]: 'Comprador'
};

export function getStoreTypeDisplay(type: StoreType): string {
  return storeTypeDisplayMap[type] || 'Desconhecido';
}