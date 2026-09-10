/**
 * Static catalog used to generate realistic, category-consistent products.
 *
 * Faker's commerce module produces English, category-agnostic names
 * ("Handcrafted Rubber Chair"). Building names from per-category templates
 * keeps the data in pt-BR and coherent: a product in "Periféricos" is always a
 * keyboard, mouse, headset..., never a sofa. Each base product carries its own
 * price range in BRL so a mousepad never costs as much as a keyboard.
 */

export interface ProductBase {
  name: string;
  /** [min, max] price in BRL. */
  price: [number, number];
}

export interface CategoryTemplate {
  name: string;
  slug: string;
  description: string;
  products: ProductBase[];
}

function p(name: string, min: number, max: number): ProductBase {
  return { name, price: [min, max] };
}

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Celulares e smartphones das principais marcas',
    products: [
      p('Smartphone', 899, 4999),
      p('Smartphone 5G', 1499, 7999),
      p('Smartphone Dobrável', 4999, 12999),
      p('Celular Básico', 199, 599),
      p('Capa Protetora', 29, 149),
      p('Película de Vidro', 19, 79),
      p('Carregador Turbo', 59, 249),
    ],
  },
  {
    name: 'Notebooks',
    slug: 'notebooks',
    description: 'Notebooks, ultrabooks e laptops gamer',
    products: [
      p('Notebook', 1899, 5499),
      p('Ultrabook', 3499, 9999),
      p('Notebook Gamer', 4499, 15999),
      p('Chromebook', 1299, 2999),
      p('Notebook 2 em 1', 2999, 8999),
      p('Mochila para Notebook', 89, 399),
      p('Base Refrigerada', 79, 299),
    ],
  },
  {
    name: 'Periféricos',
    slug: 'perifericos',
    description: 'Teclados, mouses, headsets e acessórios para computador',
    products: [
      p('Teclado Mecânico', 199, 1299),
      p('Teclado Sem Fio', 89, 599),
      p('Mouse Gamer', 79, 699),
      p('Mouse Sem Fio', 49, 399),
      p('Headset Gamer', 129, 1199),
      p('Webcam', 99, 899),
      p('Mousepad', 19, 189),
      p('Microfone USB', 149, 1299),
      p('Hub USB-C', 59, 499),
      p('Controle Sem Fio', 149, 599),
    ],
  },
  {
    name: 'Monitores',
    slug: 'monitores',
    description: 'Monitores para trabalho, jogos e edição',
    products: [
      p('Monitor', 499, 1999),
      p('Monitor Gamer', 899, 4499),
      p('Monitor Ultrawide', 1499, 6999),
      p('Monitor 4K', 1799, 6499),
      p('Monitor Curvo', 999, 4999),
      p('Suporte para Monitor', 69, 499),
      p('Cabo HDMI 2.1', 29, 149),
    ],
  },
  {
    name: 'Áudio',
    slug: 'audio',
    description: 'Fones, caixas de som e equipamentos de áudio',
    products: [
      p('Fone de Ouvido Bluetooth', 99, 1499),
      p('Fone Intra-auricular', 59, 899),
      p('Fone com Cancelamento de Ruído', 299, 3499),
      p('Caixa de Som Bluetooth', 99, 1299),
      p('Soundbar', 399, 3499),
      p('Caixa de Som Portátil', 79, 799),
      p('Interface de Áudio', 399, 2499),
    ],
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Automação residencial e dispositivos inteligentes',
    products: [
      p('Lâmpada Inteligente', 49, 199),
      p('Assistente de Voz', 199, 899),
      p('Câmera de Segurança Wi-Fi', 149, 899),
      p('Tomada Inteligente', 59, 179),
      p('Fechadura Digital', 399, 2499),
      p('Robô Aspirador', 899, 3999),
      p('Sensor de Presença', 69, 249),
    ],
  },
  {
    name: 'Games',
    slug: 'games',
    description: 'Consoles, jogos e acessórios gamer',
    products: [
      p('Console', 2499, 5499),
      p('Console Portátil', 1499, 4499),
      p('Controle', 249, 699),
      p('Volante com Pedais', 899, 3999),
      p('Cadeira Gamer', 699, 2999),
      p('Headset para Console', 199, 1299),
      p('Jogo', 149, 349),
    ],
  },
  {
    name: 'Casa e Escritório',
    slug: 'casa-e-escritorio',
    description: 'Móveis e itens para home office',
    products: [
      p('Cadeira de Escritório', 399, 2999),
      p('Mesa para Escritório', 299, 2499),
      p('Luminária de Mesa', 59, 399),
      p('Suporte para Notebook', 39, 249),
      p('Organizador de Cabos', 19, 89),
      p('Estante', 199, 1499),
      p('Apoio para os Pés', 49, 199),
    ],
  },
  {
    name: 'Armazenamento',
    slug: 'armazenamento',
    description: 'SSDs, HDs e pendrives',
    products: [
      p('SSD', 199, 899),
      p('SSD NVMe', 299, 1899),
      p('HD Externo', 249, 999),
      p('Pendrive', 29, 199),
      p('Cartão de Memória', 39, 299),
      p('SSD Externo', 349, 1499),
      p('Case para HD', 49, 199),
    ],
  },
  {
    name: 'Redes',
    slug: 'redes',
    description: 'Roteadores, repetidores e cabos',
    products: [
      p('Roteador Wi-Fi 6', 299, 1499),
      p('Repetidor de Sinal', 99, 399),
      p('Roteador Mesh', 599, 2499),
      p('Switch Gigabit', 129, 899),
      p('Cabo de Rede', 19, 99),
      p('Adaptador Wi-Fi USB', 49, 249),
    ],
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smartwatches e pulseiras inteligentes',
    products: [
      p('Smartwatch', 299, 3499),
      p('Pulseira Inteligente', 99, 499),
      p('Relógio Esportivo', 599, 4999),
      p('Óculos de Realidade Virtual', 1499, 4999),
      p('Pulseira de Reposição', 29, 149),
    ],
  },
  {
    name: 'Câmeras',
    slug: 'cameras',
    description: 'Câmeras, lentes e acessórios fotográficos',
    products: [
      p('Câmera Mirrorless', 3499, 12999),
      p('Câmera de Ação', 599, 2999),
      p('Lente', 899, 8999),
      p('Tripé', 89, 799),
      p('Drone com Câmera', 1499, 9999),
      p('Estabilizador', 399, 2499),
      p('Bateria Extra', 99, 499),
    ],
  },
];

