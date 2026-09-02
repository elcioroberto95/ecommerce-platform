import { InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  hint?: string
}

export function FormInput({ label, error, hint, className = '', ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
          transition disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}
          ${className}
        `}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
