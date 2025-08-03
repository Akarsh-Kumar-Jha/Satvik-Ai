exports.isAdmin = (req, res, next) => {
  try {
    const { role } = req.user;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Admin Not Authorized",
      });a
    }

    if (role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot Be Accessed Only For Admin",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Identification Failed!", error.message);
    return res.status(500).json({
      success: false,
      message: "Admin Identification Failed",
      error: error.message,
    });
  }
};
