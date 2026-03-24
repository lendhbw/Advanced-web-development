import Header from "./components/Header";
import Hero from "./components/Hero";
import StatusCard from "./components/StatusCard";
import BookingsSection from "./components/BookingsSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 flex-grow">
        <section className="py-16 grid gap-12 lg:grid-cols-12 items-stretch">
          <Hero />
          <StatusCard />
        </section>

        <BookingsSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;