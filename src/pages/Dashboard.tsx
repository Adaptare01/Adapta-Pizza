import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Truck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData"],
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const { sales, price } = data;
  const validSales = sales.filter(s => s.status !== 'Cancelado');
  const expectedRevenue = validSales.length * price;
  const delivered = sales.filter(s => s.status === 'Entregue').length;

  const salesBySeller = validSales.reduce((acc, sale) => {
    const sellerName = sale.sellers?.name || 'N/A';
    acc[sellerName] = (acc[sellerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sellerChartData = Object.keys(salesBySeller).map(name => ({ name, vendas: salesBySeller[name] }));

  const salesByFlavor = validSales.reduce((acc, sale) => {
    if (sale.flavor1?.name) acc[sale.flavor1.name] = (acc[sale.flavor1.name] || 0) + 1;
    if (sale.flavor2?.name) acc[sale.flavor2.name] = (acc[sale.flavor2.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const flavorChartData = Object.keys(salesByFlavor).map(name => ({ name, value: salesByFlavor[name] }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Receita Esperada</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">R$ {expectedRevenue.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Cartões Vendidos</CardTitle><ShoppingCart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{sales.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pizzas Entregues</CardTitle><Truck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{delivered}</div></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Vendas por Vendedor</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sellerChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="vendas" fill="#8884d8" /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vendas por Sabor</CardTitle></CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={flavorChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {flavorChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
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