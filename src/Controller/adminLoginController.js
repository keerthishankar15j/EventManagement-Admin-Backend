const LoginActivity =
  require("../Model/LoginActivity");


const getLoginHistory = async (req, res) => {

  try {

    const loginHistory =
      await LoginActivity
        .find()
        .sort({
          loginAt: -1
        });


    res.status(200).json(
      loginHistory
    );


  } catch (error) {

    console.error(
      "GET LOGIN HISTORY ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get login history"

    });

  }

};


module.exports = {
  getLoginHistory
};