import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Could not load users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <section className="pb-16 lg:col-span-12 w-full">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h2 className="text-xl font-semibold">Registered Users</h2>
        <p className="mt-1 text-sm text-brand-dark/60">
          Overview of all users registered in the system.
        </p>

        {loading && <p className="mt-6 text-sm">Loading users...</p>}
        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="mt-6 text-sm">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="text-left text-xs uppercase text-brand-dark/50">
                <tr>
                    <th className="py-3">ID</th>
                  <th className="py-3">First Name</th>
                  <th className="py-3">Last Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Password</th>
                  <th className="py-3">Created At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-dark/10">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4 pr-8 font-medium">{user.id}</td>
                    <td className="py-4 pr-8 text-brand-dark/70">{user.firstname}</td>
                    <td className="py-4 pr-8 text-brand-dark/70">{user.lastname}</td>
                    <td className="py-4 pr-8 text-brand-dark/70">{user.email}</td>
                    <td className="py-4 pr-8 text-brand-dark/70">{user.role}</td>
                    <td className="py-4 pr-8 text-brand-dark/70">{user.password}</td>
                    <td className="py-4 pr-8 text-brand-dark/70 whitespace-nowrap">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserList;