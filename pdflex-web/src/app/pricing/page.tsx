const plans = [
  {
    name: "Free",
    price: "0€",
    badge: "Začni hneď",
    features: ["5 úloh/deň", "Základný Merge/Split", "Štandardná rýchlosť"],
    cta: { label: "Registrovať", href: "/register" }
  },
  {
    name: "Pro",
    price: "9€",
    badge: "Najobľúbenejší",
    features: ["Neobmedzené úlohy", "Compress Pro", "Rýchlejšie fronty", "História výsledkov"],
    highlight: true,
    cta: { label: "Kúpiť Pro", href: "/register" }
  },
  {
    name: "Team",
    price: "19€",
    badge: "Tímy & firmy",
    features: ["Všetko z Pro", "Zdieľané workspace", "Prioritné fronty", "Admin & SSO (čoskoro)"],
    cta: { label: "Kontakt", href: "mailto:sales@pdflex.app" }
  }
];

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Cenník</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Vyber si plán, ktorý rastie s tebou.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.name}
               className={`relative rounded-2xl border p-6 backdrop-blur ${
                 p.highlight ? "bg-white/70 shadow-xl dark:bg-slate-800/60" : "bg-white/50 dark:bg-slate-800/50"
               }`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <span className="rounded-full border px-2 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300">
                {p.badge}
              </span>
            </div>
            <div className="mb-4 text-3xl font-bold">{p.price}<span className="text-base font-normal text-slate-500"> / mes</span></div>
            <ul className="mb-6 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
              {p.features.map(f => <li key={f}>• {f}</li>)}
            </ul>
            <a href={p.cta.href}
               className={`inline-flex w-full justify-center rounded-lg px-4 py-2 font-medium transition ${
                 p.highlight ? "btn-shine bg-brand-600 text-white hover:bg-brand-700" : "border border-slate-300 hover:bg-slate-50 dark:border-slate-600"
               }`}>
              {p.cta.label}
            </a>
            {p.highlight && <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-brand-600/10 blur-2xl" />}
          </div>
        ))}
      </div>
    </div>
  );
}