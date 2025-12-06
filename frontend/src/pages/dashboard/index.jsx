import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import { BASE_URL } from '@/config';
import { resetPostId } from '@/config/redux/reducer/postReducer';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [postContent, setPostContent] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Fetch posts and user info
  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }
  }, [authState.isTokenThere]);

  // Fetch all users if not fetched
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const handleUpload = async () => {
    console.log('Uploading File...');
    await dispatch(
      createPost({
        body: postContent,
        file: fileContent,
      })
    );
    dispatch(getAllPosts());
    setPostContent('');
    setFileContent(null);
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <span className={styles.loader}></span>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponant}>
          {/* Create Post Section */}
          <div className={styles.createPostWrapper}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.profilePicture}
                src={`${BASE_URL}/${authState.user.userId?.profilePicture}`}
                alt="Profile"
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className={styles.textarea}
                placeholder="What's on your mind?"
              />
              <label htmlFor="fileUpload">
                <div className={styles.fab}>
                  <svg
                    width={30}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <input
                  id="fileUpload"
                  type="file"
                  hidden
                  onChange={(e) => setFileContent(e.target.files[0])}
                />
              </label>

              {postContent.length > 0 && (
                <div className={styles.uploadButton} onClick={handleUpload}>
                  Post
                </div>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div style={{ marginTop: '4rem' }} className={styles.postsContainer}>
            {postState.posts.map((post) => (
              <div key={post._id} className={styles.singleCard}>
                <div className={styles.singleCard__profilePicture}>
                  <img src={`${BASE_URL}/${post.userId?.profilePicture}`} alt="User" />
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <p style={{ fontWeight: 'bolder' }}>{post.userId?.name}</p>
                      {post.userId._id === authState.user.userId?._id && (
                        <div
                          style={{ cursor: 'pointer', color: 'red' }}
                          onClick={async () => {
                            console.log('Deleting Post....');
                            await dispatch(deletePost({ post_id: post._id }));
                            await dispatch(getAllPosts());
                          }}
                        >
                          <svg
                            width={25}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562a48.11 48.11 0 0 1 3.478-.397M7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p>@{post.userId?.username}</p>
                    <p style={{ marginTop: '1.3rem' }}>{post.body}</p>

                    {post.media && (
                      <div className={styles.singleCard__image}>
                        <img src={`${BASE_URL}/${post.media}`} alt="Post Media" />
                      </div>
                    )}

                    {/* Options */}
                    <div className={styles.optionContainer}>
                      {/* Like */}
                      <div
                        onClick={async () => {
                          await dispatch(incrementPostLike({ post_id: post._id }));
                          await dispatch(getAllPosts());
                        }}
                        className={styles.optionContainer__option}
                      >
                        <svg
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25"
                          />
                        </svg>
                        <p>{post.likes}</p>
                      </div>

                      {/* Comment */}
                      <div
                        onClick={async () => {
                          await dispatch(getAllComments({ post_id: post._id }));
                        }}
                        className={styles.optionContainer__option}
                      >
                        <svg
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                        <p>Comment</p>
                      </div>

                      {/* Share */}
                      <div
                        onClick={() => {
                          const text = encodeURIComponent(post.body);
                          const url = encodeURIComponent('demo.in');
                          const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                          window.open(twitterUrl, '_blank');
                        }}
                        className={styles.optionContainer__option}
                      >
                        <svg
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                        <p>Share</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
