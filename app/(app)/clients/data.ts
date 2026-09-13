export type Client = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  instagram: string;
};

// Dados fictícios — substituir pela importação da planilha Excel / tabela `clients` do Supabase.
const FICTITIOUS_CLIENTS: Client[] = [
  {
    id: "1",
    razaoSocial: "Alfa Comércio de Materiais Ltda",
    cnpj: "12.345.678/0001-01",
    telefone: "(11) 4002-8901",
    email: "contato@alfacomercio.com.br",
    instagram: "@alfacomercio",
  },
  {
    id: "2",
    razaoSocial: "Bella Moda Confecções Ltda",
    cnpj: "23.456.789/0001-12",
    telefone: "(21) 3003-7802",
    email: "contato@bellamoda.com.br",
    instagram: "@bellamoda.oficial",
  },
  {
    id: "3",
    razaoSocial: "Casa Verde Distribuidora Ltda",
    cnpj: "34.567.890/0001-23",
    telefone: "(31) 3204-6703",
    email: "contato@casaverdedist.com.br",
    instagram: "@casaverde.distribuidora",
  },
  {
    id: "4",
    razaoSocial: "Delta Tech Soluções em TI Ltda",
    cnpj: "45.678.901/0001-34",
    telefone: "(11) 4105-5604",
    email: "contato@deltatech.com.br",
    instagram: "@deltatech.ti",
  },
  {
    id: "5",
    razaoSocial: "Estrela Sul Alimentos Ltda",
    cnpj: "56.789.012/0001-45",
    telefone: "(51) 3006-4505",
    email: "contato@estrelasul.com.br",
    instagram: "@estrelasul.alimentos",
  },
  {
    id: "6",
    razaoSocial: "Fortaleza Construções Ltda",
    cnpj: "67.890.123/0001-56",
    telefone: "(85) 3207-3306",
    email: "contato@fortalezaconstrucoes.com.br",
    instagram: "@fortaleza.construcoes",
  },
  {
    id: "7",
    razaoSocial: "Grão Dourado Cafés Especiais Ltda",
    cnpj: "78.901.234/0001-67",
    telefone: "(19) 3008-2207",
    email: "contato@graodourado.com.br",
    instagram: "@graodourado.cafes",
  },
  {
    id: "8",
    razaoSocial: "Horizonte Logística e Transportes Ltda",
    cnpj: "89.012.345/0001-78",
    telefone: "(41) 3309-1108",
    email: "contato@horizontelog.com.br",
    instagram: "@horizonte.log",
  },
  {
    id: "9",
    razaoSocial: "Ipê Amarelo Paisagismo Ltda",
    cnpj: "90.123.456/0001-89",
    telefone: "(48) 3010-9909",
    email: "contato@ipeamarelo.com.br",
    instagram: "@ipeamarelo.paisagismo",
  },
  {
    id: "10",
    razaoSocial: "Jaguar Automotive Peças Ltda",
    cnpj: "01.234.567/0001-90",
    telefone: "(11) 4111-0010",
    email: "contato@jaguarautomotive.com.br",
    instagram: "@jaguar.automotive",
  },
];

export function getClients(): Client[] {
  return [...FICTITIOUS_CLIENTS].sort((a, b) =>
    a.razaoSocial.localeCompare(b.razaoSocial, "pt-BR", { sensitivity: "base" })
  );
}
