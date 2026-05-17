import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function VehicleNavControls({ onPrevious, onNext }) {
  return (
    <div className="pointer-events-none absolute left-8 right-8 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between sm:left-10 sm:right-10 xl:right-[calc(340px+4.5rem)]">
      <button
        type="button"
        onClick={onPrevious}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/78 text-[#111111] shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur transition hover:-translate-x-0.5 hover:bg-white"
        aria-label="Previous vehicle"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/78 text-[#111111] shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur transition hover:translate-x-0.5 hover:bg-white"
        aria-label="Next vehicle"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  )
}
