"use client";

import { useEffect, useState, useCallback } from "react";
import SpotMapWithWave from "@/components/MapView";
import { supabase } from "@/lib/supabase/client";

interface Review {
  id: string;
  spot_id?: string;
  location_id?: string;
  rating: number;
  comment: string;
  created_at: string;
}

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
  const [reviewsBySpot, setReviewsBySpot] = useState<{
    [key: string]: Review[];
  }>({});
  const [reviewsByLocation, setReviewsByLocation] = useState<{
    [key: string]: Review[];
  }>({});
  const [selectedSpot, setSelectedSpot] = useState<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: "coworking" | "cafe" | "hostel" | "surf_shop";
    description: string;
    url: string;
  } | null>(null);

  const handleSetSelectedSpot = useCallback(
    (spot: { id: string; name: string; lat: number; lng: number } | null) => {
      setSelectedSpot(spot);
    },
    []
  );

  const handleSetSelectedLocation = useCallback(
    (
      location: {
        id: string;
        name: string;
        lat: number;
        lng: number;
        type: "coworking" | "cafe" | "hostel" | "surf_shop";
        description: string;
        url: string;
      } | null
    ) => {
      setSelectedLocation(location);
    },
    []
  );

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
        const spotIds = data.map((spot) => spot.id);
        const allReviews: { [key: string]: Review[] } = {};
        for (const id of spotIds) {
          const { data: reviews, error: reviewsError } = await supabase
            .from("reviews")
            .select("*")
            .eq("spot_id", id);
          if (!reviewsError && reviews) {
            allReviews[id] = reviews;
          }
        }
        setReviewsBySpot(allReviews);
      }
    };

    const fetchLocations = async () => {
      const { data, error } = await supabase.from("locations").select("*");

      if (error) {
        console.error("Failed to fetch locations:", error);
      } else {
        setLocations(data);
        const locationIds = data.map((location) => location.id);
        const allReviews: { [key: string]: Review[] } = {};
        for (const id of locationIds) {
          const { data: reviews, error: reviewsError } = await supabase
            .from("reviews")
            .select("*")
            .eq("location_id", id);
          if (!reviewsError && reviews) {
            allReviews[id] = reviews;
          }
        }
        setReviewsByLocation(allReviews);
      }
    };

    fetchSpots();
    fetchLocations();
  }, []);

  return (
    <div className="h-screen w-full relative">
      {spots.length > 0 ? (
        <SpotMapWithWave
          spots={spots}
          locations={locations}
          reviewsBySpot={reviewsBySpot}
          reviewsByLocation={reviewsByLocation}
          selectedSpot={selectedSpot}
          setSelectedSpot={handleSetSelectedSpot}
          selectedLocation={selectedLocation}
          setSelectedLocation={handleSetSelectedLocation}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
