import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Flavor {
  id: string;
  name: string;
}
interface Seller {
  id: string;
  name: string;
}
interface SettingsData {
  pickup_dates: string[];
  price: number;
}

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: flavors, isLoading: isLoadingFlavors } = useQuery<Flavor[]>({
    queryKey: ["flavors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("flavors").select("*").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: sellers, isLoading: isLoadingSellers } = useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sellers").select("*").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery<SettingsData>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("key, value");
      if (error) throw new Error(error.message);
      const settingsData = (data || []).reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as any);
      return {
        pickup_dates: settingsData.pickup_dates || ["", ""],
        price: settingsData.price || 0,
      };
    },
  });

  const [newFlavor, setNewFlavor] = useState("");
  const [newSeller, setNewSeller] = useState("");
  const [localSettings, setLocalSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const addFlavorMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("flavors").insert([{ name }]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flavors"] });
      setNewFlavor("");
      showSuccess("Sabor adicionado com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const deleteFlavorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("flavors").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flavors"] });
      showSuccess("Sabor removido com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const addSellerMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("sellers").insert([{ name }]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      setNewSeller("");
      showSuccess("Vendedor adicionado com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const deleteSellerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sellers").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      showSuccess("Vendedor removido com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: SettingsData) => {
      const updates = [
        supabase.from("settings").upsert({ key: "pickup_dates", value: newSettings.pickup_dates }),
        supabase.from("settings").upsert({ key: "price", value: newSettings.price }),
      ];
      const results = await Promise.all(updates);
      results.forEach(({ error }) => {
        if (error) throw new Error(error.message);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      showSuccess("Configurações salvas com sucesso!");
    },
    onError: (error) => showError(`Erro: ${error.message}`),
  });

  const handleAddFlavor = () => {
    if (newFlavor.trim() !== "") addFlavorMutation.mutate(newFlavor.trim());
  };
  const handleDeleteFlavor = (id: string) => deleteFlavorMutation.mutate(id);
  const handleAddSeller = () => {
    if (newSeller.trim() !== "") addSellerMutation.mutate(newSeller.trim());
  };
  const handleDeleteSeller = (id: string) => deleteSellerMutation.mutate(id);
  const handleSaveSettings = () => {
    if (localSettings) updateSettingsMutation.mutate(localSettings);
  };

  if (isLoadingFlavors || isLoadingSellers || isLoadingSettings || !localSettings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Configure os sabores, vendedores, datas e preços para o evento.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Sabores de Pizza</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input value={newFlavor} onChange={(e) => setNewFlavor(e.target.value)} placeholder="Novo sabor" />
              <Button onClick={handleAddFlavor} disabled={addFlavorMutation.isPending}>Adicionar</Button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {flavors?.map((flavor) => (
                <li key={flavor.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <span>{flavor.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteFlavor(flavor.id)} disabled={deleteFlavorMutation.isPending}><Trash2 className="h-4 w-4" /></Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vendedores</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input value={newSeller} onChange={(e) => setNewSeller(e.target.value)} placeholder="Novo vendedor" />
              <Button onClick={handleAddSeller} disabled={addSellerMutation.isPending}>Adicionar</Button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {sellers?.map((seller) => (
                <li key={seller.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <span>{seller.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSeller(seller.id)} disabled={deleteSellerMutation.isPending}><Trash2 className="h-4 w-4" /></Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Datas e Preço</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date1">Data de Retirada 1</Label>
              <Input id="date1" type="date" value={localSettings.pickup_dates[0]} onChange={(e) => setLocalSettings({ ...localSettings, pickup_dates: [e.target.value, localSettings.pickup_dates[1]] })} />
            </div>
            <div>
              <Label htmlFor="date2">Data de Retirada 2</Label>
              <Input id="date2" type="date" value={localSettings.pickup_dates[1]} onChange={(e) => setLocalSettings({ ...localSettings, pickup_dates: [localSettings.pickup_dates[0], e.target.value] })} />
            </div>
            <div>
              <Label htmlFor="price">Valor da Pizza (R$)</Label>
              <Input id="price" type="number" value={localSettings.price} onChange={(e) => setLocalSettings({ ...localSettings, price: parseFloat(e.target.value) || 0 })} />
            </div>
            <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending} className="w-full">Salvar Datas e Preço</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;