import Link from "next/link";

export default async function ProfileDetails({ params }: { params: Promise<{ id: string }> }) {
  let profile = null;

  try {
    const resolvedParams = await params;
    const profileId = resolvedParams.id;

    const res = await fetch(`http://localhost:3001/profiles/${profileId}`, { cache: "no-store" });
    
    const text = await res.text();
    
    if (res.ok && text) {
      profile = JSON.parse(text);
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't load the details for this profile.</p>
          <Link href="/">
            <button className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition">Go Back Home</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Banner */}
        <div className="bg-rose-600 h-32 w-full"></div>
        
        <div className="px-8 pb-8">
          
          {/* --- THE UPDATED PHOTO SECTION --- */}
          <div className="w-24 h-24 bg-rose-100 border-4 border-white rounded-full flex items-center justify-center -mt-12 mb-4 shadow-md overflow-hidden bg-white">
            {profile.photo ? (
              <img 
                src={`http://localhost:3001${profile.photo}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-rose-600">{profile.firstName[0]}</span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-6">
            {profile.city}, {profile.country}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Basic Details</h3>
              <ul className="space-y-2 text-gray-800">
                <li><span className="font-medium mr-2">Gender:</span> {profile.gender}</li>
                <li><span className="font-medium mr-2">Marital Status:</span> {profile.maritalStatus}</li>
                <li><span className="font-medium mr-2">Religion:</span> {profile.religion}</li>
                <li><span className="font-medium mr-2">Mother Tongue:</span> {profile.motherTongue}</li>
              </ul>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wider mb-3">Contact Info</h3>
              <ul className="space-y-2 text-rose-900">
                <li><span className="font-medium mr-2">Email:</span> {profile.user?.email}</li>
                <li><span className="font-medium mr-2">Phone:</span> {profile.user?.phone}</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">About Me</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              {profile.bio}
            </p>
          </div>

          <Link href="/">
            <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition w-full md:w-auto">
              ← Back to All Profiles
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}