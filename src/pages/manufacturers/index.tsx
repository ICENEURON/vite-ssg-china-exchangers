
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { BadgeCheck, MapPin, Factory, Star, ArrowRight, Building2 } from "lucide-react"

export default function ManufacturersPage() {

  const manufacturers = [
    {
      id: 'shphe',
      name: 'Shanghai Heat Transfer Equipment Co., Ltd. (SHPHE)',
      rating: '5.0',
      ratingLabel: 'Tech Leader',
      location: 'Shanghai, China',
      verified: true,
      description: 'Premier solution provider for difficult fluids. Specializes in Wide Gap and Fully Welded Plate Heat Exchangers. Owns an in-house Thermal Performance Laboratory.',
      tags: ['Welded PHE', 'Wide Gap', 'PCHE'],
      link: '/manufacturers/shanghai-heat-transfer-equipment-co-ltd'
    },
    {
      id: 'jiangsu-pioneer',
      name: 'Jiangsu Pioneer Machinery Co., Ltd.',
      rating: '4.8',
      ratingLabel: 'High Volume',
      location: 'Jiangsu, China',
      verified: true,
      description: 'Large-scale manufacturer focused on standard gasketed plate heat exchangers for HVAC and Marine applications. High capacity production lines.',
      tags: ['Gasketed PHE', 'Marine', 'HVAC'],
      link: '/manufacturers/jiangsu-pioneer-machinery'
    },
    {
      id: 'lanzhou-ls',
      name: 'Lanzhou LS Heavy Equipment Co., Ltd.',
      rating: '4.9',
      ratingLabel: 'Heavy Industry',
      location: 'Gansu, China',
      verified: true,
      description: 'State-owned enterprise specializing in extra-large heat exchangers for Oil & Gas and Petrochemical refineries. ASME U-Stamp holder.',
      tags: ['Shell & Tube', 'High Pressure', 'Heavy Equipment'],
      link: '/manufacturers/lanzhou-ls-heavy-equipment'
    }
  ]

  return (
    <>
      <Head>
        <title>Verified Manufacturer Directory - China Heat Exchanger Directory</title>
        <meta name="description" content="Browse our curated list of verified Chinese heat exchanger manufacturers. Filter by capabilities, certifications, and analyst ratings." />
      </Head>

      <main className="min-h-screen bg-background">

        {/* Simple Hero */}
        <section className="py-16 bg-zinc-950 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 mb-6">
              <BadgeCheck className="w-4 h-4" /> 100% Analyst Verified
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Find Your Ideal Supplier
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              We don't list everyone. We only list verified factories with proven track records in export and engineering.
            </p>
          </div>
        </section>

        {/* Directory List */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid gap-6">
              {manufacturers.map((company) => (
                <div key={company.id} className="group bg-card border rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-primary/50 transition-all flex flex-col md:flex-row gap-6">

                  {/* Icon / Logo Placeholder */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center border text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <Building2 className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold truncate pr-4 text-foreground group-hover:text-primary transition-colors">
                        {company.name}
                      </h3>
                      {company.verified && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-100 dark:border-green-900 shrink-0 width-fit">
                          <BadgeCheck className="w-3.5 h-3.5" /> VERIFIED
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-500" />
                        {company.rating}
                        <span className="text-muted-foreground font-normal">({company.ratingLabel})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm line-clamp-2">
                      {company.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {company.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium border text-foreground/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col justify-center shrink-0">
                    <Button className="w-full md:w-auto rounded-full group-hover:bg-primary" asChild>
                      <a href={company.link}>
                        View Profile
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
