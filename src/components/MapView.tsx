"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoWaterOutline } from "react-icons/io5";
import { WiStrongWind } from "react-icons/wi";
import { IoClose } from "react-icons/io5";
import { GiWaveSurfer } from "react-icons/gi";

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

interface SpotMapWithWaveProps {
  spots: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }[];
}

export default function SpotMapWithWave({ spots }: SpotMapWithWaveProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedSpot, setSelectedSpot] = useState<
    SpotMapWithWaveProps["spots"][0] | null
  >(null);
  const [waveData, setWaveData] = useState<WaveData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  // 初期状態で selectedSpot が null のため、spots が読み込まれた時点で selectedSpot に初期値をセット
  useEffect(() => {
    if (spots.length > 0 && !selectedSpot) {
      setSelectedSpot(spots[0]);
    }
  }, [spots, selectedSpot]);

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
    if (!mapContainer.current) return;

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
      el.style.backgroundImage = "url('/surficon.png')";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundSize = "cover";
      el.style.borderRadius = "50%";
      el.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";

      new mapboxgl.Marker(el)
        .setLngLat([spot.lng, spot.lat])
        .addTo(map)
        .getElement()
        .addEventListener("click", () => {
          setSelectedSpot(spot);
          setIsCardVisible(true);
        });
    });

    return () => map.remove();
  }, [spots]);

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

  console.log("spots:", spots);
  console.log("selectedSpot:", selectedSpot);
  console.log("waveData:", waveData);
  console.log("weather:", weather);

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
        </div>
      )}
    </div>
  );
}
