import { ArrowRight, Check, Play, Sparkles } from 'lucide-react'

const benefits = [
  {
    title: 'Baixador em massa',
    description: 'Baixe centenas de vídeos de uma vez e organize seu acervo sem trabalho repetitivo.',
  },
  {
    title: 'Mentoria completa',
    description: 'Aprenda o processo do zero em aulas diretas, com cada etapa explicada.',
  },
  {
    title: 'Fundos editáveis no Canva',
    description: 'Use templates prontos para criar vídeos consistentes com a identidade do seu perfil.',
  },
  {
    title: 'Planilha de nichos',
    description: 'Encontre ideias de conteúdo e oportunidades para testar com mais velocidade.',
  },
  {
    title: 'Método de monetização',
    description: 'Estruture sua página para transformar audiência em uma operação previsível.',
  },
  {
    title: 'Grupo de networking',
    description: 'Troque experiências, referências e aprendizados com outros criadores.',
  },
]

export const metadata = {
  title: 'Automa Dark | Aula gratuita',
  description: 'Aprenda a criar e operar um perfil dark sem precisar aparecer.',
}

export default function AutomaDarkPage() {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#080808] text-[#f8f4e9] selection:bg-[#f3c552] selection:text-black">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Automa Dark início">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f3c552] text-sm font-black text-black">
              AD
            </span>
            <span className="text-sm font-black uppercase tracking-[0.24em] text-white">
              Automa Dark
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex" aria-label="Navegação principal">
            <a className="transition hover:text-[#f3c552]" href="#bonus">
              Bônus
            </a>
            <a className="transition hover:text-[#f3c552]" href="#metodo">
              O método
            </a>
            <a className="transition hover:text-[#f3c552]" href="#oferta">
              Oferta
            </a>
          </nav>

          <a
            href="#oferta"
            className="inline-flex items-center gap-2 rounded-full bg-[#f3c552] px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#ffe18b]"
          >
            Começar agora
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(243,197,82,0.13),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(255,255,255,0.05),transparent_22%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f3c552]/40 bg-[#f3c552]/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f3c552]">
                <Sparkles size={14} aria-hidden="true" />
                Aula gratuita liberada
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-6xl">
                Como automatizar e ganhar dinheiro com um perfil que não aparece
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
                Um programa para criar vídeos prontos, publicar com consistência e construir uma
                operação digital sem gravar, sem aparecer e sem precisar dominar edição.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#oferta"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f3c552] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-[#ffe18b]"
                >
                  Quero começar agora
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a
                  href="#metodo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:border-[#f3c552] hover:text-[#f3c552]"
                >
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  Ver como funciona
                </a>
              </div>

              <p className="mt-5 text-xs text-white/40">
                Acesso imediato à aula gratuita. Conteúdo direto, sem enrolação.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-3 rounded-[2rem] border border-[#f3c552]/20 bg-[#f3c552]/5 blur-sm" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#141414] p-3 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  <span>Editor Automa Dark</span>
                  <span className="text-[#f3c552]">Acesso liberado</span>
                </div>
                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-2xl bg-[#201f1b]">
                  {/* The reference site exposes this asset publicly and it is used as the visual anchor. */}
                  <img
                    src="https://automadark.com/images/logo-metodo.png"
                    alt="Editor Automa Dark"
                    className="h-full w-full object-cover object-center opacity-90"
                  />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between rounded-xl border border-white/15 bg-black/65 p-4 backdrop-blur-md">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f3c552]">
                        Seu próximo passo
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">Publicar sem aparecer</p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f3c552] text-black">
                      <Play size={16} fill="currentColor" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metodo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3c552]">O método</p>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-5xl">
                Menos edição. Mais consistência. Um processo que você consegue repetir.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/60">
              Você recebe as ferramentas e o caminho para sair da ideia e chegar a uma rotina de
              conteúdo. A proposta é simplificar a operação para que a sua energia fique no que
              realmente move o projeto.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'Escolha o nicho', 'Encontre um tema com demanda e uma linguagem que você consiga sustentar.'],
              ['02', 'Monte o conteúdo', 'Use o editor e os materiais para transformar referências em vídeos publicáveis.'],
              ['03', 'Publique e evolua', 'Observe o que funciona, refine a operação e construa sua audiência.'],
            ].map(([number, title, description]) => (
              <article key={number} className="border-t border-white/15 pt-5">
                <span className="text-sm font-black text-[#f3c552]">{number}</span>
                <h3 className="mt-8 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="bonus" className="border-y border-white/10 bg-[#101010]">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3c552]">Bônus ao adquirir</p>
              <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">
                Ferramentas para acelerar o começo
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Um pacote pensado para reduzir o tempo entre aprender e colocar a primeira versão
                no ar.
              </p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="bg-[#101010] p-7 transition hover:bg-[#171717]">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f3c552]/10 text-[#f3c552]">
                    <Check size={18} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-black text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="oferta" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid overflow-hidden rounded-[2rem] border border-[#f3c552]/30 bg-[#f3c552] text-black lg:grid-cols-[1fr_0.7fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">Comece pelo plano mais barato</p>
              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight sm:text-5xl">
                Acesso direto ao método Automa Dark
              </h2>
              <ul className="mt-8 grid gap-3 text-sm font-bold sm:grid-cols-2">
                {['Programa completo', 'Suporte no WhatsApp', 'Atualizações para sempre', 'Bônus incluídos'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={16} strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center bg-black p-8 text-white sm:p-12 lg:p-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3c552]">Plano iniciante</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-lg text-white/45 line-through">R$ 297,00</span>
                <span className="text-5xl font-black text-[#f3c552]">R$ 109,50</span>
              </div>
              <p className="mt-3 text-sm text-white/55">ou 12x de R$ 10,99 sem juros</p>
              <a
                href="#inicio"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#f3c552] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-[#ffe18b]"
              >
                Quero acessar
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <p className="mt-4 text-center text-xs text-white/40">Compra e já sai usando.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/40">
        <p>Automa Dark · Conteúdo e ferramentas para construir sua operação digital.</p>
      </footer>
    </div>
  )
}

