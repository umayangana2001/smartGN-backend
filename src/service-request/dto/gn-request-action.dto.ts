import { RequestStatus } from "@prisma/client";

export class GnRequestActionDto {
  action: RequestStatus;
  remarks?: string;
}