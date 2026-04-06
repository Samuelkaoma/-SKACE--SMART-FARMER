'use client'

import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import { BookOpen, Edit2, Plus, Save, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDashboardSession } from '@/components/dashboard/dashboard-session-provider'
import { createClient } from '@/lib/supabase/client'
import type { CropRecord, FarmLogRecord, LivestockRecord } from '@/lib/types/farm'

const LOG_TYPES = [
  'crop_activity',
  'livestock_activity',
  'weather',
  'observation',
  'expense',
  'harvest',
]

type LogFormState = {
  log_date: string
  log_type: string
  crop_id: string
  livestock_id: string
  activity_description: string
  weather_condition: string
  temperature_celsius: string
  rainfall_mm: string
  labor_hours: string
  expense_amount: string
  expense_category: string
  harvest_quantity_kg: string
  quality_grade: string
  notes: string
}

const emptyForm: LogFormState = {
  log_date: new Date().toISOString().slice(0, 10),
  log_type: 'observation',
  crop_id: '',
  livestock_id: '',
  activity_description: '',
  weather_condition: '',
  temperature_celsius: '',
  rainfall_mm: '',
  labor_hours: '',
  expense_amount: '',
  expense_category: '',
  harvest_quantity_kg: '',
  quality_grade: '',
  notes: '',
}

function numberOrNull(value: string) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

