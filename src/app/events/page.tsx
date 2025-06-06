import Image from "next/image";

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "🏖️ Sunrise Surf & Coffee",
      date: "2025-06-07T06:30:00Z",
      location: "Canggu",
      organizer: "Bali Surf Club",
      rating: 4.8,
      participants: 42,
      imageUrl: "/events/sunrise.jpg",
    },
    {
      id: 2,
      title: "🌿 Yoga & Work Beach Session",
      date: "2025-06-09T08:00:00Z",
      location: "Uluwatu",
      organizer: "Nomad Wellness",
      rating: 4.7,
      participants: 30,
      imageUrl: "/events/yoga.jpg",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Events near you
      </h1>

      {/* カテゴリフィルター（横スクロール） */}
      <div className="flex overflow-x-auto space-x-4 mb-6">
        {["🌊 Surf", "☕ Cafe", "🧘 Wellness", "🏄‍♂️ Coaching", "🎶 Music"].map(
          (tag, index) => (
            <button
              key={index}
              className="whitespace-nowrap px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm hover:bg-sky-200 transition"
            >
              {tag}
            </button>
          )
        )}
      </div>

      {/* イベントカード（グリッド） */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-card overflow-hidden"
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <p className="text-sm text-slate-500">
                {new Date(event.date).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <h2 className="text-md font-semibold text-slate-800">
                {event.title}
              </h2>
              <p className="text-sm text-slate-600">
                {event.organizer} • ⭐ {event.rating}
              </p>
              <p className="text-sm text-slate-500">
                {event.participants} participants
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
