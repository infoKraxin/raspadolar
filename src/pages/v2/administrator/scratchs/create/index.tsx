import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Upload, ArrowLeft, Gamepad2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

interface Prize {
  name: string
  description: string
  type: 'MONEY' | 'PRODUCT'
  value?: number
  product_name?: string
  redemption_value?: number
  probability: number
  image?: File
}

interface ScratchCard {
  name: string
  description: string
  price: number
  target_rtp: number
  is_active: boolean
}

export default function CreateScratchCard() {
  const router = useRouter()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [scratchCardImage, setScratchCardImage] = useState<File | null>(null)
  
  const [scratchCard, setScratchCard] = useState<ScratchCard>({
    name: '',
    description: '',
    price: 0,
    target_rtp: 85.0,
    is_active: true
  })
  
  const [prizes, setPrizes] = useState<Prize[]>([
    {
      name: '',
      description: '',
      type: 'MONEY',
      value: 0,
      probability: 0,
      image: undefined
    }
  ])

  const addPrize = () => {
    setPrizes([...prizes, {
      name: '',
      description: '',
      type: 'MONEY',
      value: 0,
      probability: 0,
      image: undefined
    }])
  }

  const removePrize = (index: number) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter((_, i) => i !== index))
    }
  }

  const updatePrize = (index: number, field: keyof Prize, value: any) => {
    const updatedPrizes = [...prizes]
    updatedPrizes[index] = { ...updatedPrizes[index], [field]: value }
    setPrizes(updatedPrizes)
  }

  const handleScratchCardImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScratchCardImage(e.target.files[0])
    }
  }

  const handlePrizeImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updatePrize(index, 'image', e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      alert('Token de autenticação não encontrado')
      return
    }

    if (!scratchCardImage) {
      alert('Por favor, selecione uma imagem para a raspadinha')
      return
    }

    // Validar se todos os prêmios têm imagem
    const prizesWithoutImage = prizes.filter(prize => !prize.image)
    if (prizesWithoutImage.length > 0) {
      alert('Por favor, adicione imagens para todos os prêmios')
      return
    }

    setLoading(true)
    
    try {
      const formData = new FormData()
      
      // Adicionar dados da raspadinha
      formData.append('scratchCard', JSON.stringify(scratchCard))
      
      // Adicionar prêmios
      formData.append('prizes', JSON.stringify(prizes.map(prize => ({
        name: prize.name,
        description: prize.description,
        type: prize.type,
        ...(prize.type === 'MONEY' ? { value: prize.value } : {
          product_name: prize.product_name,
          redemption_value: prize.redemption_value
        }),
        probability: prize.probability
      }))))
      
      // Adicionar imagem da raspadinha
      formData.append('scratchcard_image', scratchCardImage)
      
      // Adicionar imagens dos prêmios
      prizes.forEach((prize, index) => {
        if (prize.image) {
          formData.append('prize_images', prize.image)
        }
      })
      
      const response = await fetch('https://api.raspa.ae/v1/api/scratchcards/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (response.ok) {
        alert('Raspadinha criada com sucesso!')
        router.push('/v2/administrator/scratchs')
      } else {
        const errorData = await response.json()
        alert(`Erro ao criar raspadinha: ${errorData.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao criar raspadinha:', error)
      alert('Erro ao criar raspadinha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className={poppins.className}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-neutral-600"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/v2/administrator/scratchs" className="text-neutral-400 hover:text-white">
                    Raspadinhas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Criar Nova</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Criar Nova Raspadinha</h1>
                  <p className="text-neutral-400 text-sm">Preencha os dados para criar uma nova raspadinha</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
                className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados da Raspadinha */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Informações da Raspadinha</CardTitle>
            <CardDescription className="text-neutral-400">Configure os dados básicos da raspadinha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300">Nome *</Label>
                <Input
                  id="name"
                  value={scratchCard.name}
                  onChange={(e) => setScratchCard({...scratchCard, name: e.target.value})}
                  placeholder="Ex: Raspadinha Premium"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="text-neutral-300">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={scratchCard.price}
                  onChange={(e) => setScratchCard({...scratchCard, price: parseFloat(e.target.value) || 0})}
                  placeholder="10.00"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-neutral-300">Descrição *</Label>
              <Textarea
                id="description"
                value={scratchCard.description}
                onChange={(e) => setScratchCard({...scratchCard, description: e.target.value})}
                placeholder="Uma raspadinha com prêmios incríveis!"
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_rtp" className="text-neutral-300">RTP Alvo (%) *</Label>
                <Input
                  id="target_rtp"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={scratchCard.target_rtp}
                  onChange={(e) => setScratchCard({...scratchCard, target_rtp: parseFloat(e.target.value) || 0})}
                  placeholder="85.0"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={scratchCard.is_active}
                  onCheckedChange={(checked) => setScratchCard({...scratchCard, is_active: checked})}
                />
                <Label htmlFor="is_active" className="text-neutral-300">Raspadinha Ativa</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scratchcard_image" className="text-neutral-300">Imagem da Raspadinha *</Label>
              <Input
                id="scratchcard_image"
                type="file"
                accept="image/*"
                onChange={handleScratchCardImageChange}
                className="bg-neutral-700 border-neutral-600 text-white file:bg-neutral-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-medium hover:file:bg-neutral-500"
                required
              />
              {scratchCardImage && (
                <p className="text-sm text-neutral-400">
                  Arquivo selecionado: {scratchCardImage.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prêmios */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Prêmios</CardTitle>
                <CardDescription className="text-neutral-400">Configure os prêmios disponíveis na raspadinha</CardDescription>
              </div>
              <Button type="button" onClick={addPrize} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Prêmio
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {prizes.map((prize, index) => (
              <div key={index} className="border border-neutral-600 rounded-lg p-4 space-y-4 bg-neutral-700/50">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Prêmio {index + 1}</Badge>
                  {prizes.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePrize(index)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-neutral-300">Nome do Prêmio *</Label>
                    <Input
                      value={prize.name}
                      onChange={(e) => updatePrize(index, 'name', e.target.value)}
                      placeholder="Ex: R$ 100,00"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-neutral-300">Tipo de Prêmio *</Label>
                    <Select
                      value={prize.type}
                      onValueChange={(value: 'MONEY' | 'PRODUCT') => updatePrize(index, 'type', value)}
                    >
                      <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-700 border-neutral-600">
                        <SelectItem value="MONEY" className="text-white hover:bg-neutral-600">Dinheiro</SelectItem>
                        <SelectItem value="PRODUCT" className="text-white hover:bg-neutral-600">Produto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-neutral-300">Descrição *</Label>
                  <Input
                    value={prize.description}
                    onChange={(e) => updatePrize(index, 'description', e.target.value)}
                    placeholder="Ex: Prêmio em dinheiro"
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                {prize.type === 'MONEY' ? (
                  <div className="space-y-2">
                    <Label className="text-neutral-300">Valor (R$) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={prize.value || ''}
                      onChange={(e) => updatePrize(index, 'value', parseFloat(e.target.value) || 0)}
                      placeholder="100.00"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-300">Nome do Produto *</Label>
                      <Input
                        value={prize.product_name || ''}
                        onChange={(e) => updatePrize(index, 'product_name', e.target.value)}
                        placeholder="Ex: iPhone 15 128GB"
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-neutral-300">Valor de Resgate (R$) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={prize.redemption_value || ''}
                        onChange={(e) => updatePrize(index, 'redemption_value', parseFloat(e.target.value) || 0)}
                        placeholder="500.00"
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-neutral-300">Probabilidade (%) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={prize.probability}
                    onChange={(e) => updatePrize(index, 'probability', parseFloat(e.target.value) || 0)}
                    placeholder="5.0"
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-neutral-300">Imagem do Prêmio *</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePrizeImageChange(index, e)}
                    className="bg-neutral-700 border-neutral-600 text-white file:bg-neutral-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-medium hover:file:bg-neutral-500"
                    required
                  />
                  {prize.image && (
                    <p className="text-sm text-neutral-400">
                      Arquivo selecionado: {prize.image.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-neutral-300">Preço da Raspadinha:</p>
                <p className="text-neutral-400">{formatCurrency(scratchCard.price)}</p>
              </div>
              <div>
                <p className="font-medium text-neutral-300">RTP Alvo:</p>
                <p className="text-neutral-400">{scratchCard.target_rtp}%</p>
              </div>
              <div>
                <p className="font-medium text-neutral-300">Total de Prêmios:</p>
                <p className="text-neutral-400">{prizes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
            {loading ? 'Criando...' : 'Criar Raspadinha'}
          </Button>
        </div>
      </form>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}