export default function LogbookPage() {
  const { userId } = useDashboardSession()
  const [logs, setLogs] = useState<FarmLogRecord[]>([])
  const [crops, setCrops] = useState<CropRecord[]>([])
  const [livestock, setLivestock] = useState<LivestockRecord[]>([])
  const [formData, setFormData] = useState<LogFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    void loadLogbook()
  }, [userId])

  async function loadLogbook() {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      const [logsResult, cropsResult, livestockResult] = await Promise.all([
        supabase
          .from('farm_logs')
          .select(
            'id, log_date, log_type, crop_id, livestock_id, activity_description, weather_condition, temperature_celsius, rainfall_mm, labor_hours, expense_amount, expense_category, harvest_quantity_kg, quality_grade, notes, created_at',
          )
          .eq('user_id', userId)
          .order('log_date', { ascending: false }),
        supabase
          .from('crops')
          .select('id, crop_name, crop_type, current_stage')
          .eq('user_id', userId)
          .order('crop_name', { ascending: true }),
        supabase
          .from('livestock')
          .select('id, animal_type, breed, quantity')
          .eq('user_id', userId)
          .order('animal_type', { ascending: true }),
      ])

      if (logsResult.error) {
        throw logsResult.error
      }
      if (cropsResult.error) {
        throw cropsResult.error
      }
      if (livestockResult.error) {
        throw livestockResult.error
      }

      setLogs((logsResult.data ?? []) as FarmLogRecord[])
      setCrops((cropsResult.data ?? []) as CropRecord[])
      setLivestock((livestockResult.data ?? []) as LivestockRecord[])
    } catch (error) {
      console.error('Error loading logbook:', error)
      toast.error('Failed to load logbook')
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
        log_date: formData.log_date,
        log_type: formData.log_type,
        crop_id: formData.crop_id || null,
        livestock_id: formData.livestock_id || null,
        activity_description: formData.activity_description,
        weather_condition: formData.weather_condition || null,
        temperature_celsius: numberOrNull(formData.temperature_celsius),
        rainfall_mm: numberOrNull(formData.rainfall_mm),
        labor_hours: numberOrNull(formData.labor_hours),
        expense_amount: numberOrNull(formData.expense_amount),
        expense_category: formData.expense_category || null,
        harvest_quantity_kg: numberOrNull(formData.harvest_quantity_kg),
        quality_grade: formData.quality_grade || null,
        notes: formData.notes || null,
      }

      const result = editingId
        ? await supabase.from('farm_logs').update(payload).eq('id', editingId).eq('user_id', userId)
        : await supabase.from('farm_logs').insert(payload)

      if (result.error) {
        throw result.error
      }

      toast.success(editingId ? 'Log entry updated' : 'Log entry added')
      resetForm()
      await loadLogbook()
    } catch (error) {
      console.error('Error saving log entry:', error)
      toast.error('Failed to save log entry')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(log: FarmLogRecord) {
    setEditingId(log.id)
    setFormData({
      log_date: log.log_date,
      log_type: log.log_type,
      crop_id: log.crop_id ?? '',
      livestock_id: log.livestock_id ?? '',
      activity_description: log.activity_description,
      weather_condition: log.weather_condition ?? '',
      temperature_celsius: log.temperature_celsius?.toString() ?? '',
      rainfall_mm: log.rainfall_mm?.toString() ?? '',
      labor_hours: log.labor_hours?.toString() ?? '',
      expense_amount: log.expense_amount?.toString() ?? '',
      expense_category: log.expense_category ?? '',
      harvest_quantity_kg: log.harvest_quantity_kg?.toString() ?? '',
      quality_grade: log.quality_grade ?? '',
      notes: log.notes ?? '',
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this log entry?')) {
      return
    }

    if (!userId) {
      return
    }

    try {
      const { error } = await supabase.from('farm_logs').delete().eq('id', id).eq('user_id', userId)

      if (error) {
        throw error
      }

      toast.success('Log entry deleted')
      await loadLogbook()
    } catch (error) {
      console.error('Error deleting log entry:', error)
      toast.error('Failed to delete log entry')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Farm logbook
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Build the pattern history the farm needs
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Capture activities, weather notes, expenses, harvests, and observations. This is the data that makes disease tracking and farming pattern analysis believable.
        </p>
      </section>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Update log entry' : 'Add log entry'}
          </CardTitle>
          <CardDescription>
            Write what happened, where it happened, and what changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
            <Field label="Log date" required>
              <Input
                type="date"
                value={formData.log_date}
                onChange={(event) => setFormData({ ...formData, log_date: event.target.value })}
                required
              />
            </Field>
            <Field label="Log type" required>
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.log_type}
                onChange={(event) => setFormData({ ...formData, log_type: event.target.value })}
                required
              >
                {LOG_TYPES.map((logType) => (
                  <option key={logType} value={logType}>
                    {titleCase(logType)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Crop link">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.crop_id}
                onChange={(event) => setFormData({ ...formData, crop_id: event.target.value })}
              >
                <option value="">No crop selected</option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.crop_name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Livestock link">
              <select
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
                value={formData.livestock_id}
                onChange={(event) => setFormData({ ...formData, livestock_id: event.target.value })}
              >
                <option value="">No livestock selected</option>
                {livestock.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.animal_type}
                    {record.breed ? ` | ${record.breed}` : ''}
                  </option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-4">
              <Field label="Activity description" required>
                <Textarea
                  value={formData.activity_description}
                  onChange={(event) =>
                    setFormData({ ...formData, activity_description: event.target.value })
                  }
                  placeholder="Observed leaf spot on the east maize block and applied fungicide."
                  required
                />
              </Field>
            </div>
            <Field label="Weather condition">
              <Input
                value={formData.weather_condition}
                onChange={(event) =>
                  setFormData({ ...formData, weather_condition: event.target.value })
                }
                placeholder="Partly cloudy"
              />
            </Field>
            <Field label="Temperature (C)">
              <Input
                type="number"
                step="0.1"
                value={formData.temperature_celsius}
                onChange={(event) =>
                  setFormData({ ...formData, temperature_celsius: event.target.value })
                }
                placeholder="29"
              />
            </Field>
            <Field label="Rainfall (mm)">
              <Input
                type="number"
                step="0.1"
                value={formData.rainfall_mm}
                onChange={(event) => setFormData({ ...formData, rainfall_mm: event.target.value })}
                placeholder="12"
              />
            </Field>
            <Field label="Labor hours">
              <Input
                type="number"
                step="0.1"
                value={formData.labor_hours}
                onChange={(event) => setFormData({ ...formData, labor_hours: event.target.value })}
                placeholder="4"
              />
            </Field>
            <Field label="Expense amount (ZMW)">
              <Input
                type="number"
                step="0.1"
                value={formData.expense_amount}
                onChange={(event) =>
                  setFormData({ ...formData, expense_amount: event.target.value })
                }
                placeholder="450"
              />
            </Field>
            <Field label="Expense category">
              <Input
                value={formData.expense_category}
                onChange={(event) =>
                  setFormData({ ...formData, expense_category: event.target.value })
                }
                placeholder="Pesticide"
              />
            </Field>
            <Field label="Harvest quantity (kg)">
              <Input
                type="number"
                step="0.1"
                value={formData.harvest_quantity_kg}
                onChange={(event) =>
                  setFormData({ ...formData, harvest_quantity_kg: event.target.value })
                }
                placeholder="1200"
              />
            </Field>
            <Field label="Quality grade">
              <Input
                value={formData.quality_grade}
                onChange={(event) => setFormData({ ...formData, quality_grade: event.target.value })}
                placeholder="A"
              />
            </Field>
            <div className="md:col-span-4">
              <Field label="Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Add details worth remembering next season."
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} type="submit">
                {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : editingId ? 'Save log changes' : 'Add log entry'}
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
        <h2 className="mb-4 text-xl font-bold text-emerald-900">Recent log entries</h2>
        {isLoading ? (
          <Card className="border-emerald-200 p-8 text-center text-slate-500">Loading logbook...</Card>
        ) : logs.length === 0 ? (
          <Card className="border-emerald-200 py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No farm logs yet. Add your first entry to begin building pattern history.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="border-emerald-200 shadow-sm shadow-emerald-100">
                <CardContent className="pt-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                          {titleCase(log.log_type)}
                        </p>
                        <h3 className="text-base font-semibold text-slate-900">{log.log_date}</h3>
                      </div>
                      <p className="max-w-3xl text-sm leading-6 text-slate-600">
                        {log.activity_description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {log.weather_condition ? <LogBadge>{log.weather_condition}</LogBadge> : null}
                        {log.rainfall_mm ? <LogBadge>{log.rainfall_mm} mm rain</LogBadge> : null}
                        {log.harvest_quantity_kg ? <LogBadge>{log.harvest_quantity_kg} kg harvested</LogBadge> : null}
                        {log.expense_amount ? <LogBadge>ZMW {log.expense_amount}</LogBadge> : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(log)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(log.id)}
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

function LogBadge({
  children,
}: {
  children: ReactNode
}) {
  return <span className="rounded-full bg-slate-100 px-2 py-1">{children}</span>
}
