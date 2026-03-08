const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const langs = ['en', 'zh', 'ja'];
const productSlugs = {
  'gasketed_phe': 'gasketed-phe',
  'welded_phe': 'welded-phe',
  'brazed_phe': 'brazed-phe',
  'shell_tube': 'shell-and-tube',
  'air_cooled': 'air-cooled',
  'spares': 'spares'
};

// 1. Convert products.json into products/list.json & products/[slug].json
langs.forEach(lang => {
  const oldJsonPath = path.join(srcDir, 'locales', lang, 'pages', 'products.json');
  const productsDir = path.join(srcDir, 'locales', lang, 'pages', 'products');
  
  if (fs.existsSync(oldJsonPath)) {
    const data = JSON.parse(fs.readFileSync(oldJsonPath, 'utf8'));
    fs.mkdirSync(productsDir, { recursive: true });
    
    // Create list.json as an Array
    const listData = {
      title: data.title,
      description: data.description,
      categories: Object.keys(data.categories).map(key => ({
        id: productSlugs[key],
        name: data.categories[key].name,
        shortDescription: data.categories[key].shortDescription,
        image: data.categories[key].image
      }))
    };
    fs.writeFileSync(path.join(productsDir, 'list.json'), JSON.stringify(listData, null, 4));
    
    // Create individual component files
    Object.keys(data.categories).forEach(key => {
      const slug = productSlugs[key];
      const productData = { ...data.categories[key], id: slug };
      fs.writeFileSync(path.join(productsDir, `${slug}.json`), JSON.stringify(productData, null, 4));
    });
    
    // Remove old file
    fs.unlinkSync(oldJsonPath);
  }

  // 1.5 Update manufacturer list.json mapping
  const mListPath = path.join(srcDir, 'locales', lang, 'pages', 'manufacturers', 'list.json');
  if (fs.existsSync(mListPath)) {
    let mData = JSON.parse(fs.readFileSync(mListPath, 'utf8'));
    mData = mData.map(m => {
        if(m.product_categories) {
            m.product_categories = m.product_categories.map(cat => productSlugs[cat] || cat);
        }
        return m;
    });
    fs.writeFileSync(mListPath, JSON.stringify(mData, null, 4));
  }
});

// 2. Generate new React page structures (`/products/[slug]/index.tsx`)
const pagesDir = path.join(srcDir, 'pages', 'products');
const templatePath = path.join(pagesDir, '[id].tsx');
if (fs.existsSync(templatePath)) {
  fs.unlinkSync(templatePath);
}

Object.values(productSlugs).forEach(slug => {
  const dir = path.join(pagesDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  
  // Create React Pages for each item pointing to the individual JSON
  const pageCode = `import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, Factory } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCurrentLanguage, addLanguageToPath } from "../../../utils/language-routing";

interface ProductCategory {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    applications: string[];
    features: string[];
    image: string;
}

interface Manufacturer {
    id: string;
    name: string;
    location: string;
    verified: boolean;
    description: string;
    tags: string[];
    product_categories?: string[];
    link: string;
    rating?: string;
    ratingLabel?: string;
}

export default function Product_${slug.replace(/-/g, '_')}Page() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();

    const categoryObj = t("pages.products.${slug}", { returnObjects: true }) as ProductCategory;
    const allManufacturers = t("pages.manufacturers.list", { returnObjects: true }) as Manufacturer[];

    if (!categoryObj || !categoryObj.id) return null;

    const matchingManufacturers = allManufacturers.filter(m => 
        m.product_categories && m.product_categories.includes("${slug}")
    );

    return (
        <>
            <Head>
                <title>{categoryObj.name} | Industrial Heat Exchanger Products</title>
                <meta name="description" content={categoryObj.shortDescription} />
            </Head>

            <main className="min-h-screen bg-background pb-20">
                <div className="bg-slate-900 pt-24 pb-8 px-6 md:px-12 border-b border-white/10 relative">
                     <div className="absolute inset-0 bg-[url('/static/websites/pattern-dots.png')] mix-blend-overlay opacity-10" />
                     <div className="max-w-6xl mx-auto relative z-10">
                        <Button variant="ghost" className="text-slate-400 hover:text-white mb-6 -ml-4" asChild>
                            <Link to={addLanguageToPath("/products", currentLanguage)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t("navigation.breadcrumb.products", { defaultValue: "Back to Products" })}
                            </Link>
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{categoryObj.name}</h1>
                        <p className="text-xl text-blue-200 max-w-3xl">{categoryObj.shortDescription}</p>
                     </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-8 space-y-12">
                         <section>
                             <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
                                 <span className="w-8 h-1 bg-primary rounded-full mr-4"></span>
                                 Overview
                             </h2>
                             <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                                 {categoryObj.description}
                             </p>
                         </section>

                         {categoryObj.image && (
                             <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-xl border border-border/50">
                                 <img src={categoryObj.image} alt={categoryObj.name} className="w-full h-auto max-h-[400px] object-cover" />
                             </div>
                         )}

                         <div className="grid sm:grid-cols-2 gap-8">
                             {categoryObj.features && categoryObj.features.length > 0 && (
                                 <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                                     <h3 className="text-lg font-bold mb-4 flex items-center text-card-foreground">
                                         Key Advantages
                                     </h3>
                                     <ul className="space-y-3">
                                         {categoryObj.features.map((feature, i) => (
                                             <li key={i} className="flex items-start text-muted-foreground">
                                                 <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" />
                                                 <span className="leading-snug">{feature}</span>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}

                             {categoryObj.applications && categoryObj.applications.length > 0 && (
                                 <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                                     <h3 className="text-lg font-bold mb-4 flex items-center text-card-foreground">
                                         Ideal Applications
                                     </h3>
                                     <ul className="space-y-3">
                                         {categoryObj.applications.map((app, i) => (
                                             <li key={i} className="flex items-start text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mr-3 mt-2"></span>
                                                 <span className="leading-snug">{app}</span>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}
                         </div>
                     </div>

                     <div className="lg:col-span-4">
                         <div className="sticky top-28 bg-card border border-border/50 rounded-2xl p-6 shadow-xl">
                             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                     <Factory className="w-6 h-6" />
                                 </div>
                                 <div>
                                     <h3 className="text-lg font-bold leading-tight">Verified Manufacturers</h3>
                                     <p className="text-sm text-muted-foreground">Certified Producers</p>
                                 </div>
                             </div>

                             {matchingManufacturers.length > 0 ? (
                                 <div className="space-y-4">
                                     {matchingManufacturers.map(manufacturer => (
                                         <Link 
                                             key={manufacturer.id} 
                                             to={addLanguageToPath(manufacturer.link, currentLanguage)}
                                             className="block p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/20 transition-all group"
                                         >
                                             <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors text-sm mb-1">{manufacturer.name}</h4>
                                             <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    {manufacturer.ratingLabel && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-sm">{manufacturer.ratingLabel}</span>}
                                                </span>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs pr-0 group-hover:text-primary">
                                                    Profile <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                                </Button>
                                             </div>
                                         </Link>
                                     ))}
                                 </div>
                             ) : (
                                 <p className="text-sm text-muted-foreground">No verified manufacturers found for this specific category yet.</p>
                             )}

                             <div className="mt-8 pt-6 border-t border-border/50">
                                 <p className="text-sm text-muted-foreground mb-4 text-center">Can't decide? Let us match you.</p>
                                 <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 transition-opacity font-bold shadow-md" asChild>
                                     <Link to={addLanguageToPath("/rfq?product=${slug}", currentLanguage)}>
                                         Get Custom Quotes
                                     </Link>
                                 </Button>
                             </div>
                         </div>
                     </div>
                </div>
            </main>
        </>
    );
}`;
  fs.writeFileSync(path.join(dir, 'index.tsx'), pageCode);
});

console.log('Restructuring completed.');
