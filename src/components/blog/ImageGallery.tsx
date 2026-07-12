import { useState } from 'react';
import { Modal } from '@/components/common/Modal';

/** Simple lightbox gallery for a blog's additional images. */
export function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  if (!images.length) return null;

  return (
    <div className="mt-12">
      <h3 className="mb-4 font-display text-lg font-bold">Gallery</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src) => (
          <button
            key={src}
            onClick={() => setActive(src)}
            className="focus-ring group overflow-hidden rounded-xl"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} maxWidth="max-w-4xl">
        {active && <img src={active} alt="" className="max-h-[80vh] w-full rounded-lg object-contain" />}
      </Modal>
    </div>
  );
}
