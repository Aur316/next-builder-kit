'use client'

import { InputHTMLAttributes, useCallback, useId, useState } from 'react'

import { File, FileImage, FileText, Music, Video, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

import { formatFileSize } from '../../../utils'
import { InfoBox } from '../info-box/info-box.component'

interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string
  onFilesChange?: (files: Array<File>) => void
  className?: string
  maxFileCount?: number
  maxTotalSize?: number // in Mb
}

export function FileUpload({
  id,
  onFilesChange,
  onChange,
  className,
  maxFileCount,
  maxTotalSize,
  ...props
}: FileUploadProps) {
  const { t } = useTranslation()
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([])
  const [error, setError] = useState<string | null>(null)
  const internalId = useId()
  const inputId = id ?? internalId

  const getFileIcon = useCallback((file: File) => {
    if (!file.type) {
      return <File className="size-4" />
    }
    const type = file.type.split('/')[0]
    switch (type) {
      case 'image':
        return <FileImage className="size-4" />
      case 'video':
        return <Video className="size-4" />
      case 'audio':
        return <Music className="size-4" />
      case 'text':
        return <FileText className="size-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }, [])

  const validateFiles = useCallback(
    (files: Array<File>): { isValid: boolean; error?: string } => {
      // Check file count limit
      if (maxFileCount && files.length > maxFileCount) {
        return {
          isValid: false,
          error: t('fileUpload.tooManyFiles', { maxCount: maxFileCount }),
        }
      }

      // Check total size limit
      if (maxTotalSize) {
        const totalSize = files.reduce((sum, file) => sum + file.size, 0)
        const maxSizeInBytes = maxTotalSize * 1024 * 1024
        if (totalSize > maxSizeInBytes) {
          return {
            isValid: false,
            error: t('fileUpload.totalSizeExceeded', {
              maxSize: formatFileSize(maxSizeInBytes),
            }),
          }
        }
      }

      return { isValid: true }
    },
    [maxFileCount, maxTotalSize, t],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || [])

      const uniqueFiles = newFiles.filter(
        (newFile) =>
          !selectedFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size &&
              existingFile.lastModified === newFile.lastModified,
          ),
      )

      const updatedFiles = [...selectedFiles, ...uniqueFiles]

      // Validate the updated files
      const validation = validateFiles(updatedFiles)

      if (!validation.isValid) {
        setError(validation.error || null)
        return
      }

      setError(null)
      setSelectedFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
      onChange?.(e)
    },
    [selectedFiles, onFilesChange, onChange, validateFiles],
  )

  const removeFile = useCallback(
    (fileToRemove: File) => {
      const updatedFiles = selectedFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      )
      setSelectedFiles(updatedFiles)
      onFilesChange?.(updatedFiles)

      // Clear error if files are now valid
      if (error) {
        const validation = validateFiles(updatedFiles)
        if (validation.isValid) {
          setError(null)
        }
      }
    },
    [selectedFiles, onFilesChange, error, validateFiles],
  )

  const currentTotalSize = selectedFiles.reduce(
    (sum, file) => sum + file.size,
    0,
  )
  const isAtFileLimit = maxFileCount
    ? selectedFiles.length >= maxFileCount
    : false
  const isAtSizeLimit = maxTotalSize
    ? currentTotalSize >= maxTotalSize * 1024 * 1024
    : false

  return (
    <div className={twMerge('w-full', className)}>
      <input
        id={inputId}
        type="file"
        className="file-input file-input-info w-full"
        onChange={handleFileChange}
        disabled={isAtFileLimit || isAtSizeLimit}
        {...props}
      />

      {(maxFileCount || maxTotalSize) && (
        <div className="mt-2 text-xs text-gray-500">
          {maxFileCount && (
            <div>
              {t('fileUpload.fileCountInfo', {
                current: selectedFiles.length,
                max: maxFileCount,
              })}
            </div>
          )}
          {maxTotalSize && (
            <div>
              {t('fileUpload.totalSizeInfo', {
                current: formatFileSize(currentTotalSize),
                max: formatFileSize(maxTotalSize * 1024 * 1024),
              })}
            </div>
          )}
        </div>
      )}

      {error && (
        <InfoBox
          type="error"
          title={t('fileUpload.errorTitle')}
          description={error}
        />
      )}

      {selectedFiles.length > 0 && (
        <>
          <h4 className="mt-4 mb-2 text-sm font-medium text-gray-400">
            {t('fileUpload.selectedFiles', { count: selectedFiles.length })}
          </h4>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                    {getFileIcon(file)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="p-1 text-gray-400 transition-colors hover:text-red-500"
                  type="button"
                  aria-label={t('fileUpload.removeFile', { name: file.name })}
                >
                  <X className="size-5 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
