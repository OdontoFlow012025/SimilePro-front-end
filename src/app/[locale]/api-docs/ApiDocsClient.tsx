"use client";

import React, { useState, useTransition, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiDocs from "../../../../docs.json";

// Dynamic translation dictionary for development portal
const pageDicts: Record<string, any> = {
  "pt-BR": {
    title: "Portal do Desenvolvedor",
    subtitle: "Explore a documentação técnica e integre as APIs do OdontoFlow ao seu ecossistema.",
    searchPlaceholder: "Buscar por rotas, tags ou resumo...",
    sidebarTitle: "Módulos da API",
    authTitle: "Autenticação & Segurança",
    authDesc: "A maioria das rotas do OdontoFlow exige um Token JWT Bearer nos cabeçalhos da requisição.",
    paramsTitle: "Parâmetros da Rota",
    bodyTitle: "Corpo da Requisição (JSON)",
    responsesTitle: "Respostas da API",
    codeTitle: "Exemplo de Código",
    copyBtn: "Copiar",
    copiedBtn: "Copiado!",
    noEndpoints: "Nenhum endpoint encontrado.",
    required: "obrigatório",
    optional: "opcional",
    fieldName: "Campo",
    fieldType: "Tipo",
    fieldDesc: "Descrição",
    fieldStatus: "Status",
    authRequired: "Requer Autenticação (JWT)",
    authNotRequired: "Pública (Sem autenticação)",
    selectEndpoint: "Selecione uma rota na barra lateral para carregar a documentação interativa.",
    baseApiUrl: "URL Base da API:",
    tags: {
      "Saúde": "Saúde do Sistema",
      "Autenticação": "Autenticação & Sessão",
      "Usuários": "Gestão de Usuários",
      "Clínicas": "Gestão de Clínicas (SaaS)",
      "Dentistas": "Corpo Clínico (Dentistas)",
      "Administração": "Painel de Administração",
      "Agendamentos": "Agenda & Consultas",
      "Contabilidade": "Módulo Contábil & BI",
      "Educacional": "Módulo Educacional (Aulas)",
      "Convênios": "Gestão de Convênios",
      "Faturamento": "Faturamento & Invoices",
      "Funcionarios": "Gestão de Funcionários",
      "Pacientes": "Fichas de Pacientes",
      "Procedimentos": "Catálogo de Procedimentos",
      "Planos de Tratamento": "Planos de Tratamento",
      "Prontuários": "Prontuário Eletrônico",
      "Prontuários - Controle de Acesso LGPD": "Auditoria & Acesso (LGPD)",
      "Transações Financeiras": "Transações Financeiras"
    }
  },
  en: {
    title: "Developer Portal",
    subtitle: "Explore the technical documentation and integrate the OdontoFlow APIs into your ecosystem.",
    searchPlaceholder: "Search by routes, tags or summary...",
    sidebarTitle: "API Modules",
    authTitle: "Authentication & Security",
    authDesc: "Most OdontoFlow routes require a JWT Bearer Token in request headers.",
    paramsTitle: "Route Parameters",
    bodyTitle: "Request Body (JSON)",
    responsesTitle: "API Responses",
    codeTitle: "Code Example",
    copyBtn: "Copy",
    copiedBtn: "Copied!",
    noEndpoints: "No endpoints found.",
    required: "required",
    optional: "optional",
    fieldName: "Field",
    fieldType: "Type",
    fieldDesc: "Description",
    fieldStatus: "Status",
    authRequired: "Requires Authentication (JWT)",
    authNotRequired: "Public (No auth)",
    selectEndpoint: "Select a route from the sidebar to load the interactive documentation.",
    baseApiUrl: "Base API URL:",
    tags: {
      "Saúde": "System Health",
      "Autenticação": "Auth & Sessions",
      "Usuários": "Users Management",
      "Clínicas": "Clinics Management (SaaS)",
      "Dentistas": "Clinical Staff (Dentists)",
      "Administração": "Admin Control Panel",
      "Agendamentos": "Scheduling & Appointments",
      "Contabilidade": "Accounting & BI Metrics",
      "Educacional": "Educational Module",
      "Convênios": "Insurances Management",
      "Faturamento": "Invoicing & Billing",
      "Funcionarios": "Employees Management",
      "Pacientes": "Patient Health Records",
      "Procedimentos": "Procedures Catalog",
      "Planos de Tratamento": "Treatment Plans",
      "Prontuários": "Electronic Health Record",
      "Prontuários - Controle de Acesso LGPD": "Access Audit (LGPD)",
      "Transações Financeiras": "Financial Transactions"
    }
  },
  es: {
    title: "Portal de Desarrolladores",
    subtitle: "Explore la documentación técnica e integre las API de OdontoFlow en su ecosistema.",
    searchPlaceholder: "Buscar por rutas, etiquetas o resumen...",
    sidebarTitle: "Módulos de API",
    authTitle: "Autenticación y Seguridad",
    authDesc: "La mayoría de las rutas de OdontoFlow requieren un Token JWT Bearer en los encabezados de solicitud.",
    paramsTitle: "Parámetros de Ruta",
    bodyTitle: "Cuerpo de la Solicitud (JSON)",
    responsesTitle: "Respuestas de la API",
    codeTitle: "Ejemplo de Código",
    copyBtn: "Copiar",
    copiedBtn: "¡Copiado!",
    noEndpoints: "No se encontraron endpoints.",
    required: "obligatorio",
    optional: "opcional",
    fieldName: "Campo",
    fieldType: "Tipo",
    fieldDesc: "Descripción",
    fieldStatus: "Estado",
    authRequired: "Requiere Autenticación (JWT)",
    authNotRequired: "Pública (Sin autenticación)",
    selectEndpoint: "Seleccione una ruta en la barra lateral para cargar la documentación interactiva.",
    baseApiUrl: "URL Base de la API:",
    tags: {
      "Saúde": "Salud del Sistema",
      "Autenticação": "Autenticación y Sesión",
      "Usuários": "Gestión de Usuarios",
      "Clínicas": "Gestión de Clínicas (SaaS)",
      "Dentistas": "Cuerpo Clínico (Dentistas)",
      "Administração": "Panel de Administración",
      "Agendamentos": "Agenda y Citas",
      "Contabilidade": "Módulo Contable y BI",
      "Educacional": "Módulo Educativo",
      "Convênios": "Gestión de Convenios",
      "Faturamento": "Facturación e Invoices",
      "Funcionarios": "Gestión de Empleados",
      "Pacientes": "Fichas de Pacientes",
      "Procedimentos": "Catálogo de Procedimientos",
      "Planos de Tratamento": "Planes de Tratamiento",
      "Prontuários": "Expediente Clínico Electrónico",
      "Prontuários - Controle de Acesso LGPD": "Auditoría y Acceso (LGPD)",
      "Transações Financeiras": "Transacciones Financieras"
    }
  }
};

// Helper for resolving schema references
function resolveRef(ref: string, components: any) {
  if (!ref) return null;
  const parts = ref.split("/");
  const name = parts[parts.length - 1];
  return components?.schemas?.[name];
}

// Generate realistic dummy data for JSON examples recursively
function generateExample(schema: any, components: any, depth = 0): any {
  if (depth > 3) return "...";
  if (!schema) return null;

  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, components);
    return generateExample(resolved, components, depth + 1);
  }

  if (schema.type === "object") {
    const obj: any = {};
    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        obj[key] = generateExample(value, components, depth + 1);
      }
    }
    return obj;
  }

  if (schema.type === "array") {
    return [generateExample(schema.items, components, depth + 1)];
  }

  if (schema.example !== undefined) return schema.example;
  
  if (schema.type === "string") {
    if (schema.format === "email") return "dentista@odontoflow.com";
    if (schema.pattern && schema.pattern.includes("cpf")) return "123.456.789-00";
    return "string";
  }
  if (schema.type === "number" || schema.type === "integer") return 1;
  if (schema.type === "boolean") return true;

  return null;
}

