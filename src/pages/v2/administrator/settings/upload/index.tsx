import { useState, useEffect, ChangeEvent } from 'react';
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

const imageFields = [
  { key: 'plataform_logo', label: 'Logo da Plataforma', uploadKey: 'logo' },
  { key: 'plataform_banner', label: 'Banner Principal', uploadKey: 'banner' },
  { key: 'plataform_banner_2', label: 'Banner Secundário', uploadKey: 'banner_2' },
  { key: 'plataform_banner_3', label: 'Banner Terciário', uploadKey: 'banner_3' },
  { key: 'register_banner', label: 'Banner de Cadastro', uploadKey: 'register_banner' },
  { key: 'login_banner', label: 'Banner de Login', uploadKey: 'login_banner' },
];

export default function SettingsUploadPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

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
        setSettings(data.data[0] || {});
        // Preencher previews com as imagens atuais
        const previewsObj: { [key: string]: string | null } = {};
        imageFields.forEach(f => {
          previewsObj[f.key] = data.data[0]?.[f.key] || null;
        });
        setPreviews(previewsObj);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [fieldKey]: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setPreviews(prev => ({ ...prev, [fieldKey]: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (uploadKey: string, fieldKey: string) => {
    if (!files[fieldKey]) {
      toast.error('Selecione um arquivo para enviar.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append(uploadKey, files[fieldKey]!);
      const response = await fetch('https://api.raspapixoficial.com/v1/api/setting/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao enviar imagem');
      toast.success('Imagem enviada com sucesso!');
      // Atualizar preview após upload
      setSettings((prev: any) => ({ ...prev, [fieldKey]: data.data?.[fieldKey] || prev[fieldKey] }));
      setFiles(prev => ({ ...prev, [fieldKey]: null }));
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
                <BreadcrumbLink href="/v2/administrator/settings" className="text-neutral-400 hover:text-white">
                  Configurações
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Upload de Imagens</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col bg-neutral-900 p-6 min-h-[calc(100vh-4rem)]">
          <div className="flex justify-center items-start w-full h-full">
            <div className="w-full max-w-2xl">
              <Card className="bg-neutral-800 border border-neutral-700 p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Upload de Imagens da Plataforma</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <form className="space-y-8">
                    {imageFields.map(field => (
                      <div key={field.key} className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-neutral-700 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex-1">
                          <Label className="text-white font-medium mb-2 block">{field.label}</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileChange(e, field.key)}
                            disabled={saving}
                          />
                          <div className="mt-2">
                            {previews[field.key] ? (
                              <img
                                src={previews[field.key]!}
                                alt={field.label}
                                className="max-h-32 rounded-lg border border-neutral-700 bg-neutral-900 object-contain"
                              />
                            ) : (
                              <div className="text-neutral-400 text-sm italic">Nenhuma imagem enviada ainda.</div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <Button
                            type="button"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg"
                            onClick={() => handleUpload(field.uploadKey, field.key)}
                            disabled={saving || !files[field.key]}
                          >
                            {saving && files[field.key] ? 'Enviando...' : 'Enviar'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
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
