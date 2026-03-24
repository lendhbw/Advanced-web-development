function StatusCard() {
  return (
    <aside className="lg:col-span-5">
      <div className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Welcome!</h2>
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            Guest
          </span>
        </div>

        <p className="mt-4 text-sm text-brand-dark/70">
          <span className="block">
            Sign in to manage your reservations and view booking owners.
          </span>
          <span className="mt-2 block">
            Administrators and managers get extended rights and gain access to
            broader functionalities than a reserver.
          </span>
          <span className="mt-2 block font-medium text-brand-dark/80">
            Don’t have an account yet? Register to get started.
          </span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <a
            href="/register"
            className="rounded-xl border border-brand-dark px-4 py-3 text-center text-sm font-semibold transition-all duration-200 ease-out hover:bg-brand-dark hover:text-white"
          >
            Register
          </a>

          <a
            href="/login"
            className="rounded-xl bg-brand-primary px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-brand-dark"
          >
            Sign in
          </a>
        </div>
      </div>
    </aside>
  );
}

export default StatusCard;