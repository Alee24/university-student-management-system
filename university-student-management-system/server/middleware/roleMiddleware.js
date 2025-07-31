/**
 * Role-based access control middleware.  Verifies that the authenticated
 * user has the required role before allowing access to the route.  If the
 * user's role does not match one of the allowed roles, a 403 error is
 * returned.
 *
 * Usage: router.get('/admin-route', authenticate, authorize('admin'), handler);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ message: 'No role information' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    return next();
  };
}

module.exports = authorize;