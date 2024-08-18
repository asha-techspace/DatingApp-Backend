export const loginSuccess = async (req, res) => {
    if (req.user) {
      res.status(200).json({ message: "User Logged In", user: req.user });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  };
  
  export const handleGoogleCallback = (req, res) => {
    const { user, token } = req.authData;
  
    if (!user) {
      return res.redirect("http://localhost:5173/login");
    }
  
    if (user.isVerified) {
      return res.redirect(`http://localhost:5173/home`);
    } else {
      return res.redirect(`http://localhost:5173/service?token=${token}`);
    }
  };
  
  export const handleLogout = (req, res) => {
    res.redirect("http://localhost:5173");
  };
  

  