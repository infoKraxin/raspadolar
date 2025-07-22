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
  { key: 'deposit_banner', label: 'Banner de Depósito', uploadKey: 'deposit_banner' },
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
        const response = await fetch('https://api.raspadinha.fun/v1/api/setting', {
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
      const response = await fetch('https://api.raspadinha.fun/v1/api/setting/upload', {
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
        <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Upload de Imagens</h1>
                <p className="text-neutral-400 text-sm">Gerencie as imagens da plataforma</p>
              </div>
            </div>
          </div>

          {loading ? (
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Logotipo */}
              <Card className="bg-neutral-800 border-neutral-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Logotipo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-neutral-300 text-sm font-medium">{imageFields[0].label}</Label>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => handleUpload(imageFields[0].uploadKey, imageFields[0].key)}
                      disabled={saving || !files[imageFields[0].key]}
                    >
                      {saving && files[imageFields[0].key] ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Enviar'
                      )}
                    </Button>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, imageFields[0].key)}
                    disabled={saving}
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                  <div className="w-32 h-32 bg-neutral-700 rounded-lg border border-neutral-600 overflow-hidden">
                    {previews[imageFields[0].key] ? (
                      <img
                        src={previews[imageFields[0].key]!}
                        alt={imageFields[0].label}
                        className="w-32 h-32 object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-neutral-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-neutral-400 text-sm">Nenhuma imagem</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Banners */}
              <Card className="bg-neutral-800 border-neutral-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Banners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {imageFields.slice(1, 4).map(field => (
                    <div key={field.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-neutral-300 text-sm font-medium">{field.label}</Label>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => handleUpload(field.uploadKey, field.key)}
                          disabled={saving || !files[field.key]}
                        >
                          {saving && files[field.key] ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Enviar'
                          )}
                        </Button>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange(e, field.key)}
                        disabled={saving}
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                      <div className="aspect-video bg-neutral-700 rounded-lg border border-neutral-600 overflow-hidden">
                        {previews[field.key] ? (
                          <img
                            src={previews[field.key]!}
                            alt={field.label}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-neutral-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-neutral-400 text-sm">Nenhuma imagem</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Banners de Autenticação e Depósito */}
              <Card className="bg-neutral-800 border-neutral-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Banners de Autenticação e Depósito
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {imageFields.slice(4).map(field => (
                    <div key={field.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-neutral-300 text-sm font-medium">{field.label}</Label>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => handleUpload(field.uploadKey, field.key)}
                          disabled={saving || !files[field.key]}
                        >
                          {saving && files[field.key] ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Enviar'
                          )}
                        </Button>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange(e, field.key)}
                        disabled={saving}
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                      <div className="aspect-video bg-neutral-700 rounded-lg border border-neutral-600 overflow-hidden">
                        {previews[field.key] ? (
                          <img
                            src={previews[field.key]!}
                            alt={field.label}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-neutral-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-neutral-400 text-sm">Nenhuma imagem</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {error && (
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
