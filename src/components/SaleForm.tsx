import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

// Mock data - em um app real, viria de props ou estado global
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

export const SaleForm = ({ sale, onSubmit, onCancel }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [seller, setSeller] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [numFlavors, setNumFlavors] = useState("1");
  const [flavor1, setFlavor1] = useState("");
  const [flavor2, setFlavor2] = useState("");

  useEffect(() => {
    if (sale) {
      setCustomerName(sale.customerName);
      setCustomerPhone(sale.customerPhone);
      setSeller(sale.seller);
      setPickupDate(sale.pickupDate);
      setFlavor1(sale.flavor1);
      if (sale.flavor2) {
        setNumFlavors("2");
        setFlavor2(sale.flavor2);
      } else {
        setNumFlavors("1");
        setFlavor2("");
      }
    }
  }, [sale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const saleData = {
      id: sale ? sale.id : Date.now(),
      customerName,
      customerPhone,
      seller,
      pickupDate,
      flavor1,
      flavor2: numFlavors === "2" ? flavor2 : undefined,
      status: sale ? sale.status : "Pendente",
    };
    onSubmit(saleData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerName" className="text-right">
          Cliente
        </Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerPhone" className="text-right">
          Telefone
        </Label>
        <Input
          id="customerPhone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="seller" className="text-right">
          Vendedor
        </Label>
        <Select value={seller} onValueChange={setSeller}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione um vendedor" />
          </SelectTrigger>
          <SelectContent>
            {mockSellers.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pickupDate" className="text-right">
          Data Retirada
        </Label>
        <Select value={pickupDate} onValueChange={setPickupDate}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione uma data" />
          </SelectTrigger>
          <SelectContent>
            {mockPickupDates.map((date) => (
              <SelectItem key={date} value={date}>
                {new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Sabores</Label>
        <RadioGroup
          value={numFlavors}
          onValueChange={setNumFlavors}
          className="col-span-3 flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="r1" />
            <Label htmlFor="r1">1 Sabor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="r2" />
            <Label htmlFor="r2">2 Sabores</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="flavor1" className="text-right">
          Sabor 1
        </Label>
        <Select value={flavor1} onValueChange={setFlavor1}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o sabor 1" />
          </SelectTrigger>
          <SelectContent>
            {mockFlavors.map((f) => (
              <SelectItem key={f.id} value={f.name}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {numFlavors === "2" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="flavor2" className="text-right">
            Sabor 2
          </Label>
          <Select value={flavor2} onValueChange={setFlavor2}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o sabor 2" />
            </SelectTrigger>
            <SelectContent>
              {mockFlavors.map((f) => (
                <SelectItem key={f.id} value={f.name}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};