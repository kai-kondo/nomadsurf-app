import SpotMapWithWave from "@/components/MapView";

export default function SpotDetailPage() {
  const spot = {
    id: "abc123",
    name: "Canggu Beach",
    lat: -8.6478,
    lng: 115.1385,
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{spot.name}</h1>
      <SpotMapWithWave spot={spot} />
    </div>
  );
}
