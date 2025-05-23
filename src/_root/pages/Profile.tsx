import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/GridPostsList";
import { useEffect, useState } from "react";
import { updateUser } from "@/lib/appwrite/api";
import { buildUpdateUserPayload } from "@/lib/utils";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-cyan-600">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (currentUser?.followers?.includes(user.id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, user.id]);

  const handleFollow = async () => {
    if (!currentUser) return; 
  
    try {
      //if already following user
      if (isFollowing) {
        // Unfollow user
        const updatedFollowers = (currentUser.followers || []).filter((id: string) => id !== user.id);
        //remove self from user's following
        const updatedFollowing = (user.following || []).filter((id: string) => id !== currentUser.$id);

        //update documents
        await updateUser(buildUpdateUserPayload(currentUser, { followers: updatedFollowers }));
        await updateUser(buildUpdateUserPayload({
          ...user,
          following: updatedFollowing,
        }));
  
        // optimistic
        currentUser.followers = updatedFollowers;
        user.following = updatedFollowing;
        
      } else {
        // else follow
        const updatedFollowers = [...(currentUser.followers || []), user.id];
        const updatedFollowing = [...(user.following || []), currentUser.$id];
  
        await updateUser(buildUpdateUserPayload(currentUser, { followers: updatedFollowers }));
        await updateUser(buildUpdateUserPayload({
          ...user,
          following: updatedFollowing,
        }));
        currentUser.followers = updatedFollowers;
        user.following = updatedFollowing;
      }

      //reverse boolean
      setIsFollowing(!isFollowing);
  
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-light-3 flex justify-center items-center">
            <img
              src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-cyan-600 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <Link to={`/profile/${currentUser.$id}`}>
                <StatBlock value={currentUser.posts.length} label="Posts" />
              </Link>
              <Link to={`/profile/${currentUser.$id}/followers`}>
                <StatBlock value={currentUser.followers?.length || 0} label="Followers" />
              </Link>
              <Link to={`/profile/${currentUser.$id}/following`}>
                <StatBlock value={currentUser.following?.length || 0} label="Following" />
              </Link>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                  className="invert hue-rotate-[120deg] saturate-[300%]"
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>

            <div className={`${user.id === id && "hidden"}`}>
              <Button
                type="button"
                className="untide-button_primary px-8"
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser && currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
              className="invert hue-rotate-[120deg] saturate-[300%]"
            />Posts
          </Link>
          <Link
            to={`/liked-posts/${id}`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/liked-posts/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="liked posts"
              width={20}
              height={20}
              className="invert hue-rotate-[120deg] saturate-[300%]"
            />Liked Posts
          </Link>
        </div>
      )}

<Routes>
  <>
    <Route
      index
      element={<GridPostList posts={currentUser!.posts} showUser={false} />}
    />
    {currentUser && currentUser.$id === user.id && (
      <Route path="liked-posts" element={<LikedPosts />} />
    )}
      <Route path="followers" element={<FollowersList user={currentUser!} />} />
      <Route path="following" element={<FollowingList user={currentUser!} />} />
  </>
</Routes>

      <Outlet />
    </div>
  );
};

export default Profile;
