const {User} = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 10);

    const [allUsers, recentUsers] = await Promise.all([
      User.find(),
      User.find({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    res.status(200).json({
      success: true,
      totalUsers: allUsers.length,
      recentUsersCount: recentUsers.length,
      data: {
        allUsers,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
