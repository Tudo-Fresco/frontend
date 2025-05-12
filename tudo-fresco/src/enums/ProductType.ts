export enum ProductType {
    BEEF = 'BEEF',
    WHITE_MEAT = 'WHITE_MEAT',
    SEAWEED = 'SEAWEED',
    SPICE = 'SPICE',
    SEAFOOD = 'SEAFOOD',
    PROCESSED_MEAT = 'PROCESSED_MEAT',
    PRESERVED_MEAT = 'PRESERVED_MEAT',
    PRESERVED_PRODUCT = 'PRESERVED_PRODUCT',
    PORK = 'PORK',
    ROOT_VEGETABLE = 'ROOT_VEGETABLE',
    NUT = 'NUT',
    MUSHROOM = 'MUSHROOM',
    VEGETABLE = 'VEGETABLE',
    HERB = 'HERB',
    GRAIN = 'GRAIN',
    FRUIT = 'FRUIT',
    EGG = 'EGG',
    DAIRY = 'DAIRY',
}

export const productTypeDisplayMap: Record<ProductType, string> = {
    [ProductType.BEEF]: 'Carne Bovina',
    [ProductType.WHITE_MEAT]: 'Carne Branca',
    [ProductType.SEAWEED]: 'Alga',
    [ProductType.SPICE]: 'Especiaria',
    [ProductType.SEAFOOD]: 'Frutos do Mar',
    [ProductType.PROCESSED_MEAT]: 'Carne Processada',
    [ProductType.PRESERVED_MEAT]: 'Carne Conservada',
    [ProductType.PRESERVED_PRODUCT]: 'Produto Conservado',
    [ProductType.PORK]: 'Carne Suína',
    [ProductType.ROOT_VEGETABLE]: 'Legume Raiz',
    [ProductType.NUT]: 'Noz',
    [ProductType.MUSHROOM]: 'Cogumelo',
    [ProductType.VEGETABLE]: 'Vegetal',
    [ProductType.HERB]: 'Erva',
    [ProductType.GRAIN]: 'Grão',
    [ProductType.FRUIT]: 'Fruta',
    [ProductType.EGG]: 'Ovo',
    [ProductType.DAIRY]: 'Laticínio',
} as const;

export function getProductTypeDisplay(type: ProductType | undefined): string {
    if (!type) {
        return 'Desconhecido';
    }
    return productTypeDisplayMap[type] || 'Desconhecido';
}