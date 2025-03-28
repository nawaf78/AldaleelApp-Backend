const supabase = require("../config/supabaseClient");

//fetch all users
const getusers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

module.exports = { getusers };