// Flat list of schema properties for request tables
function getSchemaProperties(schema: any, components: any): any[] {
  if (!schema) return [];
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, components);
    return getSchemaProperties(resolved, components);
  }
  const properties: any[] = [];
  const requiredFields = schema.required || [];

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties) as any) {
      properties.push({
        name: key,
        type: value.type || (value.$ref ? value.$ref.split("/").pop() : "any"),
        description: value.description || "",
        required: requiredFields.includes(key),
        example: value.example !== undefined ? JSON.stringify(value.example) : ""
      });
    }
  }
  return properties;
}

export default function ApiDocsClient({ locale, dict }: { locale: string; dict: any }) {
  const t = pageDicts[locale] || pageDicts["en"];

  const [searchTerm, setSearchTerm] = useState("");
  const [, startTransition] = useTransition();
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<"curl" | "js" | "go">("curl");
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Group endpoints from docs.json
  const groups = useMemo(() => {
    const paths = apiDocs.paths || {};
    const components = apiDocs.components || {};
    const grouped: Record<string, any[]> = {};

    Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (!["get", "post", "put", "delete", "patch"].includes(method)) return;

        const tags = operation.tags || ["General"];
        tags.forEach((tag: string) => {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          grouped[tag].push({
            path,
            method,
            operationId: operation.operationId,
            summary: operation.summary || operation.operationId || `${method.toUpperCase()} ${path}`,
            description: operation.description || "",
            parameters: operation.parameters || [],
            requestBody: operation.requestBody,
            responses: operation.responses || {},
            security: operation.security,
            components
          });
        });
      });
    });

    return { grouped, components };
  }, []);

  // Filter endpoints based on search term
  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return groups.grouped;

    const filtered: Record<string, any[]> = {};
    Object.entries(groups.grouped).forEach(([tag, endpoints]) => {
      const matched = endpoints.filter(
        (ep) =>
          ep.path.toLowerCase().includes(term) ||
          ep.summary.toLowerCase().includes(term) ||
          ep.description.toLowerCase().includes(term) ||
          tag.toLowerCase().includes(term)
      );
      if (matched.length > 0) {
        filtered[tag] = matched;
      }
    });
    return filtered;
  }, [searchTerm, groups]);

  // Set the first endpoint as selected by default if nothing is selected
  useMemo(() => {
    if (!selectedEndpoint) {
      const firstTag = Object.keys(groups.grouped)[0];
      if (firstTag && groups.grouped[firstTag]?.[0]) {
        setSelectedEndpoint(groups.grouped[firstTag][0]);
      }
    }
  }, [groups, selectedEndpoint]);

  // Handle Search Input Change with transition to avoid UI stuttering
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  // Extract schemas from request body
  const requestBodyContent = selectedEndpoint?.requestBody?.content?.["application/json"];
  const requestBodySchema = requestBodyContent?.schema;
  const propertiesTable = useMemo(() => {
    return getSchemaProperties(requestBodySchema, groups.components);
  }, [requestBodySchema, groups.components]);

  // Generate Snippets
  const snippets = useMemo(() => {
    if (!selectedEndpoint) return { curl: "", js: "", go: "" };

    const { method, path, parameters } = selectedEndpoint;
    const methodUpper = method.toUpperCase();
    const baseUrl = "http://localhost:8080/api";

    // Build JSON request body
    let bodyJson = "";
    if (requestBodySchema) {
      const exampleObj = generateExample(requestBodySchema, groups.components);
      bodyJson = JSON.stringify(exampleObj, null, 2);
    }

    // Build Query params
    const queryParams = parameters.filter((p: any) => p.in === "query");
    let queryString = "";
    if (queryParams.length > 0) {
      const paramsStr = queryParams
        .map((p: any) => `${p.name}=${p.schema?.example || "value"}`)
        .join("&");
      queryString = `?${paramsStr}`;
    }

    const isProtected =
      path !== "/auth/login" && path !== "/auth/signup" && path !== "/auth/register" && path !== "/";

    // Curl snippet
    let curl = `curl -X ${methodUpper} "${baseUrl}${path}${queryString}" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    if (isProtected) {
      curl += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN_HERE"`;
    }
    if (bodyJson) {
      curl += ` \\\n  -d '${bodyJson.replace(/'/g, "'\\''")}'`;
    }

    // Fetch snippet
    let js = `fetch("${baseUrl}${path}${queryString}", {\n`;
    js += `  method: "${methodUpper}",\n`;
    js += `  headers: {\n`;
    js += `    "Content-Type": "application/json",\n`;
    if (isProtected) {
      js += `    "Authorization": "Bearer YOUR_TOKEN_HERE"\n`;
    }
    js += `  }${
      bodyJson
        ? ",\n  body: JSON.stringify(" + bodyJson.split("\n").join("\n  ") + ")"
        : ""
    }\n`;
    js += `})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));`;

    // Go snippet
    let go = `package main\n\nimport (\n\t"fmt"\n\t"net/http"\n\t"io"\n\t"bytes"\n)\n\nfunc main() {\n`;
    if (bodyJson) {
      go += `\tpayload := []byte(\`${bodyJson}\`)\n`;
      go += `\treq, _ := http.NewRequest("${methodUpper}", "${baseUrl}${path}${queryString}", bytes.NewBuffer(payload))\n`;
    } else {
      go += `\treq, _ := http.NewRequest("${methodUpper}", "${baseUrl}${path}${queryString}", nil)\n`;
    }
    go += `\treq.Header.Add("Content-Type", "application/json")\n`;
    if (isProtected) {
      go += `\treq.Header.Add("Authorization", "Bearer YOUR_TOKEN_HERE")\n`;
    }
    go += `\n\tclient := &http.Client{}\n\tres, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;

    return { curl, js, go };
  }, [selectedEndpoint, requestBodySchema, groups.components]);

  const copyToClipboard = () => {
    const textToCopy = snippets[selectedTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "post":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "put":
      case "patch":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "delete":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-blue-200 dark:selection:bg-blue-900">
      <Navbar dict={dict} locale={locale} />

      {/* Floating Toggle Button for Mobile Sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">
          {isSidebarOpen ? "close" : "menu_open"}
        </span>
      </button>

      {/* Developer Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/50 dark:to-slate-950 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider dark:bg-blue-900/30 dark:text-blue-400 mb-6">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            API Reference v1.0
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Main Dev Workspace Container */}
      <section className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Sidebar - Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 w-80 bg-white/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800 p-6 z-40 transition-transform duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Search Input */}
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-slate-200 transition-all"
              />
            </div>

            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              {t.sidebarTitle}
            </h3>

            {/* List of Modules/Endpoints */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {Object.keys(filteredGroups).length === 0 ? (
                <p className="text-sm text-slate-400">{t.noEndpoints}</p>
              ) : (
                Object.entries(filteredGroups).map(([tag, endpoints]) => (
                  <div key={tag} className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-300 flex items-center gap-1.5 px-2 py-1">
                      <span className="material-symbols-outlined text-[16px] text-blue-500">
                        folder_open
                      </span>
                      {t.tags[tag] || tag}
                    </h4>
                    <div className="space-y-0.5 pl-3">
                      {endpoints.map((ep) => {
                        const isSelected =
                          selectedEndpoint?.path === ep.path &&
                          selectedEndpoint?.method === ep.method;
                        return (
                          <button
                            key={`${ep.method}-${ep.path}`}
                            onClick={() => {
                              setSelectedEndpoint(ep);
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 group ${
                              isSelected
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-l-2 border-blue-500"
                                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                            }`}
                          >
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded leading-none uppercase shrink-0 ${
                                ep.method === "get"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : ep.method === "post"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="truncate">{ep.summary}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 lg:hidden"
          ></div>
        )}

        {/* Documentation Content & Playground */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-full overflow-hidden">
          {selectedEndpoint ? (
            <>
              {/* Center Column: Detailed Specs */}
              <div className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl space-y-10">
                  {/* Endpoint URI Header */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${getMethodBadgeClass(
                          selectedEndpoint.method
                        )}`}
                      >
                        {selectedEndpoint.method}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        /api{selectedEndpoint.path}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {selectedEndpoint.summary}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                      {selectedEndpoint.description}
                    </p>
                  </div>

                  {/* API Authentication & Security info */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl shrink-0">
                      lock_open
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedEndpoint.path === "/auth/login" ||
                        selectedEndpoint.path === "/auth/signup" ||
                        selectedEndpoint.path === "/auth/register" ||
                        selectedEndpoint.path === "/"
                          ? t.authNotRequired
                          : t.authRequired}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.authDesc}
                      </p>
                    </div>
                  </div>

                  {/* Route parameters Table */}
                  {selectedEndpoint.parameters.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">
                          settings_input_component
                        </span>
                        {t.paramsTitle}
                      </h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                              <th className="p-4">{t.fieldName}</th>
                              <th className="p-4">{t.fieldType}</th>
                              <th className="p-4">In</th>
                              <th className="p-4">{t.fieldStatus}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {selectedEndpoint.parameters.map((param: any) => (
                              <tr key={param.name}>
                                <td className="p-4 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {param.name}
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                  {param.schema?.type || "string"}
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                  {param.in}
                                </td>
                                <td className="p-4 text-xs">
                                  {param.required ? (
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
                                      {t.required}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 font-medium">
                                      {t.optional}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Request Body parameters Table */}
                  {propertiesTable.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">
                          database
                        </span>
                        {t.bodyTitle}
                      </h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                              <th className="p-4">{t.fieldName}</th>
                              <th className="p-4">{t.fieldType}</th>
                              <th className="p-4">{t.fieldDesc}</th>
                              <th className="p-4">{t.fieldStatus}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {propertiesTable.map((prop: any) => (
                              <tr key={prop.name}>
                                <td className="p-4 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {prop.name}
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                  {prop.type}
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-400 text-xs">
                                  {prop.description || "-"}
                                </td>
                                <td className="p-4 text-xs">
                                  {prop.required ? (
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
                                      {t.required}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 font-medium">
                                      {t.optional}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Responses Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-500">
                        output
                      </span>
                      {t.responsesTitle}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedEndpoint.responses).map(
                        ([code, res]: [string, any]) => {
                          const isSuccess = code.startsWith("2");
                          return (
                            <div
                              key={code}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4"
                            >
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded ${
                                  isSuccess
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {code}
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                  {res.description}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Snippets & Playground */}
              <div className="w-full lg:w-96 xl:w-[480px] bg-slate-950 border-t border-slate-800 lg:border-t-0 p-6 sm:p-8 space-y-6 overflow-y-auto lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {t.codeTitle}
                  </h3>

                  {/* Copy Button */}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copied ? "check_circle" : "content_copy"}
                    </span>
                    {copied ? t.copiedBtn : t.copyBtn}
                  </button>
                </div>

                {/* Tabs to toggle snippet language */}
                <div className="flex border-b border-slate-800">
                  <button
                    onClick={() => setSelectedTab("curl")}
                    className={`flex-1 pb-3 text-xs font-bold tracking-wider text-center border-b transition-all ${
                      selectedTab === "curl"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSelectedTab("js")}
                    className={`flex-1 pb-3 text-xs font-bold tracking-wider text-center border-b transition-all ${
                      selectedTab === "js"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setSelectedTab("go")}
                    className={`flex-1 pb-3 text-xs font-bold tracking-wider text-center border-b transition-all ${
                      selectedTab === "go"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Go
                  </button>
                </div>

                {/* Snippet box */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <pre className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto select-all max-h-[500px]">
                    {snippets[selectedTab]}
                  </pre>
                </div>

                {/* Help block */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-400">
                      info
                    </span>
                    {t.baseApiUrl}
                  </p>
                  <p className="font-mono text-blue-400 bg-slate-950 p-2 rounded border border-slate-800 select-all">
                    http://localhost:8080/api
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-800 mb-4 animate-bounce">
                integration_instructions
              </span>
              <p>{t.selectEndpoint}</p>
            </div>
          )}
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
