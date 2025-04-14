const { supabase } = require("../config/supabaseClient");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, email, avatarUrl")
      .eq("id", userId)
      .maybeSingle();

    console.log("Fetched userData:", userData);
    console.log("User error:", userError?.message);

    if (userError || !userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const { count: completedTrips, error: tripError } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (tripError) {
      console.error("Trip count error:", tripError.message);
    }

    res.json({
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || null,
      completedTrips: completedTrips || 0,
      reviews: 0,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProfile };
