import { Head } from 'vite-react-ssg'
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";
import { ArrowRight, Layers, Settings, Maximize2, Shield, Thermometer, Box } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface ProductCategory {
    id: string;
    name: string;
    shortDescription: string;
    image: string;
}

export default function ProductsPage() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.products" });
    const currentLanguage = useCurrentLanguage();
    
    // Explicitly defining the icon map since they are static
    const iconMap: Record<string, React.ReactNode> = {
        'gasketed_phe': <Layers className="w-8 h-8 text-primary" />,
        'welded_phe': <Shield className="w-8 h-8 text-primary" />,
        'brazed_phe': <Maximize2 className="w-8 h-8 text-primary" />,
        'shell_tube': <Box className="w-8 h-8 text-primary" />,
        'air_cooled': <Thermometer className="w-8 h-8 text-primary" />,
        'spares': <Settings className="w-8 h-8 text-primary" />
    };

    // Safely parse the categories from translation JSON list
    const listObj = t("list", { returnObjects: true }) as { title: string, description: string, categories: ProductCategory[] };
    const categories = listObj?.categories || [];

    return (
        <>
            <Head>
                <title>{t("title")} | Industrial Heat Exchangers</title>
                <meta name="description" content={t("description")} />
            </Head>

            <main className="min-h-screen bg-background pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-slate-900 py-24 px-6 md:px-12">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
                    <div className="absolute inset-0 bg-[url('/static/websites/pattern-dots.png')] mix-blend-overlay opacity-20" />
                    
                    <div className="relative max-w-6xl mx-auto z-10 flex flex-col items-center text-center">
                        <Badge className="mb-6 bg-primary/20 text-blue-300 border-none px-4 py-1.5 backdrop-blur-md">
                            Premium Heat Transfer Solutions
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight max-w-4xl">
                            {t("title")}
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl leading-relaxed mb-10">
                            {t("description")}
                        </p>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link 
                                key={category.id} 
                                to={addLanguageToPath(`/products/${category.id}`, currentLanguage)}
                                className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Image Area */}
                                <div className="h-56 overflow-hidden bg-slate-100 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {category.image ? (
                                        <img 
                                            src={category.image} 
                                            alt={category.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="text-slate-400">No Image Available</div>
                                    )}
                                    <div className="absolute bottom-4 right-4 z-20 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                
                                {/* Content Area */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="mb-4">
                                        {iconMap[category.id] || <Layers className="w-8 h-8 text-primary" />}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed flex-1">
                                        {category.shortDescription}
                                    </p>
                                    
                                    <div className="mt-8 flex items-center text-sm font-semibold text-primary">
                                        Explore Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-6 md:px-12 mt-24">
                   <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border border-blue-800">
                       <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none" />
                       <div className="absolute bottom-0 left-0 p-32 bg-orange-500/10 rounded-full blur-[100px] -ml-16 -mb-16 pointer-events-none" />
                       
                       <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                           Not Sure Which Product You Need?
                       </h2>
                       <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                           Our interactive RFQ tool helps you specify your application parameters, and we'll match you with verified manufacturers who produce the exact heat exchanger you need.
                       </p>
                       <Button size="lg" className="relative z-10 text-lg h-14 px-8 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 shadow-xl hover:scale-105 transition-all text-white font-bold rounded-full" asChild>
                           <Link to={addLanguageToPath("/rfq", currentLanguage)}>
                               Build Request for Quote Now
                           </Link>
                       </Button>
                   </div>
                </section>
            </main>
        </>
    );
}
