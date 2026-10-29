import { ApiService } from '../services/apiService';
import { AuditLog } from '../types/auditLog';

export class AuditLogRepository {
  private _apiService = new ApiService();

  async findAuditLogs(): Promise<AuditLog[]> {
    const res = await this._apiService.get<AuditLog[]>('/api/v1/audit-logs');
    if (res.statusCode === 200 && Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error((res.data as any)?.message || res.reasonPhrase || 'Failed to fetch audit logs');
  }
}
