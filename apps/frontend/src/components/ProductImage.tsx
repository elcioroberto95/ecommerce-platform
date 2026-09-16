'use client'

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2394a3b8"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'

interface ProductImageProps {
  src: string | null
  alt: string
  className?: string
  priority?: boolean
}

/** Client-side only because a broken remote URL has to fall back on `onError`. */
export function ProductImage({ src, alt, className, priority = false }: ProductImageProps) {
  return (
    <img
      src={src ?? PLACEHOLDER_IMAGE}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      onError={(event) => {
        event.currentTarget.src = PLACEHOLDER_IMAGE
      }}
    />
  )
}
