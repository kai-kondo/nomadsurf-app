"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoWaterOutline } from "react-icons/io5";
import { WiStrongWind } from "react-icons/wi";
import { IoClose } from "react-icons/io5";
import { GiWaveSurfer } from "react-icons/gi";
import { IoLaptopOutline, IoCafeOutline, IoHomeOutline } from "react-icons/io5";

interface WaveData {
  wave_height: number;
  swell_wave_height: number;
  swell_wave_direction: number;
  swell_wave_period: number;
}

interface WeatherData {
  temperature: number;
  weathercode: number;
  precipitation: number;
  windspeed: number;
}

interface Review {
  id: string;
  spot_id?: string;
  location_id?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface SpotMapWithWaveProps {
  spots: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }[];
  locations: {
    id: string;
    spot_id: string;
    type: "coworking" | "cafe" | "hostel" | "surf_shop";
    name: string;
    description: string;
    lat: number;
    lng: number;
    url: string;
  }[];
  reviewsBySpot: { [key: string]: Review[] };
  reviewsByLocation: { [key: string]: Review[] };
  selectedSpot: { id: string; name: string; lat: number; lng: number } | null;
  setSelectedSpot: (
    spot: { id: string; name: string; lat: number; lng: number } | null
  ) => void;
  selectedLocation: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: "coworking" | "cafe" | "hostel" | "surf_shop";
    description: string;
    url: string;
  } | null;
  setSelectedLocation: (
    location: {
      id: string;
      name: string;
      lat: number;
      lng: number;
      type: "coworking" | "cafe" | "hostel" | "surf_shop";
      description: string;
      url: string;
    } | null
  ) => void;
}

