const generateToken = require("../utils/generate-token");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Direct check
    if (email.toLowerCase() === "jeevithalayam@gmail.com" &&
      password === "oldage123"
    ) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken({ role: "admin" })
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};
