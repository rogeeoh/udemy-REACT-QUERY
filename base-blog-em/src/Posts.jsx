import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";

import {PostDetail} from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(page) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const {data, isError, isLoading} = useQuery(["posts", currentPage], () => fetchPosts(currentPage), {staleTime: 2000});
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPage = currentPage + 1;
    if (nextPage > maxPostPage) return;

    // prefetch next page
    queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
  }, [currentPage, queryClient]);

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Error fetching posts</h3>;

  return (
    <>
      <ul>
        {data?.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(prev => prev - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(prev => prev + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr/>
      {selectedPost && <PostDetail post={selectedPost}/>}
    </>
  );
}
