import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Button } from './button'

export interface GalleryImageItem {
  src: string
  alt?: string
}

interface LightboxProps {
  images: GalleryImageItem[]
  index: number
  open: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

interface ImageCarouselGalleryProps {
  images: GalleryImageItem[]
  altFallback: string
  aspectClassName?: string
  imageClassName?: string
  className?: string
  panelClassName?: string
}

interface ZoomableImageGridProps {
  images: GalleryImageItem[]
  altFallback: string
  className?: string
  itemClassName?: string
  imageClassName?: string
  labelClassName?: string
}

function clampIndex(index: number, length: number) {
  if (length === 0) return 0
  return (index + length) % length
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getNextZoom(currentZoom: number, deltaY: number) {
  const zoomStep = deltaY < 0 ? 0.16 : -0.16
  return clampValue(Number((currentZoom + zoomStep).toFixed(2)), 1, 4)
}

function Lightbox({ images, index, open, onClose, onIndexChange }: LightboxProps) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!open) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (images.length > 1 && event.key === 'ArrowLeft') {
        onIndexChange(clampIndex(index - 1, images.length))
      }

      if (images.length > 1 && event.key === 'ArrowRight') {
        onIndexChange(clampIndex(index + 1, images.length))
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [images.length, index, onClose, onIndexChange, open])

  useEffect(() => {
    if (open) {
      setZoom(1)
    }
  }, [index, open])

  if (!open || images.length === 0) {
    return null
  }

  if (typeof document === 'undefined') {
    return null
  }

  const currentImage = images[index]

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-slate-950/92 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 z-0 h-full w-full cursor-zoom-out"
        aria-label="Close image preview"
        onClick={onClose}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-4 top-4 z-30 border-white/25 bg-slate-900/85 text-white shadow-xl hover:bg-slate-800 sm:right-6 sm:top-6"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close image preview</span>
      </Button>

      <div className="relative z-10 flex h-full flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/20 sm:left-4"
                onClick={() => onIndexChange(clampIndex(index - 1, images.length))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/20 sm:right-4"
                onClick={() => onIndexChange(clampIndex(index + 1, images.length))}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            </>
          )}

          <div
            className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden"
            onWheel={(event) => {
              event.preventDefault()
              setZoom((currentZoom) => getNextZoom(currentZoom, event.deltaY))
            }}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || 'Preview image'}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-150 will-change-transform"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            />
          </div>
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, imageIndex) => (
              <button
                key={`${image.src}-${imageIndex}`}
                type="button"
                className={cn(
                  'h-12 w-12 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-14 sm:w-14',
                  imageIndex === index ? 'border-white ring-2 ring-white/30' : 'border-white/15 opacity-70 hover:opacity-100'
                )}
                onClick={() => onIndexChange(imageIndex)}
              >
                <img src={image.src} alt={image.alt || 'Preview thumbnail'} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export function ImageCarouselGallery({
  images,
  altFallback,
  aspectClassName = 'aspect-[4/3]',
  imageClassName,
  className,
  panelClassName,
}: ImageCarouselGalleryProps) {
  const galleryImages = useMemo(
    () => images.filter((image) => Boolean(image?.src)).map((image) => ({ src: image.src, alt: image.alt || altFallback })),
    [altFallback, images]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setSelectedIndex((current) => clampIndex(current, galleryImages.length))
  }, [galleryImages.length])

  if (galleryImages.length === 0) {
    return null
  }

  const currentImage = galleryImages[selectedIndex]
  const hasMultiple = galleryImages.length > 1

  return (
    <>
      <div className={cn('space-y-4', className)}>
        <div className={cn('relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900', panelClassName)}>
          <button
            type="button"
            className={cn('group relative block w-full overflow-hidden', aspectClassName)}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || altFallback}
              className={cn('h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]', imageClassName)}
            />
            <div className="absolute right-4 top-4 rounded-full bg-slate-950/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" />
            </div>
          </button>

          {hasMultiple && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 border-white/70 bg-white/90 shadow-lg hover:bg-white"
                onClick={() => setSelectedIndex((current) => clampIndex(current - 1, galleryImages.length))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 border-white/70 bg-white/90 shadow-lg hover:bg-white"
                onClick={() => setSelectedIndex((current) => clampIndex(current + 1, galleryImages.length))}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {galleryImages.map((image, imageIndex) => (
              <button
                key={`${image.src}-${imageIndex}`}
                type="button"
                className={cn(
                  'group shrink-0 overflow-hidden rounded-2xl border bg-white transition-all dark:bg-zinc-900',
                  imageIndex === selectedIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                )}
                onClick={() => setSelectedIndex(imageIndex)}
              >
                <div className="h-14 w-16 overflow-hidden sm:h-16 sm:w-20">
                  <img src={image.src} alt={image.alt || altFallback} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={galleryImages}
        index={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}

export function ZoomableImageGrid({
  images,
  altFallback,
  className,
  itemClassName,
  imageClassName,
  labelClassName,
}: ZoomableImageGridProps) {
  const gridImages = useMemo(
    () => images.filter((image) => Boolean(image?.src)).map((image) => ({ src: image.src, alt: image.alt || altFallback })),
    [altFallback, images]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (gridImages.length === 0) {
    return null
  }

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-6 md:grid-cols-4', className)}>
        {gridImages.map((image, imageIndex) => (
          <button
            key={`${image.src}-${imageIndex}`}
            type="button"
            className={cn(
              'group relative rounded-2xl border border-transparent bg-slate-50 p-6 text-left transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-lg dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900',
              itemClassName
            )}
            onClick={() => {
              setSelectedIndex(imageIndex)
              setLightboxOpen(true)
            }}
          >
            <div className="absolute right-3 top-3 rounded-full bg-slate-900/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" />
            </div>
            <div className="mb-4 flex h-24 w-full items-center justify-center">
              <img src={image.src} alt={image.alt || altFallback} className={cn('max-h-full max-w-full object-contain', imageClassName)} />
            </div>
            <span className={cn('block text-sm font-bold text-slate-500 transition-colors group-hover:text-slate-800 dark:group-hover:text-slate-200', labelClassName)}>
              {image.alt || altFallback}
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={gridImages}
        index={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}