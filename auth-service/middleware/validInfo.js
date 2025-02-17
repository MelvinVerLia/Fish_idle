module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log("hi");

  if (req.path === "/register") {
    if (!name) {
      return res.status(400).json({ error: "Missing username" });
    }
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }
  } else if (req.path === "/login") {
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }
  }
  next();
};
