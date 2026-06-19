export function PdfMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* drop shadow card behind */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-foreground/10" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-xl border bg-card">
        {/* PDF header bar */}
        <div className="flex items-center gap-3 border-b bg-foreground px-6 py-4 text-background">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-background/10">
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-background" aria-hidden="true">
              <path d="M3 18V8.5l7-5 7 5V18h-5v-6H8v6H3z" />
            </svg>
          </div>
          <div className="text-sm font-semibold tracking-tight">Your Business · Check-in Inventory</div>
        </div>

        {/* meta */}
        <div className="border-b px-6 py-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>Property · <strong className="text-foreground">12 Thornton Road</strong></span>
            <span>Tenancy · <strong className="text-foreground">Smith 2026-05</strong></span>
            <span>Inspector · <strong className="text-foreground">You</strong></span>
          </div>
        </div>

        {/* room section */}
        <div className="px-6 py-5">
          <div className="flex items-baseline justify-between border-b pb-2">
            <h4 className="text-sm font-bold uppercase tracking-wide">Bathroom</h4>
            <span className="text-xs text-muted-foreground">8 items · high confidence</span>
          </div>

          {/* photo strip */}
          <div className="my-3 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 overflow-hidden rounded">
                <svg viewBox="0 0 80 60" className="h-auto w-full" aria-hidden="true">
                  <rect width="80" height="60" rx="3" className="fill-muted" />
                  <circle cx="18" cy="18" r="5" className="fill-muted-foreground/40" />
                  <path d="M0 50 L25 35 L42 42 L80 22 L80 60 L0 60 Z" className="fill-muted-foreground/30" />
                </svg>
              </div>
            ))}
          </div>

          {/* items table */}
          <table className="w-full text-xs">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="py-1.5 font-medium">Item</th>
                <th className="py-1.5 font-medium">Rating</th>
                <th className="py-1.5 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((row) => (
                <tr key={row.name} className="border-b last:border-b-0">
                  <td className="py-2 font-medium">{row.name}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.rating === "Good"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.rating === "Fair"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.rating}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div className="border-t bg-muted/30 px-6 py-2 text-center text-[10px] text-muted-foreground">
          Your Business · hello@yourbusiness.co.uk · UK Tenant Fees Act 2019 compliant
        </div>
      </div>
    </div>
  );
}

const ITEMS = [
  { name: "Bathtub", rating: "Good", note: "Freestanding, clean, no marks." },
  { name: "Toilet", rating: "Good", note: "Ceramic, in working order." },
  { name: "Mirror", rating: "Fair", note: "Small chip on lower-right corner." },
  { name: "Walls", rating: "Good", note: "Marble-effect tiling, no damage." },
] as const;
