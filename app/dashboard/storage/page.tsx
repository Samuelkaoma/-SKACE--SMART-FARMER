'use client'

import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import { AlertTriangle, Edit2, Package2, Plus, Save, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDashboardSession } from '@/components/dashboard/dashboard-session-provider'
import { createClient } from '@/lib/supabase/client'
import type { StorageRecord } from '@/lib/types/farm'

const CATEGORIES = ['produce', 'seeds', 'fertilizer', 'equipment', 'other']
const CONDITIONS = ['dry', 'cool', 'ventilated', 'sealed', 'outdoor']
const QUALITY_STATUSES = ['good', 'fair', 'poor']

type StorageFormState = {
  item_name: string
  category: string
  quantity: string
  unit: string
  storage_location: string
  storage_condition: string
  purchase_price_per_unit: string
  current_value: string
  expiry_date: string
  last_checked_date: string
  quality_status: string
  notes: string
}

const emptyForm: StorageFormState = {
  item_name: '',
  category: 'produce',
  quantity: '',
  unit: 'kg',
  storage_location: '',
  storage_condition: 'dry',
  purchase_price_per_unit: '',
  current_value: '',
  expiry_date: '',
  last_checked_date: '',
  quality_status: 'good',
  notes: '',
}

function numberOrNull(value: string) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function StoragePage() {
  const { userId } = useDashboardSession()
  const [items, setItems] = useState<StorageRecord[]>([])
  const [formData, setFormData] = useState<StorageFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    void loadStorage()
  }, [userId])

  async function loadStorage() {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('storage')
        .select(
          'id, item_name, category, quantity, unit, storage_location, storage_condition, purchase_price_per_unit, current_value, expiry_date, last_checked_date, quality_status, notes, created_at',
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setItems((data ?? []) as StorageRecord[])
    } catch (error) {
      console.error('Error loading storage:', error)
      toast.error('Failed to load storage')
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setFormData(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)

    try {
      if (!userId) {
        return
      }

      const payload = {
        user_id: userId,
        item_name: formData.item_name,
        category: formData.category,
        quantity: numberOrNull(formData.quantity),
        unit: formData.unit,
        storage_location: formData.storage_location || null,
        storage_condition: formData.storage_condition || null,
        purchase_price_per_unit: numberOrNull(formData.purchase_price_per_unit),
        current_value: numberOrNull(formData.current_value),
        expiry_date: formData.expiry_date || null,
        last_checked_date: formData.last_checked_date || null,
        quality_status: formData.quality_status,
        notes: formData.notes || null,
      }

      const result = editingId
        ? await supabase.from('storage').update(payload).eq('id', editingId).eq('user_id', userId)
        : await supabase.from('storage').insert(payload)

      if (result.error) {
        throw result.error
      }

      toast.success(editingId ? 'Storage updated successfully' : 'Storage item added successfully')
      resetForm()
      await loadStorage()
    } catch (error) {
      console.error('Error saving storage item:', error)
      toast.error('Failed to save storage item')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: StorageRecord) {
    setEditingId(item.id)
    setFormData({
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      storage_location: item.storage_location ?? '',
      storage_condition: item.storage_condition ?? 'dry',
      purchase_price_per_unit: item.purchase_price_per_unit?.toString() ?? '',
      current_value: item.current_value?.toString() ?? '',
      expiry_date: item.expiry_date ?? '',
      last_checked_date: item.last_checked_date ?? '',
      quality_status: item.quality_status ?? 'good',
      notes: item.notes ?? '',
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this storage item?')) {
      return
    }

    if (!userId) {
      return
    }

    try {
      const { error } = await supabase.from('storage').delete().eq('id', id).eq('user_id', userId)

      if (error) {
        throw error
      }

      toast.success('Storage item deleted')
      await loadStorage()
    } catch (error) {
      console.error('Error deleting storage item:', error)
      toast.error('Failed to delete storage item')
    }
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + (item.current_value ?? 0), 0)
  const poorQuality = items.filter((item) => item.quality_status === 'poor').length
  const expiringSoon = items.filter((item) => {
    if (!item.expiry_date) {
      return false
    }

    const days = Math.floor(
      (new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )

    return days >= 0 && days <= 14
  }).length

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Storage and inventory
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Track stock quality before value is lost
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Good storage data helps farmers know what can be sold, what needs inspection, and where spoilage risk is building up.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Items tracked" value={`${items.length}`} />
        <MetricCard label="Total quantity" value={`${Math.round(totalQuantity)}`} />
        <MetricCard label="Estimated value" value={`ZMW ${Math.round(totalValue)}`} />
        <MetricCard label="At risk" value={`${poorQuality + expiringSoon}`} tone="warning" />
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Update storage item' : 'Add storage item'}
          </CardTitle>
          <CardDescription>
            Record quality, condition, quantity, and expiry so the platform can surface realistic inventory risk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
            <Field label="Item name" required>
              <Input
                value={formData.item_name}
                onChange={(event) => setFormData({ ...formData, item_name: event.target.value })}
                placeholder="Maize grain"
                required
              />
            </Field>
            <Field label="Category" required>
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quantity" required>
              <Input
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
                placeholder="500"
                required
              />
            </Field>
            <Field label="Unit" required>
              <Input
                value={formData.unit}
                onChange={(event) => setFormData({ ...formData, unit: event.target.value })}
                placeholder="kg"
                required
              />
            </Field>
            <Field label="Storage location">
              <Input
                value={formData.storage_location}
                onChange={(event) =>
                  setFormData({ ...formData, storage_location: event.target.value })
                }
                placeholder="Silo 1"
              />
            </Field>
            <Field label="Storage condition">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.storage_condition}
                onChange={(event) =>
                  setFormData({ ...formData, storage_condition: event.target.value })
                }
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quality status">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.quality_status}
                onChange={(event) =>
                  setFormData({ ...formData, quality_status: event.target.value })
                }
              >
                {QUALITY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Last checked">
              <Input
                type="date"
                value={formData.last_checked_date}
                onChange={(event) =>
                  setFormData({ ...formData, last_checked_date: event.target.value })
                }
              />
            </Field>
            <Field label="Expiry date">
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(event) => setFormData({ ...formData, expiry_date: event.target.value })}
              />
            </Field>
            <Field label="Purchase price / unit">
              <Input
                type="number"
                step="0.1"
                value={formData.purchase_price_per_unit}
                onChange={(event) =>
                  setFormData({ ...formData, purchase_price_per_unit: event.target.value })
                }
                placeholder="120"
              />
            </Field>
            <Field label="Current value (ZMW)">
              <Input
                type="number"
                step="0.1"
                value={formData.current_value}
                onChange={(event) => setFormData({ ...formData, current_value: event.target.value })}
                placeholder="60000"
              />
            </Field>
            <div className="md:col-span-4">
              <Field label="Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Add inspection notes, pest issues, spoilage concerns, or handling instructions."
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} type="submit">
                {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : editingId ? 'Save storage changes' : 'Add storage item'}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-bold text-emerald-900">Inventory records</h2>
        {isLoading ? (
          <Card className="border-emerald-200 p-8 text-center text-slate-500">Loading inventory...</Card>
        ) : items.length === 0 ? (
          <Card className="border-emerald-200 py-12 text-center">
            <Package2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No storage items yet. Add produce, seeds, or equipment to monitor inventory quality.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border-emerald-200 shadow-sm shadow-emerald-100">
                <CardContent className="pt-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.item_name}</h3>
                          <p className="text-sm text-slate-500">
                            {item.category} | {item.storage_location ?? 'No location'}
                          </p>
                        </div>
                        <QualityBadge status={item.quality_status ?? 'good'} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <InfoPill label="Quantity" value={`${item.quantity} ${item.unit}`} />
                        <InfoPill label="Condition" value={item.storage_condition ?? 'Unknown'} />
                        <InfoPill label="Value" value={`ZMW ${item.current_value ?? 0}`} />
                        <InfoPill label="Expiry" value={item.expiry_date ?? 'Not set'} />
                      </div>
                      {item.notes ? (
                        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                          {item.notes}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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

function Field({
  children,
  label,
  required,
}: {
  children: ReactNode
  label: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required ? ' *' : ''}
      </Label>
      {children}
    </div>
  )
}

function MetricCard({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'warning'
}) {
  const styles = {
    default: 'border-emerald-200 bg-white text-emerald-900',
    warning: 'border-rose-200 bg-rose-50 text-rose-900',
  }[tone]

  return (
    <Card className={styles}>
      <CardContent className="pt-6">
        <p className="text-sm opacity-70">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

function InfoPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function QualityBadge({
  status,
}: {
  status: string
}) {
  const styles =
    status === 'poor'
      ? 'bg-rose-50 text-rose-700'
      : status === 'fair'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-emerald-50 text-emerald-700'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>
      {status === 'poor' ? <AlertTriangle className="h-3.5 w-3.5" /> : null}
      {status}
    </span>
  )
}
