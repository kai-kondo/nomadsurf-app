import { FaHome, FaWater, FaCalendarAlt, FaUsers } from "react-icons/fa";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 md:hidden">
      <a href="#" className="flex flex-col items-center text-sm text-sky-700">
        <FaHome className="text-xl" />
        Home
      </a>
      <a href="#" className="flex flex-col items-center text-sm text-sky-700">
        <FaWater className="text-xl" />
        Spots
      </a>
      <a href="#" className="flex flex-col items-center text-sm text-sky-700">
        <FaCalendarAlt className="text-xl" />
        Events
      </a>
      <a href="#" className="flex flex-col items-center text-sm text-sky-700">
        <FaUsers className="text-xl" />
        Community
      </a>
    </nav>
  );
}
