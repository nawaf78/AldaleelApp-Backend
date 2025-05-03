const express = require("express");
const router = express.Router();
const { supabase } = require("../config/supabaseClient");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const {
      data: trips,
      error,
      count,
    } = await supabase
      .from("trips")
      .select("*", { count: "exact" })
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      status: "success",
      data: {
        trips: trips || [],
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    });
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("[tripRoutes] Received trip creation request:", req.body);

    // Validate the itinerary data from MCP
    if (!req.body.itinerary) {
      throw new Error("Missing itinerary data");
    }

    const tripData = {
      user_id: "temp_user_id",
      destination: req.body.destination,
      destination_country: req.body.destinationCountry,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      display_destination: req.body.displayDestination,
      year: req.body.year,
      month: req.body.month,
      traveler_style: req.body.travelerStyle,
      budget_level: req.body.budgetLevel,
      duration: req.body.duration,
      nationality: req.body.nationality,
      interests: req.body.interests,
      trip_pace: req.body.tripPace,
      special_requirements: req.body.specialRequirements,
      transportation_preference: req.body.transportationPreference,
      status: "planning",
      itinerary: req.body.itinerary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("[tripRoutes] Inserting trip data:", tripData);

    const { data: newTrip, error } = await supabase
      .from("trips")
      .insert([tripData])
      .select()
      .single();

    if (error) {
      console.error("[tripRoutes] Supabase error:", error);
      return res.status(500).json({
        status: "error",
        message: "Database error",
        details: error.message,
      });
    }

    console.log("[tripRoutes] Trip created successfully:", newTrip);

    return res.status(201).json({
      status: "success",
      data: newTrip,
    });
  } catch (error) {
    console.error("[tripRoutes] Failed to create trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create trip",
      details: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: updatedTrip, error } = await supabase
      .from("trips")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      status: "success",
      data: updatedTrip,
    });
  } catch (error) {
    console.error("[tripRoutes] Update failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update trip",
      error: error.message,
    });
  }
});

module.exports = router;
