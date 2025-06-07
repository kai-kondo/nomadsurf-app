"use client";

import { useEffect, useState } from "react";
import SpotMapWithWave from "@/components/MapView";
import { supabase } from "@/lib/supabase/client";

export default function SpotDetailPage() {
  const [spots, setSpots] = useState<
    { id: string; name: string; lat: number; lng: number }[]
  >([]);
  const [locations, setLocations] = useState<
    {
      id: string;
      spot_id: string;
      type: "coworking" | "cafe" | "hostel" | "surf_shop";
      name: string;
      description: string;
      lat: number;
      lng: number;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchSpots = async () => {
      const { data, error } = await supabase
        .from("surf_spots")
        .select("id, name, lat, lng");

      if (error) {
        console.error("Failed to fetch spots:", error);
      } else {
        console.log("Fetched spots:", data);
        setSpots(data);
      }
    };

    const fetchLocations = async () => {
      const { data, error } = await supabase.from("locations").select("*");

      if (error) {
        console.error("Failed to fetch locations:", error);
      } else {
        setLocations(data);
      }
    };

    fetchSpots();
    fetchLocations();
  }, []);

  return (
    <div className="h-screen w-full relative">
      {spots.length > 0 ? (
        <SpotMapWithWave spots={spots} locations={locations} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
