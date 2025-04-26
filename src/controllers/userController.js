const { supabase } = require("../config/supabaseClient");

// --- Get Profile ---
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, email, avatarUrl")
      .eq("id", userId)
      .maybeSingle();

    if (userError || !userData) {
      console.error("Fetch profile error:", userError?.message);
      return res.status(404).json({ error: "User not found" });
    }

    const { count: completedTrips, error: tripError } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (tripError) {
      console.error("Trip count error:", tripError.message);
    }

    return res.json({
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || null,
      completedTrips: completedTrips || 0,
      reviews: 0,
    });
  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// --- Update Profile ---
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, avatarUrl } = req.body;

    console.log("Updating profile for User ID:", userId, req.body);

    // perform the update
    const { data, error } = await supabase
      .from("users")
      .update({ name, avatarUrl })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating profile:", error.message);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    // Supabase sometimes returns data=null with no error; fall back to the input
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
