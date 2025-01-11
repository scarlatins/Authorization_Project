module.exports = (requiredRole) => {
    return (req, res, next) => { 
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Доступ запрещен. Недостаточно разрешений.' });
      }
      next(); // проверка роли -> управление переход след. middleware
    };
  };
  