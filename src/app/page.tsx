"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="space-y-12 px-4 pb-20 bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div
          className="w-screen h-56 bg-cover bg-center -mx-4"
          style={{ backgroundImage: "url(/surfnomad.jpg)" }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 mx-auto w-full max-w-xl bg-white rounded-xl shadow-card p-4 text-center scale-90"
        >
          <h1 className="text-2xl font-bold text-slate-800">
            Find your next
            <br />
            surf & work spot
          </h1>
          <button className="btn mt-4">Start exploring</button>
        </motion.div>
      </section>

      {/* Popular Surf Spots */}
      <section className="mt-60">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Popular Surf Spots
        </h2>
        <div className="flex overflow-x-auto space-x-4">
          {["Canggu", "Uluwatu", "Sellac"].map((spot, idx) => (
            <div key={idx} className="min-w-[140px] flex-shrink-0">
              <div className="w-36 h-24 bg-gray-300 rounded-xl mb-1"></div>
              <div className="text-sm font-medium text-slate-800">{spot}</div>
              <div className="text-xs text-slate-500">
                {4 + idx}-{6 + idx} ft ⭐ 4.{8 - idx}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-slate-800">
            Upcoming Events
          </h2>
          <a href="#" className="text-sm text-blue-500">
            View all &rarr;
          </a>
        </div>
        <div className="flex items-center space-x-4 bg-white rounded-xl shadow-card p-3">
          <div className="w-16 h-16 bg-gray-300 rounded-xl"></div>
          <div>
            <div className="font-medium text-slate-800">
              Sunrise Surf & Coffee
            </div>
            <div className="text-sm text-slate-500">Sun, Apr 28 • Canggu</div>
            <div className="text-sm text-slate-500">20 participants</div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Recent reviews
        </h2>
        <div className="flex items-center space-x-4 bg-white rounded-xl shadow-card p-3">
          <div className="w-16 h-16 bg-gray-300 rounded-xl"></div>
          <div>
            <div className="font-medium text-slate-800">Sarah</div>
            <div className="text-sm text-slate-500">
              Great coworking spot 🌞. The...
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
