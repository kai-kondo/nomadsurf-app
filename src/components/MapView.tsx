"use client";

import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface WaveData {
  wave_height: number;
  wind_speed: number;
  swell_direction: number;
}

interface SpotMapWithWaveProps {
  spot: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  };
}

export default function SpotMapWithWave({ spot }: SpotMapWithWaveProps) {
  const [waveData, setWaveData] = useState<WaveData | null>(null);

  useEffect(() => {
    // ✅ クライアントサイドで環境変数を読み込む
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token is missing");
      return;
    }

    mapboxgl.accessToken = token!;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [spot.lng, spot.lat],
      zoom: 11,
    });

    new mapboxgl.Marker()
      .setLngLat([spot.lng, spot.lat])
      .setPopup(new mapboxgl.Popup().setText(spot.name))
      .addTo(map);

    return () => map.remove();
  }, [spot]);

  useEffect(() => {
    const fetchWave = async () => {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lng}&hourly=wave_height,swell_direction,wind_wave_height&timezone=auto`
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Wave API response error:", res.status, errorText);
          return;
        }

        const data = await res.json();

        if (
          data?.hourly?.wave_height?.length &&
          data?.hourly?.wind_speed?.length &&
          data?.hourly?.swell_direction?.length
        ) {
          setWaveData({
            wave_height: data.hourly.wave_height[0],
            wind_speed: data.hourly.wind_speed[0],
            swell_direction: data.hourly.swell_direction[0],
          });
        } else {
          console.error("Wave data not available or malformed", data);
        }
      } catch (err) {
        console.error("Wave API fetch failed", err);
      }
    };

    fetchWave();
  }, [spot]);

  return (
    <div className="space-y-4">
      <div
        className="w-full h-80 rounded-lg overflow-hidden shadow-md"
        id="map"
      />

      {waveData && (
        <div className="bg-white p-4 rounded-xl shadow-card text-sm text-slate-700">
          <p>
            🌊 <strong>Wave Height:</strong> {waveData.wave_height} m
          </p>
          <p>
            💨 <strong>Wind Speed:</strong> {waveData.wind_speed} m/s
          </p>
          <p>
            🗺️ <strong>Swell Direction:</strong> {waveData.swell_direction}&deg;
          </p>
        </div>
      )}
    </div>
  );
}
