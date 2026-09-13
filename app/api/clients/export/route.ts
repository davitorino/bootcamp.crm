import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("razao_social", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Clientes");

  sheet.columns = [
    { header: "Razão Social", key: "razao_social", width: 32 },
    { header: "Segmento", key: "segmento", width: 20 },
    { header: "Endereço", key: "endereco", width: 40 },
    { header: "CNPJ", key: "cnpj", width: 18 },
    { header: "Telefone", key: "telefone", width: 16 },
    { header: "E-mail", key: "email", width: 26 },
    { header: "Instagram", key: "instagram", width: 22 },
    { header: "Serviços sugeridos", key: "servicos_sugeridos", width: 40 },
    { header: "Status do contato", key: "status_contato", width: 18 },
    { header: "Prioridade", key: "prioridade", width: 12 },
    { header: "Responsável", key: "responsavel", width: 18 },
    { header: "Último contato", key: "ultimo_contato_em", width: 16 },
    { header: "Fonte", key: "fonte", width: 40 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const client of clients ?? []) {
    sheet.addRow(client);
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="clientes.xlsx"',
    },
  });
}
