import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '../../utils/cn'
import { Button } from './button'

export interface GalleryImageItem {
  src: string
  alt?: string
  type?: 'image' | 'video'
}

interface LightboxProps {
  images: GalleryImageItem[]
  index: number
  open: boolean
  cornerClassName?: string
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
  cornerClassName?: string
}

interface ZoomableImageGridProps {
  images: GalleryImageItem[]
  altFallback: string
  className?: string
  itemClassName?: string
  imageClassName?: string
  labelClassName?: string
  cornerClassName?: string
  showExpandIcon?: boolean
  showLabel?: boolean
}

interface ZoomableImageStripProps {
  images: GalleryImageItem[]
  altFallback: string
  className?: string
  scrollerClassName?: string
  itemClassName?: string
  imageClassName?: string
  cornerClassName?: string
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

function Lightbox({ images, index, open, cornerClassName, onClose, onIndexChange }: LightboxProps) {
  const { t } = useTranslation("translation")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })

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
      setPan({ x: 0, y: 0 })
    }
  }, [index, open])

  if (!open || images.length === 0) {
    return null
  }

  if (typeof document === 'undefined') {
    return null
  }

  const currentImage = images[index]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { x: pan.x, y: pan.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({ x: panStartRef.current.x + dx, y: panStartRef.current.y + dy })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-slate-950/92 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 z-0 h-full w-full cursor-zoom-out"
        aria-label={t("ui.accessibility.close_image_preview")}
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
        <span className="sr-only">{t("ui.accessibility.close_image_preview")}</span>
      </Button>

      <div className="relative z-10 flex h-full flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border-0 bg-white/20 text-black shadow-lg hover:bg-white hover:text-primary sm:left-4", cornerClassName)}
                onClick={() => onIndexChange(clampIndex(index - 1, images.length))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{t("ui.accessibility.previous_image")}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border-0 bg-white/20 text-black shadow-lg hover:bg-white hover:text-primary sm:right-4", cornerClassName)}
                onClick={() => onIndexChange(clampIndex(index + 1, images.length))}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">{t("ui.accessibility.next_image")}</span>
              </Button>
            </>
          )}

          <div
            className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden"
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-out' }}
            onWheel={(event) => {
              event.preventDefault()
              const newZoom = getNextZoom(zoom, event.deltaY)
              setZoom(newZoom)
              if (newZoom <= 1) setPan({ x: 0, y: 0 })
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || t("ui.image.preview_image")}
              draggable={false}
              className={cn("max-h-full max-w-full rounded-2xl object-contain shadow-2xl will-change-transform select-none", cornerClassName)}
              style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: isDragging ? 'none' : 'transform 150ms' }}
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
                  cornerClassName,
                  imageIndex === index ? 'border-white ring-2 ring-white/30' : 'border-white/15 opacity-70 hover:opacity-100'
                )}
                onClick={() => onIndexChange(imageIndex)}
              >
                <img src={image.src} alt={image.alt || t("ui.image.preview_thumbnail")} className="h-full w-full object-cover" />
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
  cornerClassName,
}: ImageCarouselGalleryProps) {
  const galleryImages = useMemo(
    () => images.filter((image) => Boolean(image?.src)).map((image) => ({ src: image.src, alt: image.alt || altFallback, type: image.type || 'image' })),
    [altFallback, images]
  )
  const { t } = useTranslation("translation")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setSelectedIndex((current) => clampIndex(current, galleryImages.length))
  }, [galleryImages.length])

  if (galleryImages.length === 0) {
    return null
  }

  const currentImage = galleryImages[selectedIndex]
  const isVideo = currentImage.type === 'video'
  const hasMultiple = galleryImages.length > 1

  // For lightbox, only use image items
  const imageOnlyItems = galleryImages.filter(item => item.type !== 'video')
  const lightboxIndex = imageOnlyItems.findIndex(item => item.src === currentImage.src)

  return (
    <>
      <div className={cn('space-y-4', className)}>
        <div className={cn('relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm', panelClassName, cornerClassName)}>
          {isVideo ? (
            <div className={cn('relative block w-full overflow-hidden', aspectClassName)}>
              <iframe
                src={currentImage.src}
                title={currentImage.alt || altFallback}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
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
              <div className={cn("absolute right-4 top-4 rounded-full bg-slate-950/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100", cornerClassName)}>
                <Expand className="h-3.5 w-3.5" />
              </div>
            </button>
          )}

          {hasMultiple && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-0 bg-white/20 text-black shadow-lg hover:bg-white hover:text-primary", cornerClassName)}
                onClick={() => setSelectedIndex((current) => clampIndex(current - 1, galleryImages.length))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{t("ui.accessibility.previous_image")}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-0 bg-white/20 text-black shadow-lg hover:bg-white hover:text-primary", cornerClassName)}
                onClick={() => setSelectedIndex((current) => clampIndex(current + 1, galleryImages.length))}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">{t("ui.accessibility.next_image")}</span>
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
                  'group shrink-0 overflow-hidden rounded-2xl border bg-white transition-all',
                  cornerClassName,
                  imageIndex === selectedIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-slate-200 hover:border-slate-300'
                )}
                onClick={() => setSelectedIndex(imageIndex)}
              >
                <div className="h-14 w-16 overflow-hidden sm:h-16 sm:w-20 relative">
                  {image.type === 'video' ? (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <img src={image.src} alt={image.alt || altFallback} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={imageOnlyItems}
        index={Math.max(0, lightboxIndex)}
        open={lightboxOpen}
        cornerClassName={cornerClassName}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(newIndex) => {
          // Map lightbox index back to gallery index
          const targetSrc = imageOnlyItems[newIndex]?.src
          const galleryIdx = galleryImages.findIndex(item => item.src === targetSrc)
          if (galleryIdx >= 0) setSelectedIndex(galleryIdx)
        }}
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
  cornerClassName,
  showExpandIcon = true,
  showLabel = true,
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
              'group relative rounded-2xl border border-transparent bg-slate-50 p-6 text-left transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-lg',
              cornerClassName,
              itemClassName
            )}
            onClick={() => {
              setSelectedIndex(imageIndex)
              setLightboxOpen(true)
            }}
          >
            {showExpandIcon && (
              <div className={cn("absolute right-3 top-3 rounded-full bg-slate-900/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100", cornerClassName)}>
                <Expand className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={cn("flex h-24 w-full items-center justify-center", showLabel && "mb-4")}>
              <img src={image.src} alt={image.alt || altFallback} className={cn('max-h-full max-w-full object-contain', imageClassName)} />
            </div>
            {showLabel && (
              <span className={cn('block text-sm font-bold text-slate-500 transition-colors group-hover:text-slate-800', labelClassName)}>
                {image.alt || altFallback}
              </span>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        images={gridImages}
        index={selectedIndex}
        open={lightboxOpen}
        cornerClassName={cornerClassName}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}

export function ZoomableImageStrip({
  images,
  altFallback,
  className,
  scrollerClassName,
  itemClassName,
  imageClassName,
  cornerClassName,
}: ZoomableImageStripProps) {
  const { t } = useTranslation("translation")
  const stripImages = useMemo(
    () => images.filter((image) => Boolean(image?.src)).map((image) => ({ src: image.src, alt: image.alt || altFallback })),
    [altFallback, images]
  )
  const scrollerRef = useRef<HTMLDivElement>(null)
  const imageButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setSelectedIndex((current) => clampIndex(current, stripImages.length))
    imageButtonRefs.current = imageButtonRefs.current.slice(0, stripImages.length)
  }, [stripImages.length])

  if (stripImages.length === 0) {
    return null
  }

  const hasMultiple = stripImages.length > 1

  const scrollToImageIndex = (index: number) => {
    const nextIndex = clampIndex(index, stripImages.length)
    setSelectedIndex(nextIndex)
    imageButtonRefs.current[nextIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  return (
    <>
      <div className={cn('relative min-w-0', className)}>
        {hasMultiple && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white", cornerClassName)}
            onClick={() => scrollToImageIndex(selectedIndex - 1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("ui.accessibility.previous_image")}</span>
          </Button>
        )}

        <div
          ref={scrollerRef}
          className={cn(
            'flex min-w-0 gap-3 overflow-x-auto scroll-smooth pb-1',
            hasMultiple && 'px-10',
            scrollerClassName
          )}
        >
          {stripImages.map((image, imageIndex) => (
            <button
              key={`${image.src}-${imageIndex}`}
              ref={(node) => {
                imageButtonRefs.current[imageIndex] = node
              }}
              type="button"
              className={cn('group flex h-24 shrink-0 items-center justify-center bg-transparent p-0 transition-opacity hover:opacity-85 sm:h-28', itemClassName)}
              onClick={() => {
                setSelectedIndex(imageIndex)
                setLightboxOpen(true)
              }}
            >
              <img
                src={image.src}
                alt={image.alt || altFallback}
                className={cn('h-full w-auto max-w-none object-contain', imageClassName)}
              />
            </button>
          ))}
        </div>

        {hasMultiple && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white", cornerClassName)}
            onClick={() => scrollToImageIndex(selectedIndex + 1)}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">{t("ui.accessibility.next_image")}</span>
          </Button>
        )}
      </div>

      <Lightbox
        images={stripImages}
        index={selectedIndex}
        open={lightboxOpen}
        cornerClassName={cornerClassName}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}
