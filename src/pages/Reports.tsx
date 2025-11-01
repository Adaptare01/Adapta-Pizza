import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Sale {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_date: string;
  status: string;
  sellers: { name: string } | null;
  flavor1: { name: string } | null;
  flavor2: { name: string } | null;
}

const Reports = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["reportsData"],
    queryFn: async () => {
      const salesPromise = supabase.from("sales").select(`*, sellers(name), flavor1:flavors!flavor1_id(name), flavor2:flavors!flavor2_id(name)`);
      const settingsPromise = supabase.from("settings").select("key, value").eq('key', 'price');
      const [{ data: sales, error: salesError }, { data: settingsData, error: settingsError }] = await Promise.all([salesPromise, settingsPromise]);
      if (salesError) throw new Error(salesError.message);
      if (settingsError) throw new Error(settingsError.message);
      const price = settingsData?.[0]?.value || 0;
      return { sales: sales || [], price: Number(price) };
    }
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
      </div>
    );
  }

  const { sales, price } = data;
  const validSales = sales.filter((sale) => sale.status !== "Cancelado");

  const salesBySeller = validSales.reduce((acc, sale) => {
    const sellerName = sale.sellers?.name || 'N/A';
    if (!acc[sellerName]) acc[sellerName] = { count: 0, totalValue: 0 };
    acc[sellerName].count += 1;
    acc[sellerName].totalValue += price;
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);

  const sellerReportData = Object.entries(salesBySeller).map(([seller, data]) => ({ seller, ...data }));

  const generateCSV = (dataToExport: Sale[], filename: string) => {
    const headers = ["ID", "Cliente", "Telefone", "Vendedor", "Data Retirada", "Sabor 1", "Sabor 2", "Status"];
    const rows = dataToExport.map(s => [s.id, `"${s.customer_name}"`, `"${s.customer_phone}"`, `"${s.sellers?.name || ''}"`, s.pickup_date, `"${s.flavor1?.name || ''}"`, `"${s.flavor2?.name || ''}"`, s.status].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Relatórios</h1></div>
      <Card>
        <CardHeader><CardTitle>Vendas por Vendedor</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Vendedor</TableHead><TableHead className="text-right">Cartões Vendidos</TableHead><TableHead className="text-right">Valor Total (R$)</TableHead></TableRow></TableHeader>
            <TableBody>
              {sellerReportData.map((row) => (
                <TableRow key={row.seller}>
                  <TableCell className="font-medium">{row.seller}</TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="text-right">{row.totalValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Exportar Dados</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => generateCSV(sales, "vendas_gerais.csv")}><Download className="mr-2 h-4 w-4" />Exportar Vendas (CSV)</Button>
          <Button onClick={() => generateCSV(sales.filter(s => s.status === 'Entregue'), "entregas.csv")} variant="secondary"><Download className="mr-2 h-4 w-4" />Exportar Entregas (CSV)</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;