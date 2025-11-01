import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Flavor {
  id: number;
  name: string;
}
interface Seller {
  id: number;
  name: string;
}

const Settings = () => {
  const [flavors, setFlavors] = useState<Flavor[]>([
    { id: 1, name: "Calabresa" },
    { id: 2, name: "Mussarela" },
    { id: 3, name: "Frango com Catupiry" },
    { id: 4, name: "Portuguesa" },
  ]);
  const [newFlavor, setNewFlavor] = useState("");

  const [sellers, setSellers] = useState<Seller[]>([
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Oliveira" },
  ]);
  const [newSeller, setNewSeller] = useState("");

  const [pickupDates, setPickupDates] = useState(["2024-10-26", "2024-11-02"]);
  const [price, setPrice] = useState(35.0);

  const handleAddFlavor = () => {
    if (newFlavor.trim() !== "") {
      setFlavors([...flavors, { id: Date.now(), name: newFlavor.trim() }]);
      setNewFlavor("");
    }
  };

  const handleDeleteFlavor = (id: number) => {
    setFlavors(flavors.filter((flavor) => flavor.id !== id));
  };

  const handleAddSeller = () => {
    if (newSeller.trim() !== "") {
      setSellers([...sellers, { id: Date.now(), name: newSeller.trim() }]);
      setNewSeller("");
    }
  };

  const handleDeleteSeller = (id: number) => {
    setSellers(sellers.filter((seller) => seller.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Configure os sabores, vendedores, datas e preços para o evento.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sabores de Pizza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newFlavor}
                onChange={(e) => setNewFlavor(e.target.value)}
                placeholder="Novo sabor"
              />
              <Button onClick={handleAddFlavor}>Adicionar</Button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {flavors.map((flavor) => (
                <li
                  key={flavor.id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span>{flavor.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFlavor(flavor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSeller}
                onChange={(e) => setNewSeller(e.target.value)}
                placeholder="Novo vendedor"
              />
              <Button onClick={handleAddSeller}>Adicionar</Button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {sellers.map((seller) => (
                <li
                  key={seller.id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span>{seller.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSeller(seller.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datas e Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date1">Data de Retirada 1</Label>
              <Input
                id="date1"
                type="date"
                value={pickupDates[0]}
                onChange={(e) =>
                  setPickupDates([e.target.value, pickupDates[1]])
                }
              />
            </div>
            <div>
              <Label htmlFor="date2">Data de Retirada 2</Label>
              <Input
                id="date2"
                type="date"
                value={pickupDates[1]}
                onChange={(e) =>
                  setPickupDates([pickupDates[0], e.target.value])
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Valor da Pizza (R$)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;