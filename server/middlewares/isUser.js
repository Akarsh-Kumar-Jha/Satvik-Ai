exports.isUser = (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "User Not Authorized",
      });
    }

    if (role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Cannot Be Accessed Only For Users",
      });
    }
    next();
  } catch (error) {
    console.error("User Identification Failed!", error.message);
    return res.status(500).json({
      success: false,
      message: "User Identification Failed",
      error: error.message,
    });
  }
};
