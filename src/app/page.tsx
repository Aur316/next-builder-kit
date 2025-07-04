'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SendHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  Checkbox,
  Dropdown,
  FileUpload,
  Input,
  RadioButtonGroup,
  Toggle,
  showToast,
} from '../components'
import { DROPDOWN_OPTIONS, RADIO_OPTIONS, initialFormData } from '../constants'
import { FormData } from '../types'

export default function Home() {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<FormData>(initialFormData)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      showToast({
        type: 'success',
        description: t('homePage.formSubmitted'),
      })
      setFormData(initialFormData)
      inputRef.current?.focus()
    },
    [t],
  )

  const nameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }))
  }, [])

  const emailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }))
  }, [])

  const messageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, message: e.target.value }))
    },
    [],
  )

  const frameworkChange = useCallback((framework: string) => {
    setFormData((prev) => ({ ...prev, framework }))
  }, [])

  const notificationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, notification: e.target.checked }))
    },
    [],
  )

  const agreementChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, isAgreed: e.target.checked }))
    },
    [],
  )

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-10 px-4 py-2">
      <section id="mainHeader">
        <h1 className="text-center text-3xl font-bold text-white">
          {t('homePage.title')}
        </h1>
        <p className="mt-2 max-w-md text-center text-sm text-white">
          {t('homePage.description')}
        </p>
      </section>

      <section id="mainContent">
        <form className="flex flex-col items-center gap-4" onSubmit={submit}>
          <Input
            label={t('homePage.nameLabel')}
            // legend={t('homePage.nameLabel')}
            placeholder={t('homePage.namePlaceholder')}
            ref={inputRef}
            value={formData.name}
            onChange={nameChange}
            required
            type="text"
          />
          <Input
            // label={t('homePage.emailLabel')}
            legend={t('homePage.emailLabel')}
            placeholder={t('homePage.emailPlaceholder')}
            ref={inputRef}
            value={formData.email}
            onChange={emailChange}
            required
            type="email"
            autoComplete="email"
          />
          <Input
            // label={t('homePage.messageLabel')}
            legend={t('homePage.messageLabel')}
            isTextArea
            placeholder={t('homePage.messagePlaceholder')}
            value={formData.message}
            onChange={messageChange}
          />
          <Dropdown
            label={t('homePage.frameworkLabel')}
            // legend={t('homePage.frameworkLabel')}
            name="Frameworks"
            onChange={(e) => frameworkChange(e.target.value)}
            value={formData.framework}
            options={DROPDOWN_OPTIONS}
            nestedOption="Frameworks"
            required
          />
          <RadioButtonGroup
            options={RADIO_OPTIONS}
            label="homePage.radioChoiceLabel"
            name="radio-choice"
            value={formData.radioChoice}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, radioChoice: e.target.value }))
            }
            required
          />
          <Toggle
            text={t('homePage.notificationsLabel')}
            className="toggle-info"
            checked={formData.notification}
            onChange={notificationChange}
          />
          <Checkbox
            label={t('homePage.agreeToTerms')}
            required
            checked={formData.isAgreed}
            onChange={agreementChange}
          />
          <FileUpload
            multiple
            accept="file/*"
            maxFileCount={3}
            maxTotalSize={5}
            required
          />
          <Button
            variant="secondary"
            icon={<SendHorizontal strokeWidth={1.5} />}
            iconPosition="right"
            type="submit"
          >
            {t('homePage.submitButton')}
          </Button>
        </form>
      </section>
    </div>
  )
}
