import GridPostList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { id } = useParams();
  const likePosts = currentUser?.liked?.slice().reverse();

  return (
    <div className="saved-container">
      <div className="flex flex-col w-full max-w-5xl">
        <Link
          to={`/profile/${id}`}
          className="text-sm text-cyan-700 hover:underline mb-2"
        >
          ← Back to Profile
        </Link>

        <div className="flex gap-2 items-center">
          <img
            src="/assets/icons/liked.svg"
            width={36}
            height={36}
            alt="liked"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left">Liked Posts</h2>
        </div>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9 mt-6">
          {likePosts.length === 0 ? (
            <p className="text-cyan-700">No available posts</p>
          ) : (
            <GridPostList posts={likePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default LikedPosts;
