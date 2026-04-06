'use client'

import { type FormEvent, useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Plus,
  Save,
  Sprout,
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
import type { CropRecord } from '@/lib/types/farm'

const CROP_TYPES = [
  'Maize',
  'Sorghum',
  'Millet',
  'Wheat',
  'Groundnuts',
  'Soybean',
  'Cotton',
  'Sunflower',
  'Rice',
  'Cassava',
]

const GROWTH_STAGES = ['seedling', 'vegetative', 'flowering', 'fruiting', 'mature', 'harvested']
const HEALTH_STATUSES = ['healthy', 'stressed', 'diseased', 'recovering']
const SOIL_TYPES = ['Loam', 'Clay', 'Sandy', 'Silt', 'Mixed']

type CropFormState = {
  crop_name: string
  crop_type: string
  variety: string
  planting_date: string
  expected_harvest_date: string
  area_planted_hectares: string
  seed_quantity_kg: string
  fertilizer_type: string
  fertilizer_quantity_kg: string
  current_stage: string
  soil_type: string
  soil_ph: string
  moisture_level: string
  health_status: string
  disease_detected: string
  pest_detected: string
  yield_estimate_kg: string
  estimated_revenue: string
  notes: string
}

const emptyForm: CropFormState = {
  crop_name: '',
  crop_type: '',
  variety: '',
  planting_date: '',
  expected_harvest_date: '',
  area_planted_hectares: '',
  seed_quantity_kg: '',
  fertilizer_type: '',
  fertilizer_quantity_kg: '',
  current_stage: 'seedling',
  soil_type: '',
  soil_ph: '',
  moisture_level: '',
  health_status: 'healthy',
  disease_detected: '',
  pest_detected: '',
  yield_estimate_kg: '',
  estimated_revenue: '',
  notes: '',
}

function numberOrNull(value: string) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function CropsPage() {
  const [crops, setCrops] = useState<CropRecord[]>([])
  const [formData, setFormData] = useState<CropFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    void loadCrops()
  }, [])

  async function loadCrops() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const { data, error } = await supabase
        .from('crops')
        .select(
          'id, crop_name, crop_type, variety, planting_date, expected_harvest_date, area_planted_hectares, seed_quantity_kg, fertilizer_type, fertilizer_quantity_kg, current_stage, soil_type, soil_ph, moisture_level, health_status, disease_detected, pest_detected, yield_estimate_kg, actual_yield_kg, estimated_revenue, notes, created_at',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setCrops((data ?? []) as CropRecord[])
    } catch (error) {
      console.error('Error loading crops:', error)
      toast.error('Failed to load crops')
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
        crop_name: formData.crop_name,
        crop_type: formData.crop_type,
        variety: formData.variety || null,
        planting_date: formData.planting_date,
        expected_harvest_date: formData.expected_harvest_date,
        area_planted_hectares: numberOrNull(formData.area_planted_hectares),
        seed_quantity_kg: numberOrNull(formData.seed_quantity_kg),
        fertilizer_type: formData.fertilizer_type || null,
        fertilizer_quantity_kg: numberOrNull(formData.fertilizer_quantity_kg),
        current_stage: formData.current_stage,
        soil_type: formData.soil_type || null,
        soil_ph: numberOrNull(formData.soil_ph),
        moisture_level: numberOrNull(formData.moisture_level),
        health_status: formData.health_status,
        disease_detected: formData.disease_detected || null,
        pest_detected: formData.pest_detected || null,
        yield_estimate_kg: numberOrNull(formData.yield_estimate_kg),
        estimated_revenue: numberOrNull(formData.estimated_revenue),
        notes: formData.notes || null,
      }

      const result = editingId
        ? await supabase.from('crops').update(payload).eq('id', editingId).eq('user_id', user.id)
        : await supabase.from('crops').insert(payload)

      if (result.error) {
        throw result.error
      }

      toast.success(editingId ? 'Crop updated successfully' : 'Crop added successfully')
      resetForm()
      await loadCrops()
    } catch (error) {
      console.error('Error saving crop:', error)
      toast.error('Failed to save crop')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(crop: CropRecord) {
    setEditingId(crop.id)
    setFormData({
      crop_name: crop.crop_name,
      crop_type: crop.crop_type,
      variety: crop.variety ?? '',
      planting_date: crop.planting_date ?? '',
      expected_harvest_date: crop.expected_harvest_date ?? '',
      area_planted_hectares: crop.area_planted_hectares?.toString() ?? '',
      seed_quantity_kg: crop.seed_quantity_kg?.toString() ?? '',
      fertilizer_type: crop.fertilizer_type ?? '',
      fertilizer_quantity_kg: crop.fertilizer_quantity_kg?.toString() ?? '',
      current_stage: crop.current_stage ?? 'seedling',
      soil_type: crop.soil_type ?? '',
      soil_ph: crop.soil_ph?.toString() ?? '',
      moisture_level: crop.moisture_level?.toString() ?? '',
      health_status: crop.health_status ?? 'healthy',
      disease_detected: crop.disease_detected ?? '',
      pest_detected: crop.pest_detected ?? '',
      yield_estimate_kg: crop.yield_estimate_kg?.toString() ?? '',
      estimated_revenue: crop.estimated_revenue?.toString() ?? '',
      notes: crop.notes ?? '',
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this crop record?')) {
      return
    }

    try {
      const { error } = await supabase.from('crops').delete().eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Crop deleted')
      await loadCrops()
    } catch (error) {
      console.error('Error deleting crop:', error)
      toast.error('Failed to delete crop')
    }
  }

  const totalArea = crops.reduce((sum, crop) => sum + (crop.area_planted_hectares ?? 0), 0)
  const atRiskCrops = crops.filter(
    (crop) =>
      (crop.health_status ?? '').toLowerCase() !== 'healthy' ||
      crop.disease_detected ||
      crop.pest_detected,
  ).length
  const harvestSoon = crops.filter((crop) => {
    if (!crop.expected_harvest_date) {
      return false
    }

    const days = Math.floor(
      (new Date(crop.expected_harvest_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )

    return days >= 0 && days <= 14
  }).length

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Crop operations
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Track crops with enough detail to generate useful advice
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Capture field size, growth stage, soil indicators, disease signals, and estimated yield so the platform can produce stronger recommendations.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Crop records" value={`${crops.length}`} />
        <MetricCard label="Tracked area" value={`${totalArea.toFixed(1)} ha`} />
        <MetricCard label="At risk" value={`${atRiskCrops}`} tone="warning" />
        <MetricCard label="Harvest soon" value={`${harvestSoon}`} tone="accent" />
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Update crop record' : 'Add crop record'}
          </CardTitle>
          <CardDescription>
            Better input quality leads to better disease, harvest, and profitability guidance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
            <Field label="Crop name" required>
              <Input
                value={formData.crop_name}
                onChange={(event) => setFormData({ ...formData, crop_name: event.target.value })}
                placeholder="Block A maize"
                required
              />
            </Field>
            <Field label="Crop type" required>
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.crop_type}
                onChange={(event) => setFormData({ ...formData, crop_type: event.target.value })}
                required
              >
                <option value="">Select crop type</option>
                {CROP_TYPES.map((cropType) => (
                  <option key={cropType} value={cropType}>
                    {cropType}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Variety">
              <Input
                value={formData.variety}
                onChange={(event) => setFormData({ ...formData, variety: event.target.value })}
                placeholder="SC 403"
              />
            </Field>
            <Field label="Area planted (ha)" required>
              <Input
                type="number"
                step="0.1"
                value={formData.area_planted_hectares}
                onChange={(event) =>
                  setFormData({ ...formData, area_planted_hectares: event.target.value })
                }
                placeholder="2.5"
                required
              />
            </Field>
            <Field label="Planting date" required>
              <Input
                type="date"
                value={formData.planting_date}
                onChange={(event) => setFormData({ ...formData, planting_date: event.target.value })}
                required
              />
            </Field>
            <Field label="Expected harvest" required>
              <Input
                type="date"
                value={formData.expected_harvest_date}
                onChange={(event) =>
                  setFormData({ ...formData, expected_harvest_date: event.target.value })
                }
                required
              />
            </Field>
            <Field label="Current stage">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.current_stage}
                onChange={(event) => setFormData({ ...formData, current_stage: event.target.value })}
              >
                {GROWTH_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
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
            <Field label="Soil type">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.soil_type}
                onChange={(event) => setFormData({ ...formData, soil_type: event.target.value })}
              >
                <option value="">Select soil type</option>
                {SOIL_TYPES.map((soilType) => (
                  <option key={soilType} value={soilType}>
                    {soilType}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Soil pH">
              <Input
                type="number"
                step="0.1"
                value={formData.soil_ph}
                onChange={(event) => setFormData({ ...formData, soil_ph: event.target.value })}
                placeholder="6.5"
              />
            </Field>
            <Field label="Moisture level (%)">
              <Input
                type="number"
                step="0.1"
                value={formData.moisture_level}
                onChange={(event) => setFormData({ ...formData, moisture_level: event.target.value })}
                placeholder="48"
              />
            </Field>
            <Field label="Seed quantity (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.seed_quantity_kg}
                onChange={(event) => setFormData({ ...formData, seed_quantity_kg: event.target.value })}
                placeholder="25"
              />
            </Field>
            <Field label="Fertilizer type">
              <Input
                value={formData.fertilizer_type}
                onChange={(event) =>
                  setFormData({ ...formData, fertilizer_type: event.target.value })
                }
                placeholder="Compound D"
              />
            </Field>
            <Field label="Fertilizer quantity (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.fertilizer_quantity_kg}
                onChange={(event) =>
                  setFormData({ ...formData, fertilizer_quantity_kg: event.target.value })
                }
                placeholder="50"
              />
            </Field>
            <Field label="Disease detected">
              <Input
                value={formData.disease_detected}
                onChange={(event) =>
                  setFormData({ ...formData, disease_detected: event.target.value })
                }
                placeholder="Leaf spot"
              />
            </Field>
            <Field label="Pest detected">
              <Input
                value={formData.pest_detected}
                onChange={(event) => setFormData({ ...formData, pest_detected: event.target.value })}
                placeholder="Fall armyworm"
              />
            </Field>
            <Field label="Yield estimate (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.yield_estimate_kg}
                onChange={(event) =>
                  setFormData({ ...formData, yield_estimate_kg: event.target.value })
                }
                placeholder="2800"
              />
            </Field>
            <Field label="Estimated revenue (ZMW)">
              <Input
                type="number"
                step="0.1"
                value={formData.estimated_revenue}
                onChange={(event) =>
                  setFormData({ ...formData, estimated_revenue: event.target.value })
                }
                placeholder="15000"
              />
            </Field>
            <div className="md:col-span-4">
              <Field label="Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Record symptoms, treatment, planting observations, or labor notes."
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} type="submit">
                {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : editingId ? 'Save crop changes' : 'Add crop'}
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
        <h2 className="mb-4 text-xl font-bold text-emerald-900">Crop records</h2>
        {isLoading ? (
          <Card className="border-emerald-200 p-8 text-center text-slate-500">Loading crops...</Card>
        ) : crops.length === 0 ? (
          <Card className="border-emerald-200 py-12 text-center">
            <Sprout className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No crop records yet. Add your first field to begin generating guidance.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {crops.map((crop) => {
              const risk = crop.disease_detected || crop.pest_detected || crop.health_status !== 'healthy'

              return (
                <Card key={crop.id} className="border-emerald-200 shadow-sm shadow-emerald-100">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{crop.crop_name}</h3>
                        <p className="text-sm text-slate-500">
                          {crop.crop_type}
                          {crop.variety ? ` | ${crop.variety}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {risk ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                            <AlertCircle className="h-3.5 w-3.5" />
                            At risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Stable
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <InfoPill label="Stage" value={crop.current_stage ?? 'Unknown'} />
                      <InfoPill label="Health" value={crop.health_status ?? 'Unknown'} />
                      <InfoPill
                        label="Area"
                        value={`${crop.area_planted_hectares ?? 0} ha`}
                      />
                      <InfoPill
                        label="Yield"
                        value={`${crop.yield_estimate_kg ?? 0} kg`}
                      />
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-slate-900">Planting:</span>{' '}
                        {crop.planting_date ?? 'Not recorded'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Harvest:</span>{' '}
                        {crop.expected_harvest_date ?? 'Not recorded'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Disease:</span>{' '}
                        {crop.disease_detected ?? 'None'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Pest:</span>{' '}
                        {crop.pest_detected ?? 'None'}
                      </p>
                    </div>

                    {crop.notes ? (
                      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        {crop.notes}
                      </p>
                    ) : null}

                    <div className="flex gap-2 border-t border-emerald-100 pt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(crop)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(crop.id)}
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
  children: React.ReactNode
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
