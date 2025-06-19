export enum DemandStatus {
    OPENED = 'OPENED',
    CLOSED = 'CLOSED',
    CANCELED = 'CANCELED',
    ANY = 'ANY'
}

export const demandStatusDisplayMap: Record<DemandStatus, string> = {
    [DemandStatus.OPENED]: 'Aberto',
    [DemandStatus.CLOSED]: 'Fechado',
    [DemandStatus.CANCELED]: 'Cancelado',
    [DemandStatus.ANY]: 'Não informado',
} as const;

export function getDemandStatusDisplay(status: DemandStatus | undefined): string {
    if (!status) {
        return 'Desconhecido';
    }
    return demandStatusDisplayMap[status] || 'Desconhecido';
}