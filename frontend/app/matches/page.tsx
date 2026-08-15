"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetchMatches(userId);
  }, []);

  const fetchMatches = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/interests/matches/${userId}`);
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Matches 🎉</h1>
            <p className="text-gray-600">You both liked each other! Reach out and say hello.</p>
          </div>
          <Link href="/">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
              Back to Home
            </button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading your matches...</p>
        ) : matches.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No matches yet!</h2>
            <p className="text-gray-500">Keep browsing profiles and sending interests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match: any) => {
              const person = match.user;
              const profile = person.profile;

              return (
                <div key={match.matchId} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-rose-500 border-x border-b border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-rose-100 rounded-full flex-shrink-0 overflow-hidden shadow-sm border-2 border-white">
                        {profile?.photo ? (
                          <img src={`http://localhost:3001${profile.photo}`} alt="Avatar" className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-600 font-bold text-3xl">
                            {profile?.firstName?.[0] || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {profile?.firstName} {profile?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {profile?.city}, {profile?.country}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info Revealed! */}
                    <div className="bg-rose-50 p-4 rounded-lg space-y-2 border border-rose-100">
                      <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Private Contact Info</h4>
                      <p className="text-gray-800 font-medium flex items-center gap-2">
                        📧 {person.email}
                      </p>
                      <p className="text-gray-800 font-medium flex items-center gap-2">
                        📞 {person.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <Link href={`/chat/${person.id}`} className="flex-1">
                      <button className="w-full py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium shadow-sm">
                        Message 💬
                      </button>
                    </Link>
                    <Link href={`/profile/${profile?.id}`} className="flex-1">
                      <button className="w-full py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition font-medium border border-rose-200">
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}