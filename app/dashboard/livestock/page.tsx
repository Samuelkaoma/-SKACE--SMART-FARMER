'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Edit2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LivestockRecord {
  id: string
  type: string
  breed: string
  count: number
  acquired_date: string
  health_status: 'excellent' | 'good' | 'fair' | 'poor'
  weight_kg: number
  notes: string
}

const LIVESTOCK_TYPES = [
  'Cattle',
  'Goats',
  'Sheep',
  'Pigs',
  'Chickens',
  'Ducks',
  'Rabbits',
  'Bees',
]

const productionData = [
  { week: 'W1', eggs: 120, meat: 45, milk: 200 },
  { week: 'W2', eggs: 135, meat: 48, milk: 210 },
  { week: 'W3', eggs: 142, meat: 50, milk: 215 },
  { week: 'W4', eggs: 138, meat: 52, milk: 220 },
]

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<LivestockRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    breed: '',
    count: '',
    acquired_date: '',
    health_status: 'good',
    weight_kg: '',
  })
  const supabase = createClient()

  useEffect(() => {
    loadLivestock()
  }, [])

  const loadLivestock = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLivestock(data || [])
    } catch (error) {
      console.log('[v0] Error loading livestock:', error)
      toast.error('Failed to load livestock')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLivestock = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('livestock').insert({
        user_id: user.id,
        type: formData.type,
        breed: formData.breed,
        count: parseInt(formData.count),
        acquired_date: formData.acquired_date,
        health_status: formData.health_status,
        weight_kg: parseFloat(formData.weight_kg),
        notes: '',
      })

      if (error) throw error

      toast.success('Livestock record added!')
      setFormData({ type: '', breed: '', count: '', acquired_date: '', health_status: 'good', weight_kg: '' })
      loadLivestock()
    } catch (error) {
      console.log('[v0] Error adding livestock:', error)
      toast.error('Failed to add livestock')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteLivestock = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('livestock').delete().eq('id', id)
      if (error) throw error

      toast.success('Livestock record deleted')
      loadLivestock()
    } catch (error) {
      console.log('[v0] Error deleting livestock:', error)
      toast.error('Failed to delete')
    }
  }

  const getHealthColor = (status: string) => {
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

  const totalAnimals = livestock.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Livestock Management</h1>
          <p className="text-gray-500 mt-1">Monitor health and production of your animals</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total Animals</p>
            <p className="text-3xl font-bold text-emerald-700">{totalAnimals}</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Records</p>
            <p className="text-3xl font-bold text-teal-700">{livestock.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Avg Health</p>
            <p className="text-3xl font-bold text-amber-700">Good</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Livestock Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLivestock} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm">Type *</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="mt-2 w-full px-3 py-2 border border-emerald-200 rounded-md"
              >
                <option value="">Select type</option>
                {LIVESTOCK_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-sm">Breed *</Label>
              <Input
                placeholder="Breed name"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Count *</Label>
              <Input
                type="number"
                placeholder="Number of animals"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Acquired Date *</Label>
              <Input
                type="date"
                value={formData.acquired_date}
                onChange={(e) => setFormData({ ...formData, acquired_date: e.target.value })}
                required
                className="mt-2 border-emerald-200"
              />
            </div>

            <div>
              <Label className="text-sm">Health Status</Label>
              <select
                value={formData.health_status}
                onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-emerald-200 rounded-md"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <Label className="text-sm">Avg Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="50"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="mt-2 border-emerald-200"
              />
            </div>

            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isAdding ? 'Adding...' : 'Add Record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Production Chart */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle>Production Trends</CardTitle>
          <CardDescription>Weekly production metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }} />
              <Line type="monotone" dataKey="eggs" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="milk" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Livestock List */}
      <div>
        <h2 className="text-xl font-bold text-emerald-900 mb-4">Your Livestock ({livestock.length})</h2>
        {livestock.length === 0 ? (
          <Card className="border-emerald-200 text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No livestock records yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {livestock.map((animal) => (
              <Card key={animal.id} className="border-emerald-200 hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-emerald-900">{animal.type}</h3>
                        <p className="text-sm text-gray-500">{animal.breed}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHealthColor(animal.health_status)}`}>
                        {animal.health_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Count</p>
                        <p className="font-bold text-emerald-700">{animal.count}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-bold text-emerald-700">{animal.weight_kg}kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Acquired</p>
                        <p className="font-bold text-emerald-700 text-xs">{new Date(animal.acquired_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-emerald-100">
                      <Button size="sm" variant="outline" className="flex-1 border-emerald-200">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteLivestock(animal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
