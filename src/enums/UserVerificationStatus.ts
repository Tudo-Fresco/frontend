export enum UserVerificationStatus {
    PENDING = 'PENDING',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    EMAIL_AND_PHONE = 'EMAIL_AND_PHONE',
  }
  
  export const userVerificationStatusDisplayMap: Record<UserVerificationStatus, string> = {
    [UserVerificationStatus.PENDING]: 'Pendente',
    [UserVerificationStatus.EMAIL]: 'E-mail Verificado',
    [UserVerificationStatus.PHONE]: 'Telefone Verificado',
    [UserVerificationStatus.EMAIL_AND_PHONE]: 'E-mail e Telefone Verificados',
  } as const;
  
  export function getUserVerificationStatusDisplay(status: UserVerificationStatus | undefined): string {
    if (!status) {
      return 'Desconhecido';
    }
    return userVerificationStatusDisplayMap[status] || 'Desconhecido';
  }