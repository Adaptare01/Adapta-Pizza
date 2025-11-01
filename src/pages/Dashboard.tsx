import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Truck, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const mockSales = [
  { seller: "João Silva", status: "Entregue", flavor1: "Calabresa", flavor2: "Mussarela" },
  { seller: "Maria Oliveira", status: "Pendente", flavor1: "Frango com Catupiry" },
  { seller: "João Silva", status: "Pendente", flavor1: "Portuguesa" },
  { seller: "João Silva", status: "Cancelado", flavor1: "Calabresa" },
  { seller: "Maria Oliveira", status: "Entregue", flavor1: "Mussarela" },
  { seller: "João Silva", status: "Pendente", flavor1: "Frango com Catupiry" },
];
const pizzaPrice = 35.00;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const validSales = mockSales.filter(s => s.status !== 'Cancelado');
  const cardsSold = mockSales.length;
  const expectedRevenue = validSales.length * pizzaPrice;
  const delivered = mockSales.filter(s => s.status === 'Entregue').length;

  const salesBySeller = validSales.reduce((acc, sale) => {
    acc[sale.seller] = (acc[sale.seller] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sellerChartData = Object.keys(salesBySeller).map(seller => ({
    name: seller,
    vendas: salesBySeller[seller],
  }));

  const salesByFlavor = validSales.reduce((acc, sale) => {
    acc[sale.flavor1] = (acc[sale.flavor1] || 0) + 1;
    if (sale.flavor2) {
      acc[sale.flavor2] = (acc[sale.flavor2] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const flavorChartData = Object.keys(salesByFlavor).map(flavor => ({
    name: flavor,
    value: salesByFlavor[flavor],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Esperada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {expectedRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartões Vendidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardsSold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pizzas Entregues</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delivered}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Vendas por Vendedor</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sellerChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vendas por Sabor</CardTitle></CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={flavorChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {flavorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;