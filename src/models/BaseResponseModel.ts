export class BaseResponseModel {
    uuid: string;
    created_at: string;
    updated_at: string;
  
    constructor(uuid: string, created_at: string, updated_at: string) {
      this.uuid = uuid;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  