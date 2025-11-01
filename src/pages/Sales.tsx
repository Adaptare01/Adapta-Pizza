import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SaleForm, SaleData } from "@/components/SaleForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Sale extends SaleData {
  sellers: { name: string } | null;
  flavor1: { name: string } | null;
  flavor2: { name: string } | null;
}

const Sales = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sales, isLoading: isLoadingSales } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales").select(`*, sellers(name), flavor1:flavors!flavor1_id(name), flavor2:flavors!flavor2_id(name)`).order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: flavors, isLoading: isLoadingFlavors } = useQuery({ queryKey: ["flavors"], queryFn: async () => { const { data, error } = await supabase.from("flavors").select("*"); if (error) throw error; return data || []; } });
  const { data: sellers, isLoading: isLoadingSellers } = useQuery({ queryKey: ["sellers"], queryFn: async () => { const { data, error } = await supabase.from("sellers").select("*"); if (error) throw error; return data || []; } });
  const { data: settings, isLoading: isLoadingSettings } = useQuery({ queryKey: ["settings"], queryFn: async () => { const { data, error } = await supabase.from("settings").select("key, value").eq('key', 'pickup_dates'); if (error) throw error; return data?.[0]?.value || []; } });

  const saleMutation = useMutation({
    mutationFn: async (saleData: SaleData) => {
      const { id, ...dataToSave } = saleData;
      const { error } = id ? await supabase.from("sales").update(dataToSave).eq("id", id) : await supabase.from("sales").insert([dataToSave]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsDialogOpen(false);
      setEditingSale(null);
      showSuccess(`Venda ${editingSale ? 'atualizada' : 'registrada'} com sucesso!`);
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const deleteSaleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sales").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      showSuccess("Venda removida com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const openEditDialog = (sale: Sale) => { setEditingSale(sale); setIsDialogOpen(true); };
  const openNewDialog = () => { setEditingSale(null); setIsDialogOpen(true); };
  const handleSubmit = (saleData: SaleData) => saleMutation.mutate(saleData);
  const handleDelete = (id: string) => { if (window.confirm("Tem certeza?")) deleteSaleMutation.mutate(id); };

  const isLoading = isLoadingSales || isLoadingFlavors || isLoadingSellers || isLoadingSettings;

  const filteredSales = sales?.filter(sale =>
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.card_number && sale.card_number.toString().includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registro de Vendas</h1>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar por cliente ou cartão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={openNewDialog}><PlusCircle className="mr-2 h-4 w-4" />Registrar Venda</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>{editingSale ? "Editar Venda" : "Registrar Nova Venda"}</DialogTitle></DialogHeader>
          {!isLoading && <SaleForm sale={editingSale} flavors={flavors || []} sellers={sellers || []} pickupDates={settings || []} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isSubmitting={saleMutation.isPending} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead><TableHead>Nº Cartão</TableHead><TableHead>Vendedor</TableHead><TableHead>Sabores</TableHead><TableHead>Data de Retirada</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : (
                filteredSales?.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell><div className="font-medium">{sale.customer_name}</div><div className="text-sm text-muted-foreground">{sale.customer_phone}</div></TableCell>
                    <TableCell>{sale.card_number}</TableCell>
                    <TableCell>{sale.sellers?.name || 'N/A'}</TableCell>
                    <TableCell>{sale.flavor1?.name}{sale.flavor2 ? `, ${sale.flavor2.name}` : ''}</TableCell>
                    <TableCell>{new Date(sale.pickup_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                    <TableCell><Badge>{sale.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(sale)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(sale.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default Sales;