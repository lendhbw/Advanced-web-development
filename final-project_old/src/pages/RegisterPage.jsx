import RegisterForm from "../components/RegisterFrom";
import Header from "../components/Header";
import AccountOnboarding from "../components/AccountOnboarding"; 
import Footer from "../components/Footer";


function RegisterPage() {
    return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <Header />
            <main className="mx-auto max-w-7xl px-6 flex-grow">
            <section className="py-16">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
                <div className="lg:col-span-5 space-y-6">
                    <AccountOnboarding />
                </div>
                  <div className="lg:col-span-7">
                    <RegisterForm />
                  </div>
            </div>
        </section>
        </main>
            <Footer />
        </div>
    
    );
}

export default RegisterPage;