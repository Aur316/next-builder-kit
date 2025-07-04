'use client'

import { useMemo } from 'react'

import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

interface InfoBoxProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
}

export function InfoBox({ type, title, description }: InfoBoxProps) {
  const { t } = useTranslation()

  const baseIconStyle =
    'bg-background my-auto flex size-6 items-center justify-center'

  const iconStyle = useMemo(() => {
    switch (type) {
      case 'info':
        return twMerge(baseIconStyle, 'text-info')
      case 'success':
        return twMerge(baseIconStyle, 'text-success')
      case 'warning':
        return twMerge(baseIconStyle, 'text-warning')
      case 'error':
        return twMerge(baseIconStyle, 'text-error')
    }
  }, [type, baseIconStyle])

  const icon = useMemo(() => {
    switch (type) {
      case 'info':
        return <Info aria-label={t('info')} className={iconStyle} />
      case 'success':
        return <CircleCheck aria-label={t('success')} className={iconStyle} />
      case 'warning':
        return <TriangleAlert aria-label={t('warning')} className={iconStyle} />
      case 'error':
        return <CircleX aria-label={t('error')} className={iconStyle} />
    }
  }, [t, type, iconStyle])

  const style = useMemo(() => {
    switch (type) {
      case 'info':
        return 'bg-info/40 border-l-4 border-l-info'
      case 'success':
        return 'bg-success/40 border-l-4 border-l-success'
      case 'warning':
        return 'bg-warning/40 border-l-4 border-l-warning'
      case 'error':
        return 'bg-error/40 border-l-4 border-l-error'
    }
  }, [type])

  return (
    <aside
      role="status"
      aria-label={`Infobox: ${type}`}
      className={twMerge(
        'my-2 flex w-full flex-col gap-2 rounded-sm border-l-4 p-2 text-white',
        style,
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <p className="pl-11 text-sm">{description}</p>
    </aside>
  )
}
