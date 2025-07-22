import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [plataformName, setPlataformName] = useState('');
  const [plataformDescription, setPlataformDescription] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://api.raspapixoficial.com/v1/api/setting', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro ao buscar configurações');
        const setting = data.data[0];
        setPlataformName(setting.plataform_name || '');
        setPlataformDescription(setting.plataform_description || '');
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/setting/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plataform_name: plataformName,
          plataform_description: plataformDescription
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao salvar configurações');
      toast.success('Configurações salvas com sucesso!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
          <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                  Administração
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Configurações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col  bg-neutral-900 ">
          <div className="flex justify-center items-center w-full h-full">
            <div className="w-full max-w-xl">
              <Card className="bg-neutral-800 border border-neutral-700 p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Configurações da Plataforma</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    <div>
                      <Label htmlFor="plataformName" className="text-white font-medium mb-2 block">Nome da Plataforma</Label>
                      <Input
                        id="plataformName"
                        value={plataformName}
                        onChange={e => setPlataformName(e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white"
                        placeholder="Digite o nome da plataforma"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="plataformDescription" className="text-white font-medium mb-2 block">Descrição</Label>
                      <Input
                        id="plataformDescription"
                        value={plataformDescription}
                        onChange={e => setPlataformDescription(e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white"
                        placeholder="Digite a descrição da plataforma"
                        disabled={saving}
                      />
                    </div>
                    {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
                    <Button
                      type="submit"
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20"
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
