import { useUserContext } from '@/context/AuthContext';
import { extractCityState, formatDate, timeAgo } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type PostCardProps = {
    post: Models.Document;
}
const PostCard = ({post}:PostCardProps) => {

    const {user} = useUserContext();

    if(!post.creator) return;
return (
    <div className="post-card">
        <div className="flex-between">
            <div className = "flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img
                    src={post?.creator?.imageUrl || `/assets/icons/profile-placeholder.svg`}
                    alt="creator"
                    className="rounded-full w-12 lg:h-12 object-cover"
                    />
                </Link>

                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-cyan-700">
                        <p className="subtle-semibold lg:small-regular">
                            {timeAgo(post.$createdAt)}
                        </p>
                        -
                        <p className="subtle-semibold lg:small-regular">
                            {extractCityState(post.location)}
                        </p>
                    </div>
                </div>
            </div>

            <Link to={`/update-post/${post.$id}`}
            className = {`${user.id !== post.creator.$id && "hidden"}`}>
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height = {20}
                className = "invert hue-rotate-[125deg] saturate-[65%]"/>
            </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
            <div className = "small-medium lg:base-medium py-5">
                {post.date && (
                    <p className="text-cyan-700 text-sm mb-2">
                        Event Date: {formatDate(post.date)}
                    </p>
                )}
                <p>{post.caption}</p>
                {Array.isArray(post.tags) && post.tags.length > 0 && post.tags.some(tag => tag.trim() !== "") && (
                    <ul className="flex gap-1 mt-2">
                    {post.tags.map((tag: string) => (
                        <li key={tag} className="text-cyan-700">
                        #{tag.trim()}
                        </li>
                    ))}
                    </ul>
                )}
            </div>
            
            {/* we can decide which one looks better on the home page
            personally ... idk
            */}
            {/* <div className="overflow-hidden rounded-xl max-w-xs mx-auto">
            <img 
                src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
                className="w-full h-auto object-contain"
                alt="post image"
            />
            </div> */}
            <img 
                src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
                className="post-card_img"
                alt="post image"
            />
        </Link>
        <PostStats post={post} userId={user.id}/>
    </div>
    )
}

export default PostCard