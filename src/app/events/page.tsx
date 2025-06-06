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
    <>
      <div className="bg-sky-50 border-b border-sky-100 py-6 mb-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <label htmlFor="city-filter" className="block text-slate-700 mb-2 font-semibold text-lg">
            🔍 Search by City
          </label>
          <input
            type="text"
            id="city-filter"
            placeholder="Try 'Canggu' or 'Uluwatu'"
            className="w-full sm:w-80 px-4 py-2 border border-slate-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">
          🌍 Discover Events Near You
        </h1>

        <div className="flex overflow-x-auto space-x-3 mb-8">
          {["🌊 Surf", "☕ Cafe", "🧘 Wellness", "🏄‍♂️ Coaching", "🎶 Music"].map(
            (tag, index) => (
              <button
                key={index}
                className="whitespace-nowrap min-w-max px-4 py-2 bg-white border border-sky-200 text-sky-700 rounded-full text-sm hover:bg-sky-100 hover:shadow transition"
              >
                {tag}
              </button>
            )
          )}
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden group cursor-pointer"
              style={{ transition: 'box-shadow 0.2s, transform 0.15s' }}
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={200}
                className="w-full h-48 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5 space-y-2">
                <p className="text-xs text-slate-500">
                  {new Date(event.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <h2 className="text-lg font-semibold text-slate-800 group-hover:text-sky-700 transition-colors">
                  {event.title}
                </h2>
                <p className="text-sm text-slate-600">
                  {event.organizer} • <span className="text-yellow-500">⭐</span> {event.rating}
                </p>
                <p className="text-sm text-slate-500">
                  {event.participants} participants
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
