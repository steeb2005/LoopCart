import { Link, useNavigate } from "react-router-dom"

export default function NotFound(){
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh w-full flex flex-col justify-center items-center px-6 py-12 bg-bg-canvas text-primary-text select-none">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        
        {/* Large Styled 404 Header */}
        <div className="relative flex items-center justify-center">
          <span className="text-8xl sm:text-9xl font-black text-border-color/40">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 bg-bg-surface border border-border-color rounded-full text-secondary-text shadow-sm">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Lost in space?
          </h1>
          <p className="text-sm text-secondary-text max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn't exist, was removed, or might be temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto cursor-pointer rounded-xl text-sm px-6 py-2.5 bg-bg-inverse text-primary-text-inverse font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md">
              Back to Home
            </button>
          </Link>
          
          <button 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto cursor-pointer rounded-xl text-sm px-6 py-2.5 border border-border-color text-primary-text font-semibold hover:bg-bg-surface active:scale-95 transition-all"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  )
}