"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  spot_id: string;
  datetime: string;
  location: string;
  tags: string[];
  created_at: string;
  image_url?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        console.log("Fetched events data:", data);
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const filteredEvents = events.filter((event) => {
    const matchesKeyword =
      event.location.toLowerCase().includes(searchKeyword) ||
      event.title.toLowerCase().includes(searchKeyword);
    const matchesTag =
      !activeTag || event.tags.map((t) => t.toLowerCase()).includes(activeTag);
    return matchesKeyword && matchesTag;
  });

  return (
    <>
      <div className="bg-sky-50 border-b border-sky-100 py-6 mb-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <label
            htmlFor="city-filter"
            className="block text-slate-700 mb-2 font-semibold text-lg"
          >
            🔍 Search by City
          </label>
          <input
            type="text"
            id="city-filter"
            placeholder="Try 'Canggu' or 'Uluwatu'"
            value={searchKeyword}
            onChange={handleSearchChange}
            className="w-full sm:w-80 px-4 py-2 border border-slate-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">
          🌍 Discover Events Near You
        </h1>

        <div className="flex overflow-x-auto space-x-3 mb-8">
          {["surf", "cafe", "wellness", "coaching", "music"].map((tag) => (
            <button
              key={tag}
              className={`whitespace-nowrap min-w-max px-4 py-2 border rounded-full text-sm transition ${
                activeTag === tag
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white border-sky-200 text-sky-700 hover:bg-sky-100 hover:shadow"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-slate-500">Loading events...</p>
        )}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden group cursor-pointer"
            >
              <Image
                src={event.image_url || "/event.png"}
                alt={event.title}
                width={400}
                height={200}
                className="w-full h-48 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5 space-y-2">
                <p className="text-xs text-slate-500">
                  {new Date(event.datetime).toLocaleString("en-US", {
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
                <p className="text-sm text-slate-600">{event.description}</p>
                <p className="text-sm text-slate-500">📍 {event.location}</p>
                <div className="flex flex-wrap gap-1">
                  {event.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
