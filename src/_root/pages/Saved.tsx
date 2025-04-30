import GridPostList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { getPostById } from "@/lib/appwrite/api"; 

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const [savedPosts, setSavedPosts] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        if (!currentUser?.save || currentUser.save.length === 0) {
          setSavedPosts([]);
          return;
        }
  
        // Fetch posts in parallel
        const postsPromises = currentUser.save.map((record: Models.Document) => {
          if (!record?.post) return null;
          return getPostById(record.post.$id);
        });
  
        const posts = await Promise.all(postsPromises);
  
        // Remove any nulls
        const validPosts = posts.filter((post) => post !== null);
  
        setSavedPosts(validPosts.reverse());
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSavedPosts();
  }, [currentUser]);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/saved.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

            {loading ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;