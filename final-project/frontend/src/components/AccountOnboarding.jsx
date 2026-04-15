function AccountOnboarding() {
  return (
    <div class="rounded-3xl bg-white p-8 shadow-soft">
      <span class="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-1 text-sm font-semibold text-brand-green">
        Account onboarding
      </span>

      <h1 class="mt-4 text-4xl font-semibold leading-tight">
        Create your Booking System account
      </h1>

      <p class="mt-4 text-base text-black/70">
        Register to manage bookings, view your reservations, and access
        role-based features.
      </p>

      <div class="mt-8 space-y-4 text-sm text-black/70">
        <div class="rounded-2xl border border-black/10 bg-black/5 p-4">
          <p class="font-semibold text-black/80">Reserver</p>
          <p class="mt-1">
            Use the system for normal booking and personal reservation
            management.
          </p>
        </div>
        <div class="rounded-2xl border border-black/10 bg-black/5 p-4">
          <p class="font-semibold text-black/80">Manager</p>
          <p class="mt-1">
            May receive extended permissions based on system configuration.
          </p>
        </div>
        <div class="rounded-2xl border border-black/10 bg-black/5 p-4">
          <p class="font-semibold text-black/80">Administrator</p>
          <p class="mt-1">
            Controls the entire system. Not available during registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccountOnboarding;
