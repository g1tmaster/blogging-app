import React, {useState} from "react";
import { loginUser } from "./api";

export default function Login({setCurrentUser}) {
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if ( !email || !password) {
            setError("Please fill all fields");
            return;
        }

        try{
            const data = await loginUser({email, password});
            console.log("Raw response from backend:", data);

            if(data.user && data.token){
                setCurrentUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token)
            }
            else{
                setError(data.error || "Login Failed")
            }
        }catch (err){
            setError("Something went wrong")
        }
    }

    // return (
    //     <form onSubmit={handleLogin} style={{marginBottom: "2rem"}}>
    //         <h2>Login</h2>
    //         {error && <p style={{color: "red"}}>{error}</p>}
            
    //         <input type="email"
    //             placeholder = "Email"
    //             value= {email}
    //             onChange = {(e) => setEmail(e.target.value)}
    //             style={{display: "block", width: "100%", marginBottom: "1rem"}}
    //             />

    //         <input
    //             type="password"
    //             placeholder="Password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             style={{ display: "block", width: "100%", marginBottom: "1rem" }}
    //         />

    //         <button type="submit">Login</button>
    //     </form>
    // );

    return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
        {/* <h2 className="text-center mb-3">Blogging Website</h2> */}
        <h3 className="text-center mb-3">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};