export enum UnitType {
    PIECE = 'PIECE',
    GRAM = 'GRAM',
    KILOGRAM = 'KILOGRAM',
    METRIC_TON = 'METRIC_TON',
}

export const unitTypeDisplayMap: Record<UnitType, string> = {
    [UnitType.PIECE]: 'Unidade',
    [UnitType.GRAM]: 'Grama',
    [UnitType.KILOGRAM]: 'Quilograma',
    [UnitType.METRIC_TON]: 'Tonelada Métrica',
} as const;

export function getUnitTypeDisplay(type: UnitType | undefined): string {
    if (!type) {
        return 'Desconhecido';
    }
    return unitTypeDisplayMap[type] || 'Desconhecido';
}