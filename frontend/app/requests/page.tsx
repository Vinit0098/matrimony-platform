"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Requests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login"); // Kick them to login if they aren't signed in
      return;
    }
    fetchRequests(userId);
  }, []);

  const fetchRequests = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/interests/received/${userId}`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (interestId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/interests/${interestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        // Remove this request from the screen since we just handled it
        setRequests(requests.filter((req: any) => req.id !== interestId));
        alert(`Interest ${status.toLowerCase()}!`);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Connection Requests</h1>
          <Link href="/">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
              Back to Home
            </button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No pending requests</h2>
            <p className="text-gray-500">When someone sends you a connection, it will appear here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any) => {
              // The backend nested the sender's profile inside the sender object!
              const profile = req.sender.profile; 

              return (
                <div key={req.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Sender Info */}
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex-shrink-0 overflow-hidden shadow-sm border border-gray-200 bg-white">
                      {profile?.photo ? (
                        <img src={`http://localhost:3001${profile.photo}`} alt="Avatar" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-600 font-bold text-xl">
                          {profile?.firstName?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {profile?.firstName} {profile?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {profile?.city}, {profile?.country}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAction(req.id, "ACCEPTED")}
                      className="flex-1 sm:flex-none px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium shadow-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, "REJECTED")}
                      className="flex-1 sm:flex-none px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Decline
                    </button>
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