export const BRANDS = [
  'Nexora',
  'Vortex',
  'Aurion',
  'Lumina',
  'Kairo',
  'Zenith',
  'Orbita',
  'Solaris',
  'Praxis',
  'Helix',
  'Novato',
  'Tessera',
];

export const PRODUCT_MODIFIERS = ['Pro', 'Max', 'Plus', 'Lite', 'Ultra', 'Prime', 'Elite', 'Air', 'Neo', 'Edge'];

export const FEATURES = [
  'design compacto',
  'acabamento premium',
  'conectividade Bluetooth 5.3',
  'bateria de longa duração',
  'resistência à água',
  'carregamento rápido',
  'alta durabilidade',
  'baixo consumo de energia',
  'compatibilidade universal',
  'iluminação RGB personalizável',
  'montagem sem ferramentas',
  'materiais reciclados',
];

export const USE_CASES = [
  'uso diário',
  'home office',
  'jogos competitivos',
  'viagens',
  'estúdios e criadores de conteúdo',
  'quem busca custo-benefício',
  'ambientes profissionais',
  'toda a família',
];

export const WARRANTIES = [
  'Garantia de 12 meses.',
  'Garantia de 24 meses direto com o fabricante.',
  'Suporte técnico em português.',
  'Troca grátis em até 30 dias.',
];

export const ADDRESS_LABELS = ['Casa', 'Trabalho', 'Apartamento', 'Casa dos pais', 'Outro'];

export const NEIGHBORHOODS = [
  'Centro',
  'Jardim América',
  'Vila Nova',
  'Bela Vista',
  'Santa Cecília',
  'Boa Viagem',
  'Copacabana',
  'Pinheiros',
  'Savassi',
  'Moinhos de Vento',
  'Meireles',
  'Jardins',
  'Vila Madalena',
  'Aldeota',
  'Batel',
  'Petrópolis',
  'Tambaú',
  'Ponta Verde',
  'Asa Sul',
  'Barra da Tijuca',
];

// ---------------------------------------------------------------------------
// People and places. Used instead of faker for the multi-million user pass:
// faker costs tens of microseconds per call, a list lookup costs nanoseconds.
// ---------------------------------------------------------------------------

export const FIRST_NAMES = [
  'Ana', 'Beatriz', 'Bruno', 'Camila', 'Carlos', 'Carolina', 'Daniel', 'Diego', 'Eduardo', 'Elisa',
  'Fábio', 'Felipe', 'Fernanda', 'Gabriel', 'Gabriela', 'Guilherme', 'Gustavo', 'Helena', 'Henrique', 'Isabela',
  'João', 'Júlia', 'Juliana', 'Larissa', 'Laura', 'Leonardo', 'Letícia', 'Lucas', 'Luiza', 'Manuela',
  'Marcelo', 'Marcos', 'Maria', 'Mariana', 'Mateus', 'Matheus', 'Miguel', 'Natália', 'Nicolas', 'Otávio',
  'Patrícia', 'Paulo', 'Pedro', 'Rafael', 'Rafaela', 'Renata', 'Ricardo', 'Roberto', 'Rodrigo', 'Sabrina',
  'Samuel', 'Sofia', 'Thiago', 'Valentina', 'Vinícius', 'Vitor', 'Vitória', 'Yasmin', 'Alice', 'André',
  'Arthur', 'Bernardo', 'Bianca', 'Caio', 'Clara', 'Davi', 'Débora', 'Enzo', 'Érica', 'Heitor',
  'Igor', 'Isadora', 'Lorenzo', 'Luana', 'Murilo', 'Priscila', 'Raul', 'Tatiane', 'Theo', 'Vanessa',
];

