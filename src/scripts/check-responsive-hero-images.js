import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const websitesDir = path.join(projectRoot, 'public', 'static', 'websites');
const heroNames = [
  'home-hero',
  'manufacturers-hero',
  'product-hero',
  'about-hero',
  'contact-hero',
];
const widths = [768, 1280, 1920];
const formats = ['webp', 'avif'];
const sourceFiles = [
  path.join(projectRoot, 'src', 'components', 'ui', 'page-hero.tsx'),
  path.join(projectRoot, 'src', 'pages', 'home', 'components', 'HeroSection.tsx'),
  path.join(projectRoot, 'src', 'pages', 'about', 'components', 'AboutHero.tsx'),
  path.join(projectRoot, 'src', 'pages', 'contact', 'components', 'ContactHero.tsx'),
];
const responsiveHeroComponent = path.join(projectRoot, 'src', 'components', 'ui', 'responsive-hero-image.tsx');

const failures = [];

for (const heroName of heroNames) {
  const originalPath = path.join(websitesDir, `${heroName}.png`);

  if (!fs.existsSync(originalPath)) {
    failures.push(`Missing original hero image: ${originalPath}`);
    continue;
  }

  const originalSize = fs.statSync(originalPath).size;

  for (const width of widths) {
    for (const format of formats) {
      const candidatePath = path.join(websitesDir, `${heroName}-${width}.${format}`);

      if (!fs.existsSync(candidatePath)) {
        failures.push(`Missing responsive variant: ${candidatePath}`);
        continue;
      }

      const candidateSize = fs.statSync(candidatePath).size;

      if (candidateSize <= 0) {
        failures.push(`Empty responsive variant: ${candidatePath}`);
      }

      if (candidateSize >= originalSize) {
        failures.push(`Variant is not smaller than original: ${candidatePath}`);
      }
    }
  }
}

for (const sourceFile of sourceFiles) {
  const source = fs.readFileSync(sourceFile, 'utf8');

  if (!source.includes('ResponsiveHeroImage')) {
    failures.push(`Missing ResponsiveHeroImage usage/import in ${sourceFile}`);
  }
}

const responsiveHeroSource = fs.readFileSync(responsiveHeroComponent, 'utf8');

if (!responsiveHeroSource.includes('import.meta.env.SSR')) {
  failures.push('ResponsiveHeroImage preload must be gated to Vite SSR so hydration does not insert late duplicate preload links.');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Responsive hero image assets and component usage verified.');
