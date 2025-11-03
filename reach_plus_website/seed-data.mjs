import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Insert services
const services = [
  {
    name: 'Gestão de Tráfego Pago',
    slug: 'gestao-trafego-pago',
    description: 'Campanhas estratégicas em Google Ads, Facebook e Instagram para maximizar seu ROI',
    icon: 'TrendingUp',
    features: JSON.stringify(['Google Ads', 'Facebook Ads', 'Instagram Ads', 'Otimização de Conversão']),
  },
  {
    name: 'SEO e Conteúdo',
    slug: 'seo-conteudo',
    description: 'Estratégias de posicionamento orgânico e criação de conteúdo de alto impacto',
    icon: 'Search',
    features: JSON.stringify(['Pesquisa de Palavras-chave', 'Otimização On-page', 'Link Building', 'Content Marketing']),
  },
  {
    name: 'Branding e Design',
    slug: 'branding-design',
    description: 'Identidade visual completa e estratégia de marca para seu negócio',
    icon: 'Palette',
    features: JSON.stringify(['Logo Design', 'Brand Guidelines', 'Design Gráfico', 'UI/UX Design']),
  },
  {
    name: 'Consultoria Estratégica',
    slug: 'consultoria-estrategica',
    description: 'Análise completa e planejamento estratégico do seu marketing digital',
    icon: 'Lightbulb',
    features: JSON.stringify(['Auditoria Digital', 'Planejamento Estratégico', 'Análise Competitiva', 'Relatórios Mensais']),
  },
];

for (const service of services) {
  await connection.execute(
    'INSERT INTO services (name, slug, description, icon, features) VALUES (?, ?, ?, ?, ?)',
    [service.name, service.slug, service.description, service.icon, service.features]
  );
}

// Insert portfolio items
const portfolioItems = [
  {
    title: 'E-commerce de Moda',
    description: 'Transformação digital completa de loja de moda',
    category: 'E-commerce',
    resultMetric: '+150% ROI',
    resultDescription: 'Aumento significativo em conversões através de otimização de campanhas e redesign do site',
    clientName: 'Fashion Store XYZ',
    featured: true,
  },
  {
    title: 'SaaS B2B Growth',
    description: 'Estratégia de crescimento para plataforma SaaS',
    category: 'SaaS',
    resultMetric: '+80% Tráfego',
    resultDescription: 'Crescimento orgânico através de SEO e content marketing estratégico',
    clientName: 'Tech Solutions Inc',
    featured: true,
  },
  {
    title: 'Agência Imobiliária Digital',
    description: 'Presença digital e geração de leads para agência imobiliária',
    category: 'Imobiliário',
    resultMetric: '+120% Conversão',
    resultDescription: 'Aumento de leads qualificados através de campanhas direcionadas',
    clientName: 'Imóveis Premium',
    featured: true,
  },
];

for (const item of portfolioItems) {
  await connection.execute(
    'INSERT INTO portfolioItems (title, description, category, resultMetric, resultDescription, clientName, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [item.title, item.description, item.category, item.resultMetric, item.resultDescription, item.clientName, item.featured]
  );
}

console.log('✓ Dados de exemplo inseridos com sucesso!');
await connection.end();
