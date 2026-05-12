export const logAuditEvent = async (tx, data) => {
    return tx.auditEvent.create({
        data
    });
};
