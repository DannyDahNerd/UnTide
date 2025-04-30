import { useEffect, useState } from "react";
import { getUserById } from "@/lib/appwrite/api";
import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";

type FollowersListProps = {
  user: Models.Document;
};

const FollowersList = ({ user }: FollowersListProps) => {
  const [followers, setFollowers] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      const results = await Promise.all(
        (user.followers || []).map((id:string) => getUserById(id))
      );
      
      const filteredResults = results.filter((res): res is Models.Document => !!res); // remove undefined
      
      setFollowers(filteredResults);
      setLoading(false);
    };

    fetchFollowers();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto py-6">
      <h2 className="h2-bold text-center">Followers</h2>
      {followers.length === 0 ? (
        <p className="text-center">0 followers.</p>
      ) : (
        followers.map((follower) => (
          <Link
            key={follower.$id}
            to={`/profile/${follower.$id}`}
            className="flex items-center gap-4 border-b pb-3"
          >
            <img
              src={follower.imageUrl}
              alt={follower.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-lg">{follower.name}</p>
          </Link>
        ))
      )}
    </div>
  );
};

export default FollowersList;
