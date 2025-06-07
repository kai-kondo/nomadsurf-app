"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Review {
  id: string;
  user_id: string;
  spot_id: string;
  location_id?: string;
  rating: number;
  comment: string;
  image_urls: string[];
  created_at: string;
}

export default function SpotDetailPage() {
  const params = useParams();
  const id = params.id;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/spots/${id}/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🏄 Spot Reviews</h1>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {reviews.length === 0 && !loading && <p>No reviews yet.</p>}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-2">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <div className="flex flex-wrap gap-2">
              {review.image_urls.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Review image ${i + 1}`}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
