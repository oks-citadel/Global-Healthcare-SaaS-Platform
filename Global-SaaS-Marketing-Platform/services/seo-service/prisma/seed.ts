import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SEO Service database...');

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'Demo Company',
      domain: 'demo.example.com',
      defaultLocale: 'en',
      supportedLocales: ['en', 'es', 'fr', 'de'],
      isActive: true,
    },
  });

  console.log(`Created tenant: ${tenant.name}`);

  // Create demo pages
  const pages = [
    { slug: 'home', title: 'Welcome to Demo Company | Enterprise Solutions', metaDescription: 'Demo Company provides enterprise-grade solutions for modern businesses.' },
    { slug: 'about', title: 'About Us | Demo Company', metaDescription: 'Learn about Demo Company, our mission, and our team.' },
    { slug: 'products', title: 'Our Products | Demo Company', metaDescription: 'Explore our range of enterprise products and solutions.' },
    { slug: 'pricing', title: 'Pricing Plans | Demo Company', metaDescription: 'Find the perfect plan for your business. Start free today.' },
    { slug: 'contact', title: 'Contact Us | Demo Company', metaDescription: 'Get in touch with our team. We are here to help.' },
    { slug: 'blog', title: 'Blog | Demo Company', metaDescription: 'Read our latest articles on industry trends and best practices.' },
  ];

  for (const pageData of pages) {
    for (const locale of tenant.supportedLocales) {
      await prisma.page.upsert({
        where: {
          tenantId_slug_locale: {
            tenantId: tenant.id,
            slug: pageData.slug,
            locale,
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          slug: pageData.slug,
          locale,
          title: pageData.title,
          metaDescription: pageData.metaDescription,
          metaKeywords: [pageData.slug, 'demo', 'enterprise'],
          ogTitle: pageData.title,
          ogDescription: pageData.metaDescription,
          ogType: 'website',
          twitterCard: 'summary_large_image',
          robotsDirectives: 'index, follow',
          priority: pageData.slug === 'home' ? 1.0 : 0.8,
          changeFrequency: pageData.slug === 'blog' ? 'DAILY' : 'WEEKLY',
          isPublished: true,
          isIndexable: true,
        },
      });
    }
  }

  console.log(`Created ${pages.length * tenant.supportedLocales.length} pages`);

  // Create robots config
  await prisma.robotsConfig.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      userAgentRules: [
        { userAgent: '*', allow: ['/'], disallow: ['/admin/', '/api/', '/private/'] },
        { userAgent: 'Googlebot', allow: ['/'], disallow: [] },
      ],
      sitemapUrls: [`https://${tenant.domain}/sitemap.xml`],
      crawlDelay: 1,
    },
  });

  console.log('Created robots config');

  // Create manifest config
  await prisma.manifestConfig.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      name: tenant.name,
      shortName: 'Demo',
      description: 'Demo Company Enterprise Platform',
      startUrl: '/',
      display: 'standalone',
      backgroundColor: '#ffffff',
      themeColor: '#0066cc',
      orientation: 'portrait-primary',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      lang: 'en',
      dir: 'ltr',
      categories: ['business', 'productivity'],
    },
  });

  console.log('Created manifest config');

  // Create structured data templates
  const templates = [
    {
      name: 'Organization',
      schemaType: 'Organization',
      template: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '{{name}}',
        url: '{{url}}',
        logo: '{{logo}}',
        sameAs: '{{socialProfiles}}',
      },
    },
    {
      name: 'Product',
      schemaType: 'Product',
      template: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: '{{name}}',
        description: '{{description}}',
        image: '{{image}}',
        offers: {
          '@type': 'Offer',
          price: '{{price}}',
          priceCurrency: '{{currency}}',
        },
      },
    },
    {
      name: 'FAQ Page',
      schemaType: 'FAQPage',
      template: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: '{{questions}}',
      },
    },
  ];

  for (const tpl of templates) {
    await prisma.structuredDataTemplate.upsert({
      where: { id: tpl.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: tpl.name.toLowerCase().replace(/\s/g, '-'),
        name: tpl.name,
        schemaType: tpl.schemaType,
        template: tpl.template,
        isDefault: true,
        isActive: true,
      },
    });
  }

  console.log(`Created ${templates.length} structured data templates`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
