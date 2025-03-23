import { useContext, useState } from "react";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", user);
      console.log(res, user);
      login(res.data);
      navigate("/dashboard");
      alert("User login successfully");
      setUser({ email: "", password: "" });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <form className="max-w-md flex flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          className="input"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="input"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
}

export default Login;
