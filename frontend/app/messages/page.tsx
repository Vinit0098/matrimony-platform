"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MessagesInbox() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetchChats(userId);
  }, []);

  const fetchChats = async (userId: string) => {
    try {
      // We pull your mutual matches, because those are your active chats!
      const res = await fetch(`http://localhost:3001/interests/matches/${userId}`);
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages 💬</h1>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading your conversations...</p>
        ) : chats.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No active chats</h2>
            <p className="text-gray-500">When you match with someone, you can message them here!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chats.map((chat: any) => {
              const person = chat.user;
              const profile = person.profile;

              return (
                // The entire row acts as a link straight to their chat box
                <Link key={chat.matchId} href={`/chat/${person.id}`}>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:bg-rose-50 hover:border-rose-300 transition cursor-pointer">
                    
                    {/* Profile Picture */}
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex-shrink-0 overflow-hidden shadow-sm border border-gray-200">
                      {profile?.photo ? (
                        <img src={`http://localhost:3001${profile.photo}`} alt="Avatar" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-600 font-bold text-2xl">
                          {profile?.firstName?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {profile?.firstName} {profile?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">Click to open chat...</p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}