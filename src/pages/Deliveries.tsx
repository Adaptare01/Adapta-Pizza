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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Sale {
  id: number;
  customerName: string;
  flavor1: string;
  flavor2?: string;
  pickupDate: string;
  status: "Pendente" | "Entregue" | "Cancelado";
}

const initialSales: Sale[] = [
  { id: 1, customerName: "Carlos Pereira", flavor1: "Calabresa", flavor2: "Mussarela", pickupDate: "2024-10-26", status: "Pendente" },
  { id: 2, customerName: "Ana Souza", flavor1: "Frango com Catupiry", pickupDate: "2024-11-02", status: "Pendente" },
  { id: 3, customerName: "Pedro Almeida", flavor1: "Portuguesa", pickupDate: "2024-10-26", status: "Entregue" },
  { id: 4, customerName: "Juliana Lima", flavor1: "Mussarela", pickupDate: "2024-11-02", status: "Cancelado" },
];

const Deliveries = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const handleStatusChange = (id: number, newStatus: Sale["status"]) => {
    setSales(sales.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registro de Entregas</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gerencie a entrega das pizzas aos clientes.
      </p>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Sabores</TableHead>
                <TableHead>Data de Retirada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.customerName}</TableCell>
                  <TableCell>{sale.flavor1}{sale.flavor2 && `, ${sale.flavor2}`}</TableCell>
                  <TableCell>{new Date(sale.pickupDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell><Badge>{sale.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {sale.status === "Pendente" && (
                        <Button size="sm" onClick={() => handleStatusChange(sale.id, "Entregue")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Registrar Entrega
                        </Button>
                    )}
                    {sale.status === "Entregue" && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(sale.id, "Pendente")}>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Cancelar Entrega
                        </Button>
                    )}
                    {sale.status === "Cancelado" && (
                      <span className="text-sm text-muted-foreground">Pedido Cancelado</span>
                    )}
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

export default Deliveries;