const express = require("express");
const router = express.Router();
const { supabase } = require("../config/supabaseClient");

router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Missing user_id parameter",
      });
    }

    const { data: trips, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order(req.query.sort === "destination" ? "destination" : "created_at", {
        ascending: false,
      });

    if (error) throw error;

    return res.status(200).json({
      status: "success",
      data: trips,
    });
  } catch (error) {
    console.error("[tripRoutes] Failed to fetch trips:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("[tripRoutes] Received trip creation request:", req.body);

    if (!req.body.itinerary) {
      throw new Error("Missing itinerary data");
    }

    const tripData = {
      user_id: req.body.user_id,
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Missing trip ID parameter",
      });
    }

    console.log(`[tripRoutes] Attempting to delete trip with id: ${id}`);

    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) {
      console.error("[tripRoutes] Supabase delete error:", error);
      // Check for specific Supabase errors, e.g., if the item doesn't exist (PGRST204 can be tricky with delete)
      // For now, a general 500, but you might want to refine this.
      return res.status(500).json({
        status: "error",
        message: "Database error during deletion",
        details: error.message,
      });
    }

    // According to Supabase docs, delete doesn't return the deleted row by default and error is null on success.
    // A 204 No Content is often appropriate for successful DELETE operations.
    // Or a 200 with a success message.
    // The frontend apiClient is set to handle 204 as success.
    console.log(`[tripRoutes] Trip with id: ${id} deleted successfully`);
    return res.status(204).send(); 

  } catch (error) {
    console.error("[tripRoutes] Failed to delete trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete trip",
      details: error.message,
    });
  }
});

module.exports = router;
