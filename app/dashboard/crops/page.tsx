'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Sprout,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface Crop {
  id: string
  name: string
  type: string
  plot_size: number
  planted_date: string
  expected_harvest: string
  status: 'planning' | 'active' | 'harvesting' | 'harvested'
  health_score: number
  estimated_yield: number
}

const ZAMBIAN_CROPS = [
  'Maize',
  'Sorghum',
  'Millet',
  'Wheat',
  'Groundnuts',
  'Soybeans',
  'Cotton',
  'Sunflower',
  'Rice',
  'Cassava',
]

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plot_size: '',
    planted_date: '',
    expected_harvest: '',
  })
  const supabase = createClient()

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCrops(data || [])
    } catch (error) {
      console.log('[v0] Error loading crops:', error)
      toast.error('Failed to load crops')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('crops').insert({
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        plot_size: parseFloat(formData.plot_size),
        planted_date: formData.planted_date,
        expected_harvest: formData.expected_harvest,
        status: 'active',
        health_score: 85,
        estimated_yield: 0,
      })

      if (error) throw error

      toast.success('Crop added successfully!')
      setFormData({ name: '', type: '', plot_size: '', planted_date: '', expected_harvest: '' })
      loadCrops()
    } catch (error) {
      console.log('[v0] Error adding crop:', error)
      toast.error('Failed to add crop')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCrop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return

    try {
      const { error } = await supabase.from('crops').delete().eq('id', id)
      if (error) throw error

      toast.success('Crop deleted')
      loadCrops()
    } catch (error) {
      console.log('[v0] Error deleting crop:', error)
      toast.error('Failed to delete crop')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'harvesting':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'harvested':
        return <Sprout className="w-5 h-5 text-emerald-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">My Crops</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your crop plantings</p>
        </div>
      </div>

      {/* Add New Crop Form */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Crop
          </CardTitle>
          <CardDescription>Record a new crop planting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCrop} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm">Crop Name *</Label>
              <Input
                id="name"
                placeholder="Enter crop name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-sm">Crop Type *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="mt-2 w-full px-3 py-2 border border-emerald-200 rounded-md bg-white"
              >
                <option value="">Select crop type</option>
                {ZAMBIAN_CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="plot_size" className="text-sm">Plot Size (hectares) *</Label>
              <Input
                id="plot_size"
                type="number"
                step="0.1"
                placeholder="2.5"
                value={formData.plot_size}
                onChange={(e) => setFormData({ ...formData, plot_size: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label htmlFor="planted_date" className="text-sm">Planted Date *</Label>
              <Input
                id="planted_date"
                type="date"
                value={formData.planted_date}
                onChange={(e) => setFormData({ ...formData, planted_date: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label htmlFor="expected_harvest" className="text-sm">Expected Harvest *</Label>
              <Input
                id="expected_harvest"
                type="date"
                value={formData.expected_harvest}
                onChange={(e) => setFormData({ ...formData, expected_harvest: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isAdding ? 'Adding...' : 'Add Crop'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Crops List */}
      <div>
        <h2 className="text-xl font-bold text-emerald-900 mb-4">Your Crops ({crops.length})</h2>
        {crops.length === 0 ? (
          <Card className="border-emerald-200 text-center py-12">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No crops yet. Add your first crop to get started!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <Card key={crop.id} className="border-emerald-200 hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-emerald-900">{crop.name}</h3>
                        <p className="text-sm text-gray-500">{crop.type}</p>
                      </div>
                      {getStatusIcon(crop.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Plot Size</p>
                        <p className="font-semibold text-emerald-700">{crop.plot_size} ha</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-semibold capitalize text-emerald-700">{crop.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Health</p>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${getHealthColor(crop.health_score)}`}>
                          {crop.health_score}%
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Est. Yield</p>
                        <p className="font-semibold text-emerald-700">{crop.estimated_yield} kg</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-100">
                      <p className="text-xs text-gray-500 mb-2">
                        📅 Planted: {new Date(crop.planted_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        🎯 Harvest: {new Date(crop.expected_harvest).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-emerald-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCrop(crop.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
