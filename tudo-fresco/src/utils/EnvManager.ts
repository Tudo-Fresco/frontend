export class EnvManager {
    static getEnvVariable(variableName: string, defaultValue: string = ''): string {
      const value = import.meta.env[variableName];
      return value ?? defaultValue;
    }
  }