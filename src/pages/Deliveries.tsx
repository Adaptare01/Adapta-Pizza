import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Sale {
  id: string;
  customer_name: string;
  pickup_date: string;
  status: "Pendente" | "Entregue" | "Cancelado";
  flavor1: { name: string } | null;
  flavor2: { name: string } | null;
}

const Deliveries = () => {
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ["salesForDeliveries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales").select(`id, customer_name, pickup_date, status, flavor1:flavors!flavor1_id(name), flavor2:flavors!flavor2_id(name)`).order("pickup_date");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Sale["status"] }) => {
      const { error } = await supabase.from("sales").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesForDeliveries"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] }); // Invalidate sales query too
      showSuccess("Status da entrega atualizado!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const handleStatusChange = (id: string, newStatus: Sale["status"]) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registro de Entregas</h1>
      <p className="text-gray-600 dark:text-gray-400">Gerencie a entrega das pizzas aos clientes.</p>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead><TableHead>Sabores</TableHead><TableHead>Data de Retirada</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : (
                sales?.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.customer_name}</TableCell>
                    <TableCell>{sale.flavor1?.name}{sale.flavor2 ? `, ${sale.flavor2.name}` : ''}</TableCell>
                    <TableCell>{new Date(sale.pickup_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                    <TableCell><Badge>{sale.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {sale.status === "Pendente" && (<Button size="sm" onClick={() => handleStatusChange(sale.id, "Entregue")} disabled={updateStatusMutation.isPending}><CheckCircle className="mr-2 h-4 w-4" />Registrar Entrega</Button>)}
                      {sale.status === "Entregue" && (<Button size="sm" variant="outline" onClick={() => handleStatusChange(sale.id, "Pendente")} disabled={updateStatusMutation.isPending}><Undo2 className="mr-2 h-4 w-4" />Cancelar Entrega</Button>)}
                      {sale.status === "Cancelado" && (<span className="text-sm text-muted-foreground">Pedido Cancelado</span>)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deliveries;