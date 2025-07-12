// Admin configuration for ReWear platform
export const ADMIN_CONFIG = {
  credentials: {
    username: "admin",
    password: "rewear2025",
  },
  permissions: {
    canApproveItems: true,
    canManageUsers: true,
    canViewReports: true,
    canDeleteItems: true,
    canBanUsers: true,
  },
  settings: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    maxLoginAttempts: 3,
    requirePasswordChange: false,
  },
};

// Admin validation function
export const validateAdminCredentials = (username, password) => {
  return (
    username === ADMIN_CONFIG.credentials.username &&
    password === ADMIN_CONFIG.credentials.password
  );
};

// Check admin permissions
export const hasAdminPermission = (permission) => {
  return ADMIN_CONFIG.permissions[permission] || false;
};
