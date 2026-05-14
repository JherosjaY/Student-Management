import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleGateProps {
    allowedRoles: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * RoleGate hides its children unless the current user has one of the allowed roles.
 */
export const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children, fallback = null }) => {
    const { hasRole, isAuthenticated } = useAuth();

    if (!isAuthenticated || !hasRole(allowedRoles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
