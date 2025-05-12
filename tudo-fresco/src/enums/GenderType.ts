export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export const genderTypeDisplayMap: Record<GenderType, string> = {
  [GenderType.MALE]: 'Masculino',
  [GenderType.FEMALE]: 'Feminino'
} as const;

export function getGenderTypeDisplay(gender: GenderType | undefined): string {
  if (!gender) {
    return 'Desconhecido';
  }
  return genderTypeDisplayMap[gender] || 'Desconhecido';
}