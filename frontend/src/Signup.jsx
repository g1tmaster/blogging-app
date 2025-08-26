import React, { useState} from "react";
import { signupUser } from "./api";

export default function Signup({ setCurrentUser}) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Please fill all fields");
            return;
        }
        try{
            const data = await signupUser({name, email, password});
            setCurrentUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

        }catch (err){
            setError(err.message || "Signup failed");
        }
    }

    // return (
    //     <div style={{maxWidth: "400px", margin: "2rem auto"}}>
    //         <h2>Signup</h2>
    //         {error && <p style={{color : "red"}}>{error}</p>}
    //         <form onSubmit={handleSubmit}>
    //             <input
    //                 type="text"
    //                 placeholder="Name"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //                 style={{ display: "block", width: "100%", marginBottom: "1rem" }}
    //             />
    //             <input
    //                 type="email"
    //                 placeholder="Email"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 style={{ display: "block", width: "100%", marginBottom: "1rem" }}
    //             />
    //             <input
    //                 type="password"
    //                 placeholder="Password"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 style={{ display: "block", width: "100%", marginBottom: "1rem" }}
    //             />
    //             <button type="submit">Signup</button>
    //         </form>
    //     </div>
    // )
    return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3">Signup</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}