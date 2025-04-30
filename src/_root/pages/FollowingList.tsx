import { useEffect, useState } from "react";
import { getUserById } from "@/lib/appwrite/api";
import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";

type FollowingListProps = {
  user: Models.Document;
};

const FollowingList = ({ user }: FollowingListProps) => {
  const [following, setFollowing] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      const results = await Promise.all(
        (user.following || []).map((id:string) => getUserById(id))
      );
      
      const filteredResults = results.filter((res): res is Models.Document => !!res); // remove undefined
      
      setFollowing(filteredResults);
      setLoading(false);
    };

    fetchFollowing();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto py-6">
      <h2 className="h2-bold text-center">Following</h2>
      {following.length === 0 ? (
        <p className="text-center">0 following.</p>
      ) : (
        following.map((following) => (
          <Link
            key={following.$id}
            to={`/profile/${following.$id}`}
            className="flex items-center gap-4 border-b pb-3"
          >
            <img
              src={following.imageUrl}
              alt={following.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-lg">{following.name}</p>
          </Link>
        ))
      )}
    </div>
  );
};

export default FollowingList;
