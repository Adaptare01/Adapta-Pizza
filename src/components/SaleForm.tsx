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

interface Flavor { id: string; name: string; }
interface Seller { id: string; name: string; }
export interface SaleData {
  id?: string;
  customer_name: string;
  customer_phone: string;
  seller_id: string;
  pickup_date: string;
  flavor1_id: string;
  flavor2_id?: string | null;
  status?: string;
}

interface SaleFormProps {
  sale?: SaleData | null;
  flavors: Flavor[];
  sellers: Seller[];
  pickupDates: string[];
  onSubmit: (data: SaleData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SaleForm = ({ sale, flavors, sellers, pickupDates, onSubmit, onCancel, isSubmitting }: SaleFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [numFlavors, setNumFlavors] = useState("1");
  const [flavor1Id, setFlavor1Id] = useState("");
  const [flavor2Id, setFlavor2Id] = useState("");

  useEffect(() => {
    if (sale) {
      setCustomerName(sale.customer_name);
      setCustomerPhone(sale.customer_phone || "");
      setSellerId(sale.seller_id);
      setPickupDate(sale.pickup_date);
      setFlavor1Id(sale.flavor1_id);
      if (sale.flavor2_id) {
        setNumFlavors("2");
        setFlavor2Id(sale.flavor2_id);
      } else {
        setNumFlavors("1");
        setFlavor2Id("");
      }
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setSellerId("");
      setPickupDate("");
      setNumFlavors("1");
      setFlavor1Id("");
      setFlavor2Id("");
    }
  }, [sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saleData: SaleData = {
      id: sale?.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      seller_id: sellerId,
      pickup_date: pickupDate,
      flavor1_id: flavor1Id,
      flavor2_id: numFlavors === "2" ? flavor2Id : null,
      status: sale?.status || "Pendente",
    };
    onSubmit(saleData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerName" className="text-right">Cliente</Label>
        <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerPhone" className="text-right">Telefone</Label>
        <Input id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="seller" className="text-right">Vendedor</Label>
        <Select value={sellerId} onValueChange={setSellerId} required>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione um vendedor" /></SelectTrigger>
          <SelectContent>{sellers.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pickupDate" className="text-right">Data Retirada</Label>
        <Select value={pickupDate} onValueChange={setPickupDate} required>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione uma data" /></SelectTrigger>
          <SelectContent>{pickupDates.filter(d => d).map((date) => (<SelectItem key={date} value={date}>{new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Sabores</Label>
        <RadioGroup value={numFlavors} onValueChange={(value) => { setNumFlavors(value); if (value === "1") setFlavor2Id(""); }} className="col-span-3 flex space-x-4">
          <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="r1" /><Label htmlFor="r1">1 Sabor</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="r2" /><Label htmlFor="r2">2 Sabores</Label></div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="flavor1" className="text-right">Sabor 1</Label>
        <Select value={flavor1Id} onValueChange={setFlavor1Id} required>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione o sabor 1" /></SelectTrigger>
          <SelectContent>{flavors.map((f) => (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      {numFlavors === "2" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="flavor2" className="text-right">Sabor 2</Label>
          <Select value={flavor2Id} onValueChange={setFlavor2Id} required={numFlavors === "2"}>
            <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione o sabor 2" /></SelectTrigger>
            <SelectContent>{flavors.map((f) => (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
      </div>
    </form>
  );
};