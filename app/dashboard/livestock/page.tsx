'use client'

import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import {
  Edit2,
  Heart,
  Plus,
  Save,
  ShieldCheck,
  Syringe,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import type { LivestockRecord } from '@/lib/types/farm'

const ANIMAL_TYPES = ['Cattle', 'Goats', 'Sheep', 'Pigs', 'Chickens', 'Ducks', 'Rabbits', 'Bees']
const HEALTH_STATUSES = ['healthy', 'sick', 'vaccinated', 'recovering']
const PRODUCTION_TYPES = ['meat', 'dairy', 'eggs', 'wool', 'honey']

type LivestockFormState = {
  animal_type: string
  breed: string
  quantity: string
  average_weight_kg: string
  acquisition_date: string
  health_status: string
  last_vaccinated: string
  next_vaccination_due: string
  feed_type: string
  daily_feed_quantity_kg: string
  water_liters_per_day: string
  shelter_type: string
  space_per_animal_sqm: string
  production_type: string
  monthly_production: string
  production_unit: string
  estimated_value: string
  notes: string
}

const emptyForm: LivestockFormState = {
  animal_type: '',
  breed: '',
  quantity: '',
  average_weight_kg: '',
  acquisition_date: '',
  health_status: 'healthy',
  last_vaccinated: '',
  next_vaccination_due: '',
  feed_type: '',
  daily_feed_quantity_kg: '',
  water_liters_per_day: '',
  shelter_type: '',
  space_per_animal_sqm: '',
  production_type: '',
  monthly_production: '',
  production_unit: '',
  estimated_value: '',
  notes: '',
}

function numberOrNull(value: string) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<LivestockRecord[]>([])
  const [formData, setFormData] = useState<LivestockFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    void loadLivestock()
  }, [])

  async function loadLivestock() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const { data, error } = await supabase
        .from('livestock')
        .select(
          'id, animal_type, breed, quantity, average_weight_kg, acquisition_date, health_status, last_vaccinated, next_vaccination_due, feed_type, daily_feed_quantity_kg, water_liters_per_day, shelter_type, space_per_animal_sqm, mortality_count, production_type, monthly_production, production_unit, estimated_value, notes, created_at',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setLivestock((data ?? []) as LivestockRecord[])
    } catch (error) {
      console.error('Error loading livestock:', error)
      toast.error('Failed to load livestock')
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const payload = {
        user_id: user.id,
        animal_type: formData.animal_type,
        breed: formData.breed || null,
        quantity: numberOrNull(formData.quantity),
        average_weight_kg: numberOrNull(formData.average_weight_kg),
        acquisition_date: formData.acquisition_date || null,
        health_status: formData.health_status,
        last_vaccinated: formData.last_vaccinated || null,
        next_vaccination_due: formData.next_vaccination_due || null,
        feed_type: formData.feed_type || null,
        daily_feed_quantity_kg: numberOrNull(formData.daily_feed_quantity_kg),
        water_liters_per_day: numberOrNull(formData.water_liters_per_day),
        shelter_type: formData.shelter_type || null,
        space_per_animal_sqm: numberOrNull(formData.space_per_animal_sqm),
        production_type: formData.production_type || null,
        monthly_production: numberOrNull(formData.monthly_production),
        production_unit: formData.production_unit || null,
        estimated_value: numberOrNull(formData.estimated_value),
        notes: formData.notes || null,
      }

      const result = editingId
        ? await supabase.from('livestock').update(payload).eq('id', editingId).eq('user_id', user.id)
        : await supabase.from('livestock').insert(payload)

      if (result.error) {
        throw result.error
      }

      toast.success(editingId ? 'Livestock updated successfully' : 'Livestock added successfully')
      resetForm()
      await loadLivestock()
    } catch (error) {
      console.error('Error saving livestock:', error)
      toast.error('Failed to save livestock')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(record: LivestockRecord) {
    setEditingId(record.id)
    setFormData({
      animal_type: record.animal_type,
      breed: record.breed ?? '',
      quantity: record.quantity?.toString() ?? '',
      average_weight_kg: record.average_weight_kg?.toString() ?? '',
      acquisition_date: record.acquisition_date ?? '',
      health_status: record.health_status ?? 'healthy',
      last_vaccinated: record.last_vaccinated ?? '',
      next_vaccination_due: record.next_vaccination_due ?? '',
      feed_type: record.feed_type ?? '',
      daily_feed_quantity_kg: record.daily_feed_quantity_kg?.toString() ?? '',
      water_liters_per_day: record.water_liters_per_day?.toString() ?? '',
      shelter_type: record.shelter_type ?? '',
      space_per_animal_sqm: record.space_per_animal_sqm?.toString() ?? '',
      production_type: record.production_type ?? '',
      monthly_production: record.monthly_production?.toString() ?? '',
      production_unit: record.production_unit ?? '',
      estimated_value: record.estimated_value?.toString() ?? '',
      notes: record.notes ?? '',
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this livestock record?')) {
      return
    }

    try {
      const { error } = await supabase.from('livestock').delete().eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Livestock deleted')
      await loadLivestock()
    } catch (error) {
      console.error('Error deleting livestock:', error)
      toast.error('Failed to delete livestock')
    }
  }

  const totalAnimals = livestock.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  const vaccinationDue = livestock.filter((item) => {
    if (!item.next_vaccination_due) {
      return false
    }

    const days = Math.floor(
      (new Date(item.next_vaccination_due).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )

    return days >= 0 && days <= 10
  }).length
  const sickAnimals = livestock.filter((item) =>
    ['sick', 'recovering'].includes((item.health_status ?? '').toLowerCase()),
  ).length

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Livestock operations
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Record health, vaccination, feed, and production signals
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Strong livestock tracking gives the app a better chance of spotting upcoming vaccination risk, feeding issues, and production changes.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Animals tracked" value={`${totalAnimals}`} />
        <MetricCard label="Groups" value={`${livestock.length}`} />
        <MetricCard label="Vaccination due" value={`${vaccinationDue}`} tone="accent" />
        <MetricCard label="Need attention" value={`${sickAnimals}`} tone="warning" />
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Update livestock record' : 'Add livestock record'}
          </CardTitle>
          <CardDescription>
            Capture herd quantity, health, vaccination, feed, and production details in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
            <Field label="Animal type" required>
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.animal_type}
                onChange={(event) => setFormData({ ...formData, animal_type: event.target.value })}
                required
              >
                <option value="">Select animal type</option>
                {ANIMAL_TYPES.map((animalType) => (
                  <option key={animalType} value={animalType}>
                    {animalType}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Breed">
              <Input
                value={formData.breed}
                onChange={(event) => setFormData({ ...formData, breed: event.target.value })}
                placeholder="Boran"
              />
            </Field>
            <Field label="Quantity" required>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
                placeholder="20"
                required
              />
            </Field>
            <Field label="Average weight (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.average_weight_kg}
                onChange={(event) =>
                  setFormData({ ...formData, average_weight_kg: event.target.value })
                }
                placeholder="180"
              />
            </Field>
            <Field label="Acquisition date">
              <Input
                type="date"
                value={formData.acquisition_date}
                onChange={(event) =>
                  setFormData({ ...formData, acquisition_date: event.target.value })
                }
              />
            </Field>
            <Field label="Health status">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.health_status}
                onChange={(event) => setFormData({ ...formData, health_status: event.target.value })}
              >
                {HEALTH_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Last vaccinated">
              <Input
                type="date"
                value={formData.last_vaccinated}
                onChange={(event) =>
                  setFormData({ ...formData, last_vaccinated: event.target.value })
                }
              />
            </Field>
            <Field label="Next vaccination due">
              <Input
                type="date"
                value={formData.next_vaccination_due}
                onChange={(event) =>
                  setFormData({ ...formData, next_vaccination_due: event.target.value })
                }
              />
            </Field>
            <Field label="Feed type">
              <Input
                value={formData.feed_type}
                onChange={(event) => setFormData({ ...formData, feed_type: event.target.value })}
                placeholder="Hay and concentrate"
              />
            </Field>
            <Field label="Daily feed (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.daily_feed_quantity_kg}
                onChange={(event) =>
                  setFormData({ ...formData, daily_feed_quantity_kg: event.target.value })
                }
                placeholder="4"
              />
            </Field>
            <Field label="Water (liters/day)">
              <Input
                type="number"
                step="0.1"
                value={formData.water_liters_per_day}
                onChange={(event) =>
                  setFormData({ ...formData, water_liters_per_day: event.target.value })
                }
                placeholder="25"
              />
            </Field>
            <Field label="Shelter type">
              <Input
                value={formData.shelter_type}
                onChange={(event) => setFormData({ ...formData, shelter_type: event.target.value })}
                placeholder="Covered pen"
              />
            </Field>
            <Field label="Space per animal (sqm)">
              <Input
                type="number"
                step="0.1"
                value={formData.space_per_animal_sqm}
                onChange={(event) =>
                  setFormData({ ...formData, space_per_animal_sqm: event.target.value })
                }
                placeholder="3.5"
              />
            </Field>
            <Field label="Production type">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.production_type}
                onChange={(event) =>
                  setFormData({ ...formData, production_type: event.target.value })
                }
              >
                <option value="">Select production type</option>
                {PRODUCTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Monthly production">
              <Input
                type="number"
                step="0.1"
                value={formData.monthly_production}
                onChange={(event) =>
                  setFormData({ ...formData, monthly_production: event.target.value })
                }
                placeholder="320"
              />
            </Field>
            <Field label="Production unit">
              <Input
                value={formData.production_unit}
                onChange={(event) =>
                  setFormData({ ...formData, production_unit: event.target.value })
                }
                placeholder="liters, eggs, kg"
              />
            </Field>
            <Field label="Estimated value (ZMW)">
              <Input
                type="number"
                step="0.1"
                value={formData.estimated_value}
                onChange={(event) =>
                  setFormData({ ...formData, estimated_value: event.target.value })
                }
                placeholder="25000"
              />
            </Field>
            <div className="md:col-span-4">
              <Field label="Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Add symptoms, feeding changes, mortality concerns, or production observations."
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} type="submit">
                {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : editingId ? 'Save livestock changes' : 'Add livestock'}
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
        <h2 className="mb-4 text-xl font-bold text-emerald-900">Livestock records</h2>
        {isLoading ? (
          <Card className="border-emerald-200 p-8 text-center text-slate-500">Loading livestock...</Card>
        ) : livestock.length === 0 ? (
          <Card className="border-emerald-200 py-12 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No livestock records yet. Add a herd or flock to start tracking health and vaccination patterns.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {livestock.map((record) => {
              const vaccinationDueSoon = (() => {
                if (!record.next_vaccination_due) {
                  return false
                }

                const days = Math.floor(
                  (new Date(record.next_vaccination_due).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                )

                return days >= 0 && days <= 10
              })()

              return (
                <Card key={record.id} className="border-emerald-200 shadow-sm shadow-emerald-100">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{record.animal_type}</h3>
                        <p className="text-sm text-slate-500">
                          {record.breed ?? 'Breed not recorded'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusPill label={record.health_status ?? 'unknown'} tone="default" />
                        {vaccinationDueSoon ? (
                          <StatusPill label="Vaccination due" tone="accent" />
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <InfoPill label="Quantity" value={`${record.quantity ?? 0}`} />
                      <InfoPill label="Weight" value={`${record.average_weight_kg ?? 0} kg`} />
                      <InfoPill
                        label="Production"
                        value={`${record.monthly_production ?? 0} ${record.production_unit ?? ''}`.trim()}
                      />
                      <InfoPill label="Value" value={`ZMW ${record.estimated_value ?? 0}`} />
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-slate-900">Feed:</span>{' '}
                        {record.feed_type ?? 'Not recorded'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Water:</span>{' '}
                        {record.water_liters_per_day ?? 0} L/day
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Last vaccinated:</span>{' '}
                        {record.last_vaccinated ?? 'Not recorded'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Next due:</span>{' '}
                        {record.next_vaccination_due ?? 'Not recorded'}
                      </p>
                    </div>

                    {record.notes ? (
                      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        {record.notes}
                      </p>
                    ) : null}

                    <div className="flex gap-2 border-t border-emerald-100 pt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(record)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
  tone?: 'default' | 'warning' | 'accent'
}) {
  const styles = {
    default: 'border-emerald-200 bg-white text-emerald-900',
    warning: 'border-rose-200 bg-rose-50 text-rose-900',
    accent: 'border-amber-200 bg-amber-50 text-amber-900',
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

function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: 'default' | 'accent'
}) {
  const styles =
    tone === 'accent'
      ? 'bg-amber-50 text-amber-700'
      : label === 'healthy' || label === 'vaccinated'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-rose-50 text-rose-700'

  const Icon = tone === 'accent' ? Syringe : ShieldCheck

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
