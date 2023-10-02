import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "redux/index";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts.");
      }

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user posts.");
      }

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map((post) => (
        <PostWidget
          key={post?._id}
          postId={post?._id}
          postUserId={post?.userId}
          name={`${post?.firstName} ${post?.lastName}`}
          description={post?.description}
          location={post?.location}
          picturePath={post?.picturePath}
          userPicturePath={post?.userPicturePath}
          likes={post?.likes}
          comments={post?.comments}
        />
      ))}
    </>
  );
};

export default PostsWidget;
