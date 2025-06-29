import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Belum punya akun? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}
