import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SaleForm } from "@/components/SaleForm";

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

const initialSales: Sale[] = [
  { id: 1, customerName: "Carlos Pereira", customerPhone: "11 98765-4321", seller: "João Silva", pickupDate: "2024-10-26", flavor1: "Calabresa", flavor2: "Mussarela", status: "Pendente" },
  { id: 2, customerName: "Ana Souza", customerPhone: "21 91234-5678", seller: "Maria Oliveira", pickupDate: "2024-11-02", flavor1: "Frango com Catupiry", status: "Pendente" },
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const handleAddSale = (saleData: Omit<Sale, 'id' | 'status'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now(),
      status: "Pendente",
    };
    setSales([...sales, newSale]);
    setIsDialogOpen(false);
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales(sales.map(sale => sale.id === updatedSale.id ? updatedSale : sale));
    setEditingSale(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  const openEditDialog = (sale: Sale) => {
    setEditingSale(sale);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingSale(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (saleData) => {
    if (editingSale) {
      handleUpdateSale(saleData);
    } else {
      handleAddSale(saleData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registro de Vendas</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Venda
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingSale ? "Editar Venda" : "Registrar Nova Venda"}</DialogTitle>
          </DialogHeader>
          <SaleForm
            sale={editingSale}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Sabores</TableHead>
                <TableHead>Data de Retirada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="font-medium">{sale.customerName}</div>
                    <div className="text-sm text-muted-foreground">{sale.customerPhone}</div>
                  </TableCell>
                  <TableCell>{sale.seller}</TableCell>
                  <TableCell>{sale.flavor1}{sale.flavor2 && `, ${sale.flavor2}`}</TableCell>
                  <TableCell>{new Date(sale.pickupDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell><Badge>{sale.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(sale)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(sale.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;