import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Menu, X, ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const { data: services } = trpc.public.getServices.useQuery();
  const { data: portfolio } = trpc.public.getPortfolio.useQuery({ featured: true, limit: 3 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="w-8 h-8" />}
            <span className="text-xl font-bold" style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{APP_TITLE}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="hover:text-accent transition">Serviços</a>
            <a href="#portfolio" className="hover:text-accent transition">Portfólio</a>
            <a href="#contato" className="hover:text-accent transition">Contato</a>
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()} size="sm">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border p-4 space-y-4">
            <a href="#servicos" className="block hover:text-accent transition">Serviços</a>
            <a href="#portfolio" className="block hover:text-accent transition">Portfólio</a>
            <a href="#contato" className="block hover:text-accent transition">Contato</a>
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
                Login
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-overlay pointer-events-none" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Elevando o Seu Marketing ao Próximo Nível
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Estratégias inovadoras e tecnologia de ponta para resultados reais. Transformamos seu potencial digital em crescimento sustentável.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                Solicitar Orçamento <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="btn-outline" onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}>
                Conhecer Serviços
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="section-padding bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Nossos Serviços</h2>
          
          {services ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="glass border-border hover:border-accent/50 transition">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-accent/10 to-secondary/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">150%</div>
              <p className="text-muted-foreground">Aumento médio de ROI</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">80+</div>
              <p className="text-muted-foreground">Clientes satisfeitos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">5+</div>
              <p className="text-muted-foreground">Anos de experiência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Resultados que Falam por Si</h2>
          
          {portfolio ? (
            <div className="grid md:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <Card key={item.id} className="glass border-border overflow-hidden hover:border-accent/50 transition">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="text-2xl font-bold text-accent mb-2">{item.resultMetric}</div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.clientName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.resultDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Por Que Escolher Reach+?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-lg border border-border">
              <Zap className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Inovação</h3>
              <p className="text-muted-foreground">Uso constante de novas tecnologias e tendências de mercado para manter você sempre à frente.</p>
            </div>
            <div className="glass p-8 rounded-lg border border-border">
              <Users className="text-secondary mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Profissionalismo</h3>
              <p className="text-muted-foreground">Equipe certificada e focada em excelência em cada projeto e estratégia.</p>
            </div>
            <div className="glass p-8 rounded-lg border border-border">
              <TrendingUp className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Foco no Cliente</h3>
              <p className="text-muted-foreground">Dedicação total ao seu crescimento e metas, tratando seu sucesso como nosso sucesso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Pronto para Evoluir?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <ContactForm />
            <BudgetForm />
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Entre em Contato Direto</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>📧 contato@reachplus.agency</p>
              <p>📱 (11) 99999-9999</p>
              <p>🔗 @ReachPlusAgency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Reach+ Agency. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Seu futuro digital começa agora.</p>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const submitContact = trpc.public.submitContact.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData);
  };

  return (
    <Card className="glass border-border">
      <CardHeader>
        <CardTitle>Formulário de Contato</CardTitle>
        <CardDescription>Envie-nos uma mensagem</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted && (
          <div className="mb-4 p-3 bg-accent/20 border border-accent rounded text-accent text-sm">
            ✓ Mensagem enviada com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="tel"
            placeholder="Telefone (opcional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            placeholder="Empresa (opcional)"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            placeholder="Sua mensagem"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent h-32 resize-none"
            required
          />
          <Button type="submit" className="w-full btn-primary" disabled={submitContact.isPending}>
            {submitContact.isPending ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BudgetForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [] as string[],
    budget: '',
    timeline: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const submitBudget = trpc.public.submitBudget.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', services: [], budget: '', timeline: '', description: '' });
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBudget.mutate(formData);
  };

  return (
    <Card className="glass border-border">
      <CardHeader>
        <CardTitle>Solicitar Orçamento</CardTitle>
        <CardDescription>Descreva seu projeto</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted && (
          <div className="mb-4 p-3 bg-accent/20 border border-accent rounded text-accent text-sm">
            ✓ Orçamento solicitado com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="text"
            placeholder="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Orçamento estimado</option>
            <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
            <option value="10000-25000">R$ 10.000 - R$ 25.000</option>
            <option value="25000-50000">R$ 25.000 - R$ 50.000</option>
            <option value="50000+">R$ 50.000+</option>
          </select>
          <textarea
            placeholder="Descreva seu projeto"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent h-24 resize-none"
          />
          <Button type="submit" className="w-full btn-primary" disabled={submitBudget.isPending}>
            {submitBudget.isPending ? 'Enviando...' : 'Solicitar Orçamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
