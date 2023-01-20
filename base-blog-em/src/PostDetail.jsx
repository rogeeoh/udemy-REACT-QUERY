import {useQuery, useMutation} from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplasdfasdfaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const {data, isLoading, isError} = useQuery(["comments", post.id], () => fetchComments(post.id));

  // replace with useMutation
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isError) return <h3>Error fetching comments</h3>;
  if (isLoading) return <h3>Loading...</h3>;

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <h3>Error deleting post</h3>}
      {deleteMutation.isLoading && <h3>Deleting post...</h3>}
      {deleteMutation.isSuccess && <h3>Post deleted!</h3>}
      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
      {updateMutation.isSuccess && <h3>Post updated!</h3>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
