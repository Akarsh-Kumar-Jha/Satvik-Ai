exports.isNutritionist  = (req, res, next) => {
  try {
    const { role } = req.user;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Nutritionist Not Authorized",
      });a
    }

    if (role !== "Nutritionist") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Only for Nutritionists",
      });
    }

    next();
  } catch (error) {
    console.error("Nutritionist Identification Failed!", error.message);
    return res.status(500).json({
      success: false,
      message: "Nutritionist Identification Failed",
      error: error.message,
    });
  }
};
