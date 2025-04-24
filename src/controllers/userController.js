const { supabase } = require("../config/supabaseClient");

// --- Get Profile ---
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

// --- Update Profile ---
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, avatarUrl } = req.body;

    console.log("Updating profile for User ID:", userId);
    console.log("Data received:", req.body);

    const { data, error } = await supabase
      .from("users")
      .update({ name, email, avatarUrl })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating profile:", error.message);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProfile, updateProfile };
