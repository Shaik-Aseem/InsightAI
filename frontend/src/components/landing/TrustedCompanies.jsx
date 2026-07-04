const companies = [
  { name: 'Salesforce', ticker: 'CRM', employees: '73K+' },
  { name: 'HubSpot', ticker: 'HUBS', employees: '7K+' },
  { name: 'Zendesk', ticker: 'ZEN', employees: '6K+' },
  { name: 'Stripe', ticker: 'Private', employees: '8K+' },
  { name: 'Figma', ticker: 'Private', employees: '1K+' },
  { name: 'Datadog', ticker: 'DDOG', employees: '5K+' },
  { name: 'Snowflake', ticker: 'SNOW', employees: '7K+' },
  { name: 'Vercel', ticker: 'Private', employees: '500+' },
  { name: 'Intercom', ticker: 'Private', employees: '900+' },
  { name: 'Atlassian', ticker: 'TEAM', employees: '12K+' },
];

function TrustedCompanies() {
  return (
    <section id="companies" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-3">
            Trusted by industry leaders
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-300">
            Powering the world&apos;s best sales teams
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="glass-card p-4 text-center card-hover group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 text-xs font-bold text-cyan-400 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-slate-300 text-sm font-semibold">{company.name}</p>
              <p className="text-slate-600 text-xs mt-0.5">{company.employees}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
          {[
            { label: 'G2 Rating', value: '4.9/5', stars: 5 },
            { label: 'Capterra Score', value: '4.8/5', stars: 5 },
            { label: 'Product Hunt', value: '#1 Product', stars: 5 },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <div className="flex gap-0.5 justify-center mb-1">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-white font-bold">{r.value}</p>
              <p className="text-slate-500 text-xs">{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedCompanies;
