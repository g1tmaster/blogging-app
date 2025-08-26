import React, { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost } from './api';
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");

  useEffect(() => {
    getPosts().then(setPosts);
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // async function loadPosts() {
  //   try{
  //     const data = await getPosts();
  //   setPosts(data);
  //   }catch(err) {
  //     console.log(err)
  //   }
  // }
  

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title || !content) return alert("Fill all fields");
    if (!currentUser) return alert("You must be logged in to create posts");

    try{
      const newPost = await createPost({ title, content });
      setPosts([newPost,...posts]);
      setTitle("");
      setContent("");
    }catch (err){
      setError(err.message);
    }
    
  }
  //logged out view: login/signup
  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
          {view === "login" ? (
            <>
              <Login
                setCurrentUser={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem("user", JSON.stringify(user));
                }}
              />
              <p className="mt-3 text-center">
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setView("signup")}
                >
                  Signup
                </button>
              </p>
            </>
          ) : (
            <>
              <Signup
                setCurrentUser={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem("user", JSON.stringify(user));
                }}
              />
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setView("login")}
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Logged-in view
  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <h2 className="text-center mb-3">Blogging Website</h2>
        <div className="container">
          <span className="navbar-brand fw-bold">
            
          </span>

          <div className="d-flex">
            <span className="navbar-text me-3">
              Welcome, {currentUser.name || currentUser.email}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Create Post */}
      <div className="container py-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Create a Post</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button type="submit" className="btn btn-success w-100">
                Publish
              </button>
            </form>
          </div>
        </div>

        {/* Posts */}
        <div className="row">
          {posts.map((p) => (
            <div className="col-12 col-md-6 mb-4" key={p.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text">{p.content}</p>
                  <p className="text-muted small">
                    by {p.author?.name ?? "Unknown"} ({p.author?.email})
                  </p>

                  {p.authorId === currentUser.id && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                          const newTitle = prompt("New title:", p.title);
                          const newContent = prompt("New content:", p.content);
                          if (!newTitle || !newContent) return;

                          try {
                            const updated = await updatePost(p.id, {
                              title: newTitle,
                              content: newContent,
                            });
                            setPosts(
                              posts.map((post) =>
                                post.id === p.id ? updated : post
                              )
                            );
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (!window.confirm("Delete this post?")) return;
                          try {
                            await deletePost(p.id);
                            setPosts(posts.filter((post) => post.id !== p.id));
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;