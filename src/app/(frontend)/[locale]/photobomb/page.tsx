import { staticMetadata } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { getGalleryPhotos } from '@/lib/activity-data'
import type { Locale } from '@/lib/i18n'

export const revalidate = 300

// Deterministic pseudo-random based on index
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

export default async function PhotoBombPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const photos = await getGalleryPhotos(locale)
  
  // Generate scattered positions in concentric rings
  const photoPositions = photos.map((photo, index) => {
    const total = photos.length
    
    // Distribute photos in rings
    // Ring 0 (inner): ~6 photos, Ring 1 (mid): ~10 photos, Ring 2 (outer): rest
    let ring: number
    let indexInRing: number
    let ringSize: number
    
    if (index < 6) {
      ring = 0; indexInRing = index; ringSize = Math.min(6, total)
    } else if (index < 16) {
      ring = 1; indexInRing = index - 6; ringSize = Math.min(10, total - 6)
    } else if (index < 30) {
      ring = 2; indexInRing = index - 16; ringSize = Math.min(14, total - 16)
    } else {
      ring = 3; indexInRing = index - 30; ringSize = Math.max(1, total - 30)
    }
    
    // Base angle for this photo in its ring
    const angleOffset = ring * 25 // offset each ring
    const angle = (indexInRing / ringSize) * 360 + angleOffset + seededRandom(index) * 30
    const angleRad = (angle * Math.PI) / 180
    
    // Distance from center (%)
    const ringDistances = [22, 34, 44, 52]
    const distance = ringDistances[ring] + seededRandom(index + 100) * 6
    
    // Convert polar to cartesian (centered at 50%, 50%)
    const x = 50 + Math.cos(angleRad) * distance
    const y = 50 + Math.sin(angleRad) * distance
    
    // Random rotation
    const rotation = -25 + seededRandom(index + 200) * 50
    
    // Size varies by ring (inner = bigger)
    const sizes = ['w-[7rem] sm:w-[9rem] md:w-[10rem]', 'w-[6rem] sm:w-[8rem] md:w-[9rem]', 'w-[5rem] sm:w-[7rem] md:w-[8rem]', 'w-[4rem] sm:w-[6rem] md:w-[7rem]']
    const size = sizes[ring] || sizes[3]
    
    // Z-index: inner ring on top
    const zIndex = 40 - ring * 10 + Math.round(seededRandom(index + 300) * 5)
    
    return { photo, x, y, rotation, size, zIndex, index }
  })

  return (
    <section aria-label="PhotoBomb" className="cursor-mild relative isolate bg-[#f5f0e8] min-h-screen overflow-hidden">
      <h1 className="sr-only">PhotoBomb</h1>
      
      {/* Scattered Polaroid Collage */}
      <div className="relative w-full h-screen">
        {photoPositions.map(({ photo, x, y, rotation, size, zIndex, index }) => (
          <div
            key={photo.src}
            className={`absolute ${size} transition-all duration-500 hover:scale-125 hover:!z-50 hover:!rotate-0 group`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              zIndex,
            }}
          >
            <div className="bg-white p-[0.3rem] sm:p-[0.4rem] pb-[1.2rem] sm:pb-[1.6rem] shadow-[2px_4px_12px_rgba(0,0,0,0.15)] group-hover:shadow-[4px_8px_25px_rgba(0,0,0,0.3)] transition-shadow duration-500">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index < 8}
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Center Circle with CTA */}
        <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="relative">
            {/* White circle background */}
            <div className="w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] md:w-[22rem] md:h-[22rem] rounded-full bg-[#f5f0e8] shadow-[0_0_60px_40px_rgba(245,240,232,0.9)] flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[var(--ink)] tracking-tight uppercase mb-1">
                  PhotoBomb
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] mb-4 sm:mb-6 px-4">
                  {locale === 'th' ? 'เรื่องราวผ่านเลนส์ของเรา' : 'Our story through the lens'}
                </p>
                <Link
                  href={`/${locale}/membership`}
                  className="inline-block bg-[var(--jci-blue)] text-white text-base sm:text-lg font-bold uppercase tracking-wider px-7 py-3.5 sm:px-10 sm:py-5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[var(--ink)] hover:shadow-xl"
                >
                  {locale === 'th' ? 'ร่วมเป็นสมาชิก' : 'Be A Member'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return staticMetadata(locale, 'photobomb')
}
