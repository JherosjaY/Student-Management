import { prisma } from '../../db/prisma.js';

export const logAuditEvent = async (tx: any, data: {
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  diff?: any;
}) => {
  return tx.auditEvent.create({
    data
  });
};
