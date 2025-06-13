import { useState, createContext, useContext } from "react";

import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// CONTEXT API
const PostContext = createContext();

function PostProvider({ children }) {
  // callback inside "useState" runs only on initial render
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 10 }, () => createRandomPost())
  );
  // console.log(posts)

  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  // BLOG: titles and posts gets filtered with "searchQuery"
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [...posts, post]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);

  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");

  return context;
}

export { PostProvider, usePosts };
