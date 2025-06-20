const {
  supabase,
  getAuthenticatedClient,
} = require("../config/supabaseClient");

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "All fields (email, password, name) are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup error (Supabase Auth):", error.message);
      return res.status(400).json({ error: error.message });
    }

    const { user } = data;
    if (!user) {
      return res
        .status(400)
        .json({ error: "Signup failed. User not created." });
    }

    const { error: dbError } = await supabase.from("users").insert([
      { id: user.id, email: user.email, name },
    ]);

    if (dbError) {
      console.error("Signup error (Database Insert):", dbError.message);
      return res.status(400).json({ error: dbError.message });
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: { id: user.id, email: user.email, name },
    });
  } catch (err) {
    console.error("Signup error (Server):", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error (Supabase Auth):", error.message);
      return res.status(400).json({ error: error.message });
    }

    const { user, session } = data;
    if (!user || !session) {
      return res
        .status(400)
        .json({ error: "Login failed. Invalid credentials." });
    }

    if (!user.email_confirmed_at) {
      return res.status(400).json({
        error: "Email not confirmed. Please verify your email first.",
      });
    }

    const authenticatedSupabase = getAuthenticatedClient(session.access_token);
    const { data: userData, error: userError } = await authenticatedSupabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Login error (Fetching user data):", userError.message);
      return res.status(400).json({ error: "User data not found" });
    }

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: userData.name },
      token: session.access_token,
    });
  } catch (err) {
    console.error("Login error (Server):", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login };
