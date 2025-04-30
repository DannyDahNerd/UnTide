import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { deletePost } from '@/lib/appwrite/api';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { extractCityState, formatDate, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostDetails = () => {
  const {id} = useParams();
  const {data:post, isPending} = useGetPostById(id || '');
  const {user} = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleDeletePost = async () => {
    if (!post) return;
  
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
  
    try {
      const result = await deletePost(post.$id, post.imageId);
  
      if (result?.status === "ok") {
        toast({ title: "Post deleted successfully" });
        navigate("/");
      } else {
        toast({ title: "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Error occurred while deleting the post." });
    }
  };

  return (
    <div className="post_details-container">
      {isPending?<Loader /> : (
        <div className="post_details-card">
          <img 
            src = {post?.imageUrl}
            alt="creator"
            onClick={() => setShowImageModal(true)}
            className="post_details-img cursor-pointer object-cover transition hover:opacity-90"
          />
          <div className = "post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                  <img
                  src={post?.creator?.imageUrl || `/assets/icons/profile-placeholder.svg`}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12 object-cover"
                  />

                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post?.creator.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-cyan-700">
                        <p className="subtle-semibold lg:small-regular">
                            {timeAgo(post?.$createdAt)}
                        </p>
                        -
                        <p className="subtle-semibold lg:small-regular">
                          {post?.location ? extractCityState(post.location) : ""}
                        </p>
                    </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                  <img src="/assets/icons/edit.svg" className = "invert hue-rotate-[125deg] saturate-[65%]"
                  width = {24}
                  height = {24}
                  alt="edit"/>
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/delete.svg"
                    width = {24}
                    height = {24}
                    alt="delete"/>
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80"/>
            <div className = "flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>{post?.caption}</p>
                {post?.date && (
                  <p className="text-sm text-cyan-600 mb-2">
                    Event Date: <span className="font-medium">{formatDate(post.date)}</span>
                  </p>
                )}
                {Array.isArray(post?.tags) && post.tags.length > 0 && post.tags.some(tag => tag.trim() !== "") && (
                <ul className="flex gap-1 mt-2">
                  {post.tags.map((tag: string) => (
                    <li key={tag} className="text-cyan-700">
                      #{tag.trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {post && (
              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>
            )}
          </div>
      </div>
      )}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setShowImageModal(false)} // close on background click
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-white text-3xl z-10 hover:text-gray-300"
              aria-label="Close full image view"
            >
              ×
            </button>
            <img
              src={post?.imageUrl}
              alt="Full post"
              className="rounded-lg w-auto h-auto max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails