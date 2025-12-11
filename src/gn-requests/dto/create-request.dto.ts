// src/gn-requests/dto/create-request.dto.ts
export class CreateRequestDto {
  userId: number;
  gnId: number;
  requestDate: string;
  requestType: string;
  description: string;
  status?: string;
}