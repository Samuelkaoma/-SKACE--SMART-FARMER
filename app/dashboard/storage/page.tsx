'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StorageItem {
  id: string
  crop_name: string
  quantity_kg: number
  stored_date: string
  storage_location: string
  quality_status: 'excellent' | 'good' | 'fair' | 'poor'
}

const storageDistribution = [
  { crop: 'Maize', kg: 450 },
  { crop: 'Sorghum', kg: 280 },
  { crop: 'Groundnuts', kg: 150 },
  { crop: 'Wheat', kg: 200 },
  { crop: 'Beans', kg: 100 },
]

export default function StoragePage() {
  const [items, setItems] = useState<StorageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity_kg: '',
    stored_date: '',
    storage_location: '',
    quality_status: 'good',
  })
  const supabase = createClient()

  useEffect(() => {
    loadStorage()
  }, [])

  const loadStorage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('storage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.log('[v0] Error loading storage:', error)
      toast.error('Failed to load storage')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('storage').insert({
        user_id: user.id,
        crop_name: formData.crop_name,
        quantity_kg: parseFloat(formData.quantity_kg),
        stored_date: formData.stored_date,
        storage_location: formData.storage_location,
        quality_status: formData.quality_status,
      })

      if (error) throw error

      toast.success('Item added to storage!')
      setFormData({ crop_name: '', quantity_kg: '', stored_date: '', storage_location: '', quality_status: 'good' })
      loadStorage()
    } catch (error) {
      console.log('[v0] Error adding item:', error)
      toast.error('Failed to add item')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return

    try {
      const { error } = await supabase.from('storage').delete().eq('id', id)
      if (error) throw error

      toast.success('Item deleted')
      loadStorage()
    } catch (error) {
      console.log('[v0] Error deleting item:', error)
      toast.error('Failed to delete')
    }
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity_kg, 0)
  const poorQuality = items.filter(i => i.quality_status === 'poor').length

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-emerald-100 text-emerald-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Storage & Inventory</h1>
          <p className="text-gray-500 mt-1">Track your stored produce and quality</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total Stored</p>
            <p className="text-3xl font-bold text-emerald-700">{Math.round(totalQuantity)}</p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Items</p>
            <p className="text-3xl font-bold text-teal-700">{items.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Avg. Quality</p>
            <p className="text-3xl font-bold text-amber-700">Good</p>
          </CardContent>
        </Card>
        {poorQuality > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-600 text-sm font-semibold">{poorQuality} Items at Risk</p>
                  <p className="text-xs text-red-500">Requires attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Form */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add to Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-sm">Crop Name *</Label>
              <Input
                placeholder="e.g., Maize"
                value={formData.crop_name}
                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Quantity (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="100"
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Stored Date *</Label>
              <Input
                type="date"
                value={formData.stored_date}
                onChange={(e) => setFormData({ ...formData, stored_date: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Location *</Label>
              <Input
                placeholder="Barn, Silo, etc"
                value={formData.storage_location}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Quality</Label>
              <select
                value={formData.quality_status}
                onChange={(e) => setFormData({ ...formData, quality_status: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-emerald-200 rounded-md"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isAdding ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle>Storage Distribution</CardTitle>
          <CardDescription>Breakdown of stored crops</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="crop" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }} />
              <Bar dataKey="kg" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Items List */}
      <div>
        <h2 className="text-xl font-bold text-emerald-900 mb-4">Stored Items ({items.length})</h2>
        {items.length === 0 ? (
          <Card className="border-emerald-200 text-center py-12">
            <p className="text-gray-500">No items in storage yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border-emerald-200 hover:shadow transition">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-bold text-emerald-900">{item.crop_name}</h3>
                          <p className="text-sm text-gray-500">{item.storage_location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getQualityColor(item.quality_status)}`}>
                          {item.quality_status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-semibold text-emerald-700">{item.quantity_kg} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stored Date</p>
                          <p className="font-semibold text-emerald-700">{new Date(item.stored_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-emerald-700">
                            {Math.floor((Date.now() - new Date(item.stored_date).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