export default function SpotMapWithWave({
  spots,
  locations,
  reviewsBySpot,
  reviewsByLocation,
  selectedSpot,
  setSelectedSpot,
  selectedLocation,
  setSelectedLocation,
}: SpotMapWithWaveProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [waveData, setWaveData] = useState<WaveData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    if (spots.length > 0 && !selectedSpot) {
      setSelectedSpot(spots[0]);
    }
  }, [spots, selectedSpot, setSelectedSpot]);

  const getWeatherDescription = (code: number): string => {
    const map: Record<number, string> = {
      0: "☀️ Clear sky",
      1: "🌤️ Mostly clear",
      2: "🌥️ Partly cloudy",
      3: "☁️ Overcast",
      45: "🌫️ Fog",
      48: "🌫️ Depositing rime fog",
      51: "🌦️ Light drizzle",
      53: "🌧️ Moderate drizzle",
      55: "🌧️ Dense drizzle",
      61: "🌦️ Slight rain",
      63: "🌧️ Moderate rain",
      65: "🌧️ Heavy rain",
      71: "🌨️ Slight snow fall",
      73: "🌨️ Moderate snow fall",
      75: "❄️ Heavy snow fall",
      80: "🌦️ Light rain showers",
      81: "🌧️ Moderate rain showers",
      82: "⛈️ Violent rain showers",
      95: "⛈️ Thunderstorm",
      96: "⛈️ Thunderstorm with slight hail",
      99: "⛈️ Thunderstorm with heavy hail",
    };
    return map[code] || `Unknown weather code (${code})`;
  };

  useEffect(() => {
    if (!mapContainer.current || !locations) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token is missing");
      return;
    }

    mapboxgl.accessToken = token!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [spots[0].lng, spots[0].lat],
      zoom: 11,
    });

    spots.forEach((spot) => {
      const el = document.createElement("div");
      el.style.backgroundImage = "url('/icons/surfspot.png')";
      el.style.width = "48px";
      el.style.height = "48px";
      el.style.backgroundSize = "cover";
      el.style.borderRadius = "50%";
      el.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";

      new mapboxgl.Marker(el)
        .setLngLat([spot.lng, spot.lat])
        .addTo(map)
        .getElement()
        .addEventListener("click", () => {
          setSelectedLocation(null); // close location card if open
          setSelectedSpot(spot);
          setIsCardVisible(true);
        });
    });

    if (locations && Array.isArray(locations)) {
      locations.forEach((location) => {
        const el = document.createElement("div");
        el.style.backgroundSize = "cover";
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.borderRadius = "50%";

        switch (location.type) {
          case "coworking":
            el.style.backgroundImage = "url('/icons/coworking.png')";
            break;
          case "cafe":
            el.style.backgroundImage = "url('/icons/cafe.png')";
            break;
          case "hostel":
            el.style.backgroundImage = "url('/icons/hostel.png')";
            break;
          case "surf_shop":
            el.style.backgroundImage = "url('/icons/surfshop.png')";
            break;
          default:
            el.style.backgroundImage = "url('/surficon.png')";
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.lng, location.lat])
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedSpot(null); // close spot card if open
          setSelectedLocation(location);
          setIsCardVisible(false); // optionally close spot card if open
        });
      });
    }

    return () => map.remove();
  }, [spots, locations, setSelectedLocation, setSelectedSpot]);

  useEffect(() => {
    if (!selectedSpot) return;

    const fetchWave = async () => {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${selectedSpot.lat}&longitude=${selectedSpot.lng}&hourly=wave_height,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=Asia%2FTokyo`
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Wave API response error:", res.status, errorText);
          return;
        }

        const data = await res.json();

        if (
          data?.hourly?.wave_height?.length &&
          data?.hourly?.swell_wave_height?.length &&
          data?.hourly?.swell_wave_direction?.length &&
          data?.hourly?.swell_wave_period?.length
        ) {
          setWaveData({
            wave_height: data.hourly.wave_height[0],
            swell_wave_height: data.hourly.swell_wave_height[0],
            swell_wave_direction: data.hourly.swell_wave_direction[0],
            swell_wave_period: data.hourly.swell_wave_period[0],
          });
        } else {
          console.error("Wave data not available or malformed", data);
        }
      } catch (err) {
        console.error("Wave API fetch failed", err);
      }
    };

    fetchWave();
  }, [selectedSpot]);

  useEffect(() => {
    if (!selectedSpot) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedSpot.lat}&longitude=${selectedSpot.lng}&hourly=temperature_2m,precipitation,weathercode,windspeed_10m&temperature_unit=fahrenheit&precipitation_unit=inch&windspeed_unit=mph&timezone=Asia%2FTokyo`
        );
        if (!res.ok) throw new Error("Weather API error");
        const data = await res.json();
        if (data.hourly?.temperature_2m?.length) {
          setWeather({
            temperature: data.hourly.temperature_2m[0],
            precipitation: data.hourly.precipitation[0],
            weathercode: data.hourly.weathercode[0],
            windspeed: data.hourly.windspeed_10m[0],
          });
        }
      } catch (err) {
        console.error("Weather API fetch failed", err);
      }
    };
    fetchWeather();
  }, [selectedSpot]);

  return (
    <div className="h-screen w-full relative">
      <div className="absolute inset-0 w-full h-full" ref={mapContainer} />

      {selectedSpot && waveData && weather && isCardVisible && (
        <div
          className="fixed bottom-[64px] left-4 right-4 md:left-4 md:right-auto md:w-[400px] z-50 rounded-xl p-4 shadow-lg backdrop-blur-md text-white overflow-hidden"
          style={{
            backgroundImage: `url('/surf_spot_images/${selectedSpot.id}.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(24, 24, 27, 0.9)",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">
              {selectedSpot.name}
            </h2>
            <button
              onClick={() => setIsCardVisible(false)}
              className="text-white/70 hover:text-white"
            >
              <IoClose size={20} />
            </button>
          </div>
          <div className="text-xl font-bold text-white">
            {waveData.wave_height.toFixed(1)}m -{" "}
            {waveData.swell_wave_height.toFixed(1)}m
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <WiStrongWind size={18} /> {weather.windspeed} mph
            </span>
            <span className="flex items-center gap-1">
              <GiWaveSurfer size={16} /> Swell {waveData.swell_wave_direction}
              &deg;
            </span>
            <span className="flex items-center gap-1">
              <IoWaterOutline size={16} />{" "}
              {getWeatherDescription(weather.weathercode)}
            </span>
          </div>
          <div className="mt-4 text-xs text-white/50">
            Low tide: coming soon · Updated now
          </div>
          {reviewsBySpot[selectedSpot.id] &&
            reviewsBySpot[selectedSpot.id].length > 0 && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <h3 className="text-sm font-semibold mb-2">Latest Reviews</h3>
                <div className="space-y-3">
                  {reviewsBySpot[selectedSpot.id].slice(0, 3).map((review) => (
                    <div key={review.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400">
                          {"★".repeat(review.rating)}
                        </span>
                        <span className="text-white/70 text-xs">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/90">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {selectedLocation && (
        <div
          className="fixed bottom-[64px] left-4 right-4 md:left-4 md:right-auto md:w-[400px] z-50 rounded-xl p-4 shadow-lg backdrop-blur-md text-white overflow-hidden"
          style={{
            backgroundImage: `url('/surf_spot_images/${selectedLocation.id}.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor:
              selectedLocation.type === "coworking"
                ? "rgba(30, 64, 175, 0.85)" // deeper blue
                : selectedLocation.type === "cafe"
                ? "rgba(202, 138, 4, 0.85)" // richer yellow
                : selectedLocation.type === "hostel"
                ? "rgba(5, 150, 105, 0.85)" // teal green
                : selectedLocation.type === "surf_shop"
                ? "rgba(220, 38, 38, 0.85)" // vivid red
                : "rgba(30, 41, 59, 0.9)",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">
              {selectedLocation.name}
            </h2>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-white/70 hover:text-white"
            >
              <IoClose size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3 text-white">
            <span className="text-sm flex items-center gap-1">
              {selectedLocation.type === "coworking" && (
                <>
                  <IoLaptopOutline className="text-white" /> Coworking Space
                </>
              )}
              {selectedLocation.type === "cafe" && (
                <>
                  <IoCafeOutline className="text-white" /> Cafe
                </>
              )}
              {selectedLocation.type === "hostel" && (
                <>
                  <IoHomeOutline className="text-white" /> Hostel
                </>
              )}
              {selectedLocation.type === "surf_shop" && (
                <>
                  <GiWaveSurfer className="text-white" /> Surf Shop
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-white mb-4">
            {selectedLocation.description}
          </p>
          {selectedLocation.url && (
            <a
              href={selectedLocation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition"
            >
              View Details
            </a>
          )}
          {reviewsByLocation[selectedLocation.id] &&
            reviewsByLocation[selectedLocation.id].length > 0 && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <h3 className="text-sm font-semibold mb-2">Latest Reviews</h3>
                <div className="space-y-3">
                  {reviewsByLocation[selectedLocation.id]
                    .slice(0, 3)
                    .map((review) => (
                      <div key={review.id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400">
                            {"★".repeat(review.rating)}
                          </span>
                          <span className="text-white/70 text-xs">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/90">{review.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
