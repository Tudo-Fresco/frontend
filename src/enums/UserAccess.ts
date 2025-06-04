export enum UserAccess {
  ADMIN = 'ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST',
}

export const userAccessDisplayMap: Record<UserAccess, string> = {
  [UserAccess.ADMIN]: 'Administrador',
  [UserAccess.STORE_OWNER]: 'Dono da Loja',
  [UserAccess.EMPLOYEE]: 'Funcionário',
  [UserAccess.GUEST]: 'Convidado',
} as const;

export function getUserAccessDisplay(access: UserAccess | undefined): string {
  if (!access) {
    return 'Desconhecido';
  }
  return userAccessDisplayMap[access] || 'Desconhecido';
}