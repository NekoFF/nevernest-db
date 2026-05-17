import { getVehicleAsset } from '../../utils/assetHelpers.js'

export default function VehicleStage({ vehicle, direction = 1 }) {
  const image = getVehicleAsset(vehicle?.assetKey || vehicle?.name)
  const scale = vehicleScale(vehicle)
  return (
    <div className="relative flex min-h-[410px] items-end justify-center overflow-hidden rounded-[32px] border border-white/85 bg-[linear-gradient(180deg,#fcfdff_0%,#f8f8fb_42%,#eef1f4_43%,#fbfcfd_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-80px_128px_rgba(255,255,255,0.82),0_26px_82px_rgba(0,0,0,0.075)] sm:min-h-[500px] 2xl:min-h-[520px]">
      <div className="absolute inset-x-0 top-0 h-[56%] bg-[radial-gradient(circle_at_50%_58%,rgba(255,47,109,0.14),transparent_30%),radial-gradient(circle_at_68%_34%,rgba(14,165,233,0.10),transparent_28%),radial-gradient(circle_at_30%_24%,rgba(245,158,11,0.09),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.12))]" />
      <div className="absolute left-1/2 top-[14%] h-[58%] w-[82%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.86),rgba(255,255,255,0.22)_52%,transparent_72%)] blur-2xl" />
      <div className="absolute inset-x-[9%] bottom-[21%] h-[24%] origin-bottom -skew-x-6 rounded-[100%] border border-white/55 bg-[radial-gradient(ellipse,rgba(255,255,255,0.96),rgba(224,229,235,0.54)_48%,transparent_73%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_20px_60px_rgba(15,23,42,0.04)]" />
      <div className="absolute inset-x-0 bottom-0 h-[49%] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.92)),radial-gradient(ellipse_at_center,rgba(255,255,255,0.98),rgba(226,232,240,0.76)_55%,rgba(255,255,255,0.86))]" />
      <div className="absolute bottom-[30%] left-1/2 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/14 to-transparent" />
      <div className="absolute bottom-[22%] left-1/2 h-16 w-[74%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.82),transparent_70%)] blur-lg" />
      <div className="absolute bottom-[15%] left-1/2 h-[100px] w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(15,23,42,0.25),rgba(15,23,42,0.08)_45%,transparent_72%)] blur-xl" />
      <div className="absolute bottom-[4%] left-[10%] h-[34%] w-[80%] -skew-x-12 rounded-[100%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.76),transparent)] opacity-80 blur-xl" />
      <div className="absolute bottom-[9%] left-1/2 h-px w-[62%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-95" />
      <div className="absolute bottom-[2%] left-1/2 h-[18%] w-[78%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.70),transparent_72%)] blur-md" />
      <div key={`${vehicle?.id || vehicle?.name || 'vehicle'}-reflection`} className="absolute bottom-[0%] left-1/2 w-[112%] max-w-[1160px] -translate-x-1/2 animate-[vehicleIn_360ms_ease_both]" style={{ animationDirection: direction > 0 ? 'normal' : 'reverse', '--vehicle-scale': scale }}>
        {image ? (
          <img
            src={image}
            alt=""
            className="mx-auto w-full object-contain opacity-[0.27] blur-[3.5px] saturate-[0.86] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.46),transparent_68%)]"
            style={{ transform: `scale(${scale * 1.02}) scaleY(-0.31)` }}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        ) : null}
      </div>
      <div key={vehicle?.id || vehicle?.name || 'vehicle'} className="relative z-10 mb-[12%] w-[116%] max-w-[1160px] animate-[vehicleIn_380ms_cubic-bezier(.2,.8,.2,1)_both]" style={{ '--vehicle-from': `${direction * 18}px`, '--vehicle-scale': scale }}>
        {image ? (
          <img src={image} alt={vehicle?.name || 'Vehicle'} className="mx-auto max-h-[392px] w-full object-contain drop-shadow-[0_38px_46px_rgba(0,0,0,0.27)] sm:max-h-[490px] 2xl:max-h-[508px]" style={{ transform: `scale(${scale})` }} loading="lazy" decoding="async" draggable={false} />
        ) : (
          <div className="mx-auto flex h-56 w-full max-w-lg items-center justify-center rounded-[28px] border border-dashed border-black/[0.08] bg-white/70 text-sm font-bold text-[#9ca3af]">
            Vehicle image pending
          </div>
        )}
      </div>
      <style>{`
        @keyframes vehicleIn {
          from { opacity: 0; transform: translateX(var(--vehicle-from, 18px)) translateY(10px) scale(.985); }
          to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

function vehicleScale(vehicle) {
  if (vehicle?.id === 'rover-a1') return 1.46
  if (vehicle?.id === 'k01') return 1.34
  if (vehicle?.id === 'future-surge') return 1.3
  if (vehicle?.type === 'Motorcycle') return 1.25
  if (vehicle?.type === 'Hypercar') return 1.1
  return 1.15
}
