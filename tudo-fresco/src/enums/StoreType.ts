export enum StoreType {
  SUPPLIER = 'SUPPLIER',
  RETAILER = 'RETAILER',
  UNKNOWN = 'UNKNOWN'
}

export const storeTypeDisplayMap: Record<StoreType, string> = {
  [StoreType.SUPPLIER]: 'Produtor',
  [StoreType.RETAILER]: 'Comprador',
  [StoreType.UNKNOWN]: 'Desconhecido',
};

export function getStoreTypeDisplay(type: StoreType): string {
  return storeTypeDisplayMap[type] || 'Desconhecido';
}