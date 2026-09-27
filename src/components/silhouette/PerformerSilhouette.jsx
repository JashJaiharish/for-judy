export default function PerformerSilhouette({ className = '' }) {
  return (
    <div
      className={`photo-frame p-3 pb-5 w-[min(60vw,250px)] transition-all duration-700 ${className}`}
      style={{ rotate: '-2deg' }}
    >
      <img
        src="./photos/performer.jpg"
        alt="The Performer"
        loading="lazy"
        className="w-full aspect-[3/4] object-cover rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.2)]"
      />
    </div>
  )
}
