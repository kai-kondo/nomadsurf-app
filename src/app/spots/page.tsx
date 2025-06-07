"use client";

import { useEffect, useState } from "react";
import SpotMapWithWave from "@/components/MapView";
import { supabase } from "@/lib/supabase/client";

export default function SpotDetailPage() {
  const [spots, setSpots] = useState<
    { id: string; name: string; lat: number; lng: number }[]
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

    fetchSpots();
  }, []);

  return (
    <div className="h-screen w-full relative">
      {spots.length > 0 ? <SpotMapWithWave spots={spots} /> : <p>Loading...</p>}
    </div>
  );
}
