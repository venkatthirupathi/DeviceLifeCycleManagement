import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDevice, updateDevice, getFirmwareVersions,
  DeviceDto, CreateDeviceRequest, UpdateDeviceRequest,
} from '../api/api'
import { sortBySemVer } from '../utils/semver'
import { X, Loader2, AlertCircle } from 'lucide-react'

interface Props {
  device?: DeviceDto | null
  onClose: () => void
  onSuccess: () => void
}

type FormValues = {
  serialNumber: string
  model: string
  status: string
  firmwareVersion: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const STATUS_OPTIONS = ['active', 'inactive', 'retired', 'decommissioned']

// ── Floating-label input ──────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="form-label">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  )
}

export default function DeviceForm({ device, onClose, onSuccess }: Props) {
  const isEdit = !!device
  const qc     = useQueryClient()

  const [values, setValues] = useState<FormValues>({
    serialNumber:    device?.serialNumber    ?? '',
    model:           device?.model           ?? '',
    status:          device?.status          ?? 'active',
    firmwareVersion: device?.firmwareVersion ?? '',
  })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')

  // Fetch firmware versions for the select dropdown
  const { data: firmwareList = [] } = useQuery({
    queryKey: ['firmware'],
    queryFn:  getFirmwareVersions,
  })
  const sortedFirmware = sortBySemVer(firmwareList, f => f.version)

  useEffect(() => {
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function validate(): boolean {
    const e: FormErrors = {}
    if (!values.serialNumber.trim())
      e.serialNumber = 'Serial number is required'
    else if (values.serialNumber.length > 100)
      e.serialNumber = 'Max 100 characters'
    if (!values.status)
      e.status = 'Status is required'
    if (values.firmwareVersion && values.firmwareVersion.length > 50)
      e.firmwareVersion = 'Max 50 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: () => {
      if (isEdit) {
        const req: UpdateDeviceRequest = {
          serialNumber:    values.serialNumber    || undefined,
          model:           values.model           || undefined,
          status:          values.status          || undefined,
          firmwareVersion: values.firmwareVersion || undefined,
        }
        return updateDevice(device!.id, req)
      } else {
        const req: CreateDeviceRequest = {
          serialNumber:    values.serialNumber,
          model:           values.model           || undefined,
          status:          values.status,
          firmwareVersion: values.firmwareVersion || undefined,
        }
        return createDevice(req)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devices'] })
      onSuccess()
    },
    onError: (err: Error) => setApiError(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (validate()) mutation.mutate()
  }

  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues(v => ({ ...v, [k]: e.target.value }))
    setErrors(er => ({ ...er, [k]: undefined }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {isEdit ? 'Edit Device' : 'Add New Device'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {isEdit ? `Editing #${device!.id} — ${device!.serialNumber}` : 'Register a new device to the fleet'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Serial Number *" error={errors.serialNumber}>
            <input
              type="text"
              value={values.serialNumber}
              onChange={set('serialNumber')}
              placeholder="e.g. SN-001-XYZ"
              className={`input ${errors.serialNumber ? 'input-error' : ''}`}
              autoFocus
            />
          </Field>

          <Field label="Model" error={errors.model}>
            <input
              type="text"
              value={values.model}
              onChange={set('model')}
              placeholder="e.g. ThinkPad X1"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status *" error={errors.status}>
              <select
                value={values.status}
                onChange={set('status')}
                className={`input appearance-none cursor-pointer ${errors.status ? 'input-error' : ''}`}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>

            <Field label="Firmware Version" error={errors.firmwareVersion}>
              <select
                value={values.firmwareVersion}
                onChange={set('firmwareVersion')}
                className="input appearance-none cursor-pointer"
              >
                <option value="">None</option>
                {sortedFirmware.map(f => (
                  <option key={f.id} value={f.version}>{f.version}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
              <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="btn-primary flex-1 justify-center"
          >
            {mutation.isPending && <Loader2 size={13} className="animate-spin" />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Device'}
          </button>
        </div>
      </div>
    </div>
  )
}
