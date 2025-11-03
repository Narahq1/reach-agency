import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, MessageSquare, FileText, Settings } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Bem-vindo, {user?.name}!</h1>
          <p className="text-muted-foreground">Gerencie seus projetos e acompanhe o desempenho do seu marketing digital.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={<Plus size={24} />}
            title="Novo Cliente"
            description="Adicionar um novo cliente"
            onClick={() => navigate("/dashboard/novo-cliente")}
          />
          <QuickActionCard
            icon={<MessageSquare size={24} />}
            title="Mensagens"
            description="Ver suas mensagens"
            onClick={() => navigate("/dashboard/mensagens")}
          />
          <QuickActionCard
            icon={<FileText size={24} />}
            title="Relatórios"
            description="Acompanhar relatórios"
            onClick={() => navigate("/dashboard/relatorios")}
          />
          <QuickActionCard
            icon={<Settings size={24} />}
            title="Configurações"
            description="Gerenciar perfil"
            onClick={() => navigate("/dashboard/configuracoes")}
          />
        </div>

        {/* Clients Section */}
        <ClientsSection />

        {/* Recent Activity */}
        <RecentActivitySection />
      </div>
    </DashboardLayout>
  );
}

function QuickActionCard({ icon, title, description, onClick }: any) {
  return (
    <Card className="glass border-border cursor-pointer hover:border-accent/50 transition" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="text-accent mb-3">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ClientsSection() {
  const { data: clients, isLoading } = trpc.clientData.getMyClients.useQuery();

  return (
    <Card className="glass border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Meus Clientes</CardTitle>
            <CardDescription>Gerencie seus clientes e projetos</CardDescription>
          </div>
          <Button size="sm" className="btn-primary">
            <Plus size={16} className="mr-2" />
            Novo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="p-4 bg-card/50 rounded-lg border border-border hover:border-accent/50 transition">
                <h4 className="font-semibold mb-1">{client.companyName}</h4>
                <p className="text-sm text-muted-foreground mb-3">{client.industry || 'Sem categoria'}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Ver Detalhes</Button>
                  <Button size="sm" variant="outline">Mensagens</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Você ainda não tem clientes cadastrados.</p>
            <Button className="btn-primary">
              <Plus size={16} className="mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivitySection() {
  return (
    <Card className="glass border-border">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas atualizações e eventos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ActivityItem
            title="Novo relatório disponível"
            description="Relatório de Agosto foi publicado"
            time="Há 2 dias"
          />
          <ActivityItem
            title="Mensagem recebida"
            description="Você recebeu uma nova mensagem da equipe"
            time="Há 5 dias"
          />
          <ActivityItem
            title="Cliente adicionado"
            description="Novo cliente cadastrado no sistema"
            time="Há 1 semana"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, description, time }: any) {
  return (
    <div className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
