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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - em um app real, viria de um estado global ou API
const mockFlavors = [
  { id: 1, name: "Calabresa" },
  { id: 2, name: "Mussarela" },
  { id: 3, name: "Frango com Catupiry" },
  { id: 4, name: "Portuguesa" },
];
const mockSellers = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
];
const mockPickupDates = ["2024-10-26", "2024-11-02"];

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

  const handleDelete = (id: number) => {
    setSales(sales.filter(sale => sale.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registro de Vendas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Registrar Nova Venda</DialogTitle>
            </DialogHeader>
            {/* O formulário de venda seria implementado aqui */}
            <div className="p-4 text-center">
              Formulário de registro e edição de vendas.
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                  <TableCell>{new Date(sale.pickupDate).toLocaleDateString()}</TableCell>
                  <TableCell><Badge>{sale.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
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