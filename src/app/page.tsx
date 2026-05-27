import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, BarChart3, MessageSquare, FileText, Bell, Monitor, Eye } from "lucide-react";

const features = [
  {
    title: "Totem de Avaliação",
    desc: "Interface touch-screen para coleta de satisfação em tempo real nos pontos de atendimento.",
    icon: Monitor,
    href: "/totem",
  },
  {
    title: "Dashboard Gerencial",
    desc: "Indicadores de desempenho, gráficos de evolução e ranking de unidades em tempo real.",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Relatórios Exportáveis",
    desc: "Geração de relatórios em CSV e JSON com filtros personalizados para análise dos dados.",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    title: "Moderação de Comentários",
    desc: "Gestão e moderação dos feedbacks dos cidadãos com análise de sentimento.",
    icon: MessageSquare,
    href: "/dashboard/comments",
  },
  {
    title: "Alertas Inteligentes",
    desc: "Configuração de alertas para monitorar quedas de satisfação e outros indicadores críticos.",
    icon: Bell,
    href: "/dashboard/alerts",
  },
  {
    title: "Portal da Transparência",
    desc: "Indicadores públicos de satisfação dos serviços prestados à população.",
    icon: Eye,
    href: "/transparency",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">GovMetrics</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
              Entrar
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: "outline" }))}>
              Cadastro
            </Link>
            <Link href="/transparency" className={cn(buttonVariants())}>
              Transparência
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Avaliação de Serviços Públicos
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Plataforma cidadã para coleta e análise de satisfação dos serviços públicos municipais.
              Acompanhe em tempo real a qualidade do atendimento prestado à população.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/totem" className={cn(buttonVariants({ size: "lg" }))}>
                Acessar Totem
              </Link>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Painel Gerencial
              </Link>
              <Link href="/transparency" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Transparência
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Módulos da Plataforma</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <f.icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{f.desc}</CardDescription>
                    <Link
                      href={f.href}
                      className={cn(buttonVariants({ variant: "link" }), "mt-3 h-auto p-0")}
                    >
                      Acessar &rarr;
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <p>GovMetrics — Plataforma de Avaliação de Serviços Públicos</p>
        </div>
      </footer>
    </div>
  );
}
