import { z } from "zod";

export const GenderEnum = z.enum(["MASCULINO", "FEMININO", "OUTRO"]);
export const RaceColorEnum = z.enum(["BRANCA", "PRETA", "PARDA", "AMARELA", "INDIGENA", "SEM_INFORMACAO"]);
export const NationalityEnum = z.enum(["BRASILEIRA", "ESTRANGEIRA"]);

export const PatientRndsSchema = z.object({
  // Identificação
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").transform(val => val.toUpperCase()),
  nomeSocial: z.string().optional().transform(val => val?.toUpperCase()),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (use o formato 000.000.000-00)"),
  cns: z.string().regex(/^\d{15}$/, "CNS deve conter exatamente 15 dígitos"),
  dataNascimento: z.string().refine(val => !isNaN(Date.parse(val)), "Data inválida"),
  sexo: GenderEnum,

  // Filiação
  nomeMae: z.string().min(3, "Nome da mãe é obrigatório").transform(val => val.toUpperCase()),
  nomePai: z.string().optional().transform(val => val?.toUpperCase()),

  // Demográficos
  racaCor: RaceColorEnum,
  nacionalidade: NationalityEnum.default("BRASILEIRA"),
  municipioNascimento: z.string().optional(), // Código IBGE idealmente

  // Contato
  telefonePrincipal: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  
  // Endereço
  endereco: z.object({
    cep: z.string().min(8, "CEP inválido"),
    logradouro: z.string().min(3, "Rua/Logradouro obrigatório"),
    numero: z.string().min(1, "Número obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Bairro obrigatório"),
    cidade: z.string().min(2, "Cidade obrigatória"),
    uf: z.string().length(2, "UF deve ter 2 letras"),
  })
});

export type PatientRndsData = z.infer<typeof PatientRndsSchema>;
