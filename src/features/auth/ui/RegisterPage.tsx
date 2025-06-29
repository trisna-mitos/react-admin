import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="Nama"
          className="border p-2 mb-4 w-full"
        />
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
        <button className="bg-green-500 text-white px-4 py-2 w-full rounded">
          Register
        </button>
        <p className="text-sm text-center mt-4">
          Sudah punya akun? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