export const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
  'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas',
  'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Araújo', 'Correia', 'Cavalcanti', 'Monteiro', 'Moura',
  'Batista', 'Campos', 'Pinto', 'Castro', 'Duarte', 'Melo', 'Reis', 'Azevedo', 'Barros', 'Cunha',
  'Farias', 'Guimarães', 'Leite', 'Macedo', 'Medeiros', 'Miranda', 'Nogueira', 'Peixoto', 'Rezende', 'Sales',
];

export const EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'bol.com.br', 'icloud.com'];

export const STREET_TYPES = ['Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Estrada'];

export const STREET_NAMES = [
  'das Flores', 'XV de Novembro', 'Sete de Setembro', 'Getúlio Vargas', 'Tiradentes', 'Dom Pedro II',
  'Marechal Deodoro', 'Santos Dumont', 'São João', 'Santa Luzia', 'Rio Branco', 'Paulista', 'Brasil',
  'da Independência', 'das Palmeiras', 'dos Andradas', 'Barão de Mauá', 'Duque de Caxias', 'José Bonifácio',
  'Coronel Fabriciano', 'das Acácias', 'Padre Anchieta', 'Presidente Vargas', 'Castro Alves', 'Machado de Assis',
  'Rui Barbosa', 'Nossa Senhora de Fátima', 'Amazonas', 'Bahia', 'Goiás', 'Minas Gerais', 'Paraná',
];

export interface CityTemplate {
  city: string;
  state: string;
  /** First three digits of the CEP, so zip codes look plausible for the city. */
  cepPrefix: string;
}

export const CITIES: CityTemplate[] = [
  { city: 'São Paulo', state: 'SP', cepPrefix: '010' },
  { city: 'Campinas', state: 'SP', cepPrefix: '130' },
  { city: 'Santos', state: 'SP', cepPrefix: '110' },
  { city: 'Rio de Janeiro', state: 'RJ', cepPrefix: '200' },
  { city: 'Niterói', state: 'RJ', cepPrefix: '240' },
  { city: 'Belo Horizonte', state: 'MG', cepPrefix: '300' },
  { city: 'Uberlândia', state: 'MG', cepPrefix: '384' },
  { city: 'Curitiba', state: 'PR', cepPrefix: '800' },
  { city: 'Londrina', state: 'PR', cepPrefix: '860' },
  { city: 'Porto Alegre', state: 'RS', cepPrefix: '900' },
  { city: 'Caxias do Sul', state: 'RS', cepPrefix: '950' },
  { city: 'Florianópolis', state: 'SC', cepPrefix: '880' },
  { city: 'Joinville', state: 'SC', cepPrefix: '892' },
  { city: 'Salvador', state: 'BA', cepPrefix: '400' },
  { city: 'Recife', state: 'PE', cepPrefix: '500' },
  { city: 'Fortaleza', state: 'CE', cepPrefix: '600' },
  { city: 'Natal', state: 'RN', cepPrefix: '590' },
  { city: 'João Pessoa', state: 'PB', cepPrefix: '580' },
  { city: 'Maceió', state: 'AL', cepPrefix: '570' },
  { city: 'Aracaju', state: 'SE', cepPrefix: '490' },
  { city: 'Teresina', state: 'PI', cepPrefix: '640' },
  { city: 'São Luís', state: 'MA', cepPrefix: '650' },
  { city: 'Belém', state: 'PA', cepPrefix: '660' },
  { city: 'Manaus', state: 'AM', cepPrefix: '690' },
  { city: 'Brasília', state: 'DF', cepPrefix: '700' },
  { city: 'Goiânia', state: 'GO', cepPrefix: '740' },
  { city: 'Cuiabá', state: 'MT', cepPrefix: '780' },
  { city: 'Campo Grande', state: 'MS', cepPrefix: '790' },
  { city: 'Vitória', state: 'ES', cepPrefix: '290' },
  { city: 'Palmas', state: 'TO', cepPrefix: '770' },
];

export const ADDRESS_COMPLEMENTS = ['Apto 101', 'Apto 302', 'Bloco B', 'Casa 2', 'Fundos', 'Sala 12', 'Cobertura'];
