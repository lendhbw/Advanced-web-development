import Header from "../components/Header";
import UserList from "../components/UserList";
import Footer from "../components/Footer";

function UserPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
        <main className="mx-auto max-w-7xl px-6 flex-grow">
    <section className="py-16 grid gap-12 lg:grid-cols-12 items-stretch">
                <UserList />
            </section>
        </main>
        <Footer />
    </div>
  );
}

export default UserPage;