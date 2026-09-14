router.get(
  "/getusers",
  async (req, res) => {
    try {

      const users =
        await User.find()
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });

    } catch (error) {

      console.error(
        "GET USERS ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: error.message,
        users: [],
      });

    }
  }
);