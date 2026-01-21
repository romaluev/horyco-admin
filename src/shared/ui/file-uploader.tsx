'use client'

import * as React from 'react'

import { IconUpload, IconX } from '@tabler/icons-react'
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone'
import { toast } from 'sonner'

import { useControllableState } from '@/shared/hooks/use-controllable-state'
import { BASE_API_URL } from '@/shared/lib/axios'
import { cn, formatBytes } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import { Progress } from '@/shared/ui/base/progress'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import type { IFile } from '@/shared/types'

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[]

  variant?: 'image' | 'file'

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept']

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize']

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles']

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean

  uploadedFiles?: IFile[]

  setDeletedFiles?: React.Dispatch<React.SetStateAction<number[]>>
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    variant = 'file',
    className,
    uploadedFiles = [],
    setDeletedFiles,
    ...dropzoneProps
  } = props

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Нельзя загрузить больше 1 файла за раз')
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Нельзя загрузить больше ${maxFiles} файлов`)
        return
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`Файл ${file.name} был отклонен`)
        })
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} файлов` : `файл`

        toast.promise(onUpload(updatedFiles), {
          loading: `Загрузка ${target}...`,
          success: () => {
            setFiles([])
            return `${target} загружен`
          },
          error: `Не удалось загрузить ${target}`,
        })
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles]
  )

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {files && files.length >= maxFiles ? null : (
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={maxFiles > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-32 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                isDragActive && 'border-muted-foreground/50',
                isDisabled && 'pointer-events-none opacity-60',
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <IconUpload
                      className="text-muted-foreground size-7"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Перетащите файлы сюда
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-2">
                  <div className="rounded-full border border-dashed p-2">
                    <IconUpload
                      className="text-muted-foreground size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-px">
                    <p className="text-muted-foreground text-sm font-medium">
                      Перетащите файлы сюда или нажмите для выбора
                    </p>
                    <p className="text-muted-foreground/70 text-sm">
                      Вы можете загрузить
                      {maxFiles > 1
                        ? ` ${maxFiles === Infinity ? 'несколько' : maxFiles}
                      файлов (до ${formatBytes(maxSize)} каждый)`
                        : ` файл размером до ${formatBytes(maxSize)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      )}
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-72 flex-wrap gap-2 space-y-4">
            {files?.map((file, index) =>
              variant === 'image' ? (
                <ImageCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ) : (
                <FileCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              )
            )}
          </div>
        </ScrollArea>
      ) : null}

      {uploadedFiles.length ? (
        <ScrollArea className="h-fit w-full px-3">
          {uploadedFiles.map((file) => (
            <UploadedFileCard
              file={file}
              onRemove={() =>
                setDeletedFiles &&
                setDeletedFiles((ids: number[]) => [...ids, file.id])
              }
              key={file.id}
            />
          ))}
        </ScrollArea>
      ) : null}
    </div>
  )
}

interface FileCardProps {
  file: File
  onRemove: () => void
  progress?: number
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <img
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
              {file.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className="size-8 rounded-full"
        >
          <IconX className="text-muted-foreground" />
          <span className="sr-only">Удалить файл</span>
        </Button>
      </div>
    </div>
  )
}

function ImageCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative w-max">
      {isFileWithPreview(file) ? (
        <img
          src={file.preview}
          alt={file.name}
          width={120}
          height={120}
          loading="lazy"
          className="aspect-square shrink-0 rounded-md object-cover"
        />
      ) : null}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onRemove}
        disabled={progress !== undefined && progress < 100}
        className="absolute top-1 right-0 size-5 rounded-full"
      >
        <IconX className="text-foreground size-3.5" />
        <span className="sr-only">Удалить файл</span>
      </Button>
    </div>
  )
}

const UploadedFileCard = ({
  file,
  onRemove,
}: {
  file: IFile
  onRemove: () => void
}) => {
  // Use thumb variant for thumbnails, fallback to other variants
  const imageUrl =
    file.variants?.thumb ||
    file.variants?.medium ||
    file.variants?.large ||
    file.variants?.original ||
    `${BASE_API_URL}/files/${file.originalName}`

  return (
    <div className="relative w-max">
      <img
        src={imageUrl}
        alt={file.metadata?.altText || file.originalName}
        width={120}
        height={120}
        className="rounded-md object-cover"
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onRemove}
        className="absolute top-1 right-0 size-5 rounded-full"
      >
        <IconX className="text-foreground size-3.5" />
        <span className="sr-only">Удалить файл</span>
      </Button>
    </div>
  )
}
function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string'
}
