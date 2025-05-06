const { supabase } = require("../config/supabaseClient");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, email, avatarUrl, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (userError || !userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const { count: completedTrips, error: tripError } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (tripError) console.error("Trip count error:", tripError.message);

    res.json({
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || null,
      joinedAt: userData.created_at, 
      completedTrips: completedTrips || 0,
      reviews: 0,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, avatarUrl } = req.body;

    console.log("Updating profile for User ID:", userId, req.body);

    const { data, error } = await supabase
      .from("users")
      .update({ name, avatarUrl })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating profile:", error.message);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    const updated = {
      name: data?.name ?? name,
      avatarUrl: data?.avatarUrl ?? avatarUrl,
    };

    return res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getProfile, updateProfile };
