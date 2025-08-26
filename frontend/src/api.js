const API_URL = "http://localhost:8787";

export async function getPosts(){
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json(); 
}

export async function createPost(post) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/posts`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            ...(token? {Authorization: `Bearer ${token}`}: {}),
        },
        body: JSON.stringify(post),
    });
    const data = await res.json();
    if(!res.ok) {
        throw new Error(
            Array.isArray(data.error)? data.error.map((e) => e.message).join(","): data.error || "Failed to create post"
        )
    }

    return data;
}

export async function updatePost(id, post){
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer: ${token}`}: {}),
        },
        body: JSON.stringify(post),
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Failed to update post");
    return data;
}

export async function deletePost(id) {
    const token  = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(token? {Authorization: `Bearer ${token}`}: {}),
        },
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Failed to delete post");
    return data;
}


export async function loginUser(credentials) {
    console.log(credentials);
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Login failed");

    console.log("after res.ok");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
}

export async function signupUser(user) {
    // console.log({user});
    const res = await fetch(`${API_URL}/users/signup`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(user),
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Signup Failed ");
    return data;
}
