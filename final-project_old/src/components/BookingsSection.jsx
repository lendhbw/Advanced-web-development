const bookings = [
    // Sample bookings data insert here.
];

function BookingsSection() {
  return (
    <section className="pb-16">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h2 className="text-xl font-semibold">Current bookings</h2>
        <p className="mt-1 text-sm text-brand-dark/60">
          Public availability overview. Booking owner details are visible after sign-in.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-brand-dark/50">
              <tr>
                <th className="py-3">Resource</th>
                <th className="py-3">Start</th>
                <th className="py-3">End</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-dark/10">
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td className="py-4 pr-6 font-medium">{booking.resource}</td>
                  <td className="py-4 pr-6 text-brand-dark/70">{booking.start}</td>
                  <td className="py-4 text-brand-dark/70">{booking.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default BookingsSection;