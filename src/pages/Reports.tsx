import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Mock data - Em uma aplicação real, estes dados viriam de um estado global ou API
interface Sale {
  id: number;
  customerName: string;
  customerPhone: string;
  seller: string;
  pickupDate: string;
  flavor1: string;
  flavor2?: string;
  status: "Pendente" | "Entregue" | "Cancelado";
}

const mockSales: Sale[] = [
  { id: 1, customerName: "Carlos Pereira", customerPhone: "11 98765-4321", seller: "João Silva", pickupDate: "2024-10-26", flavor1: "Calabresa", flavor2: "Mussarela", status: "Entregue" },
  { id: 2, customerName: "Ana Souza", customerPhone: "21 91234-5678", seller: "Maria Oliveira", pickupDate: "2024-11-02", flavor1: "Frango com Catupiry", status: "Pendente" },
  { id: 3, customerName: "Pedro Almeida", customerPhone: "31 99999-8888", seller: "João Silva", pickupDate: "2024-10-26", flavor1: "Portuguesa", status: "Pendente" },
  { id: 4, customerName: "Mariana Costa", customerPhone: "41 98888-7777", seller: "Maria Oliveira", pickupDate: "2024-11-02", flavor1: "Mussarela", status: "Entregue" },
  { id: 5, customerName: "Lucas Martins", customerPhone: "51 97777-6666", seller: "João Silva", pickupDate: "2024-10-26", flavor1: "Calabresa", status: "Cancelado" },
];

const pizzaPrice = 35.00;

const Reports = () => {
  const validSales = mockSales.filter((sale) => sale.status !== "Cancelado");

  const salesBySeller = validSales.reduce((acc, sale) => {
    if (!acc[sale.seller]) {
      acc[sale.seller] = { count: 0, totalValue: 0 };
    }
    acc[sale.seller].count += 1;
    acc[sale.seller].totalValue += pizzaPrice;
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);

  const sellerReportData = Object.entries(salesBySeller).map(
    ([seller, data]) => ({
      seller,
      ...data,
    })
  );

  const generateCSV = (data: Sale[], filename: string) => {
    const headers = ["ID", "Cliente", "Telefone", "Vendedor", "Data Retirada", "Sabor 1", "Sabor 2", "Status"];
    const rows = data.map(sale => 
      [sale.id, `"${sale.customerName}"`, `"${sale.customerPhone}"`, `"${sale.seller}"`, sale.pickupDate, `"${sale.flavor1}"`, `"${sale.flavor2 || ""}"`, sale.status].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSales = () => {
    generateCSV(validSales, "vendas_gerais.csv");
  };

  const handleExportDeliveries = () => {
    const deliveredSales = mockSales.filter(sale => sale.status === "Entregue");
    generateCSV(deliveredSales, "entregas.csv");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendas por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Cartões Vendidos</TableHead>
                <TableHead className="text-right">Valor Total (R$)</TableHead>
              </TableRow>
            </TableHeader>
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
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={handleExportSales}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Vendas (CSV)
          </Button>
          <Button onClick={handleExportDeliveries} variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Exportar Entregas (CSV)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;