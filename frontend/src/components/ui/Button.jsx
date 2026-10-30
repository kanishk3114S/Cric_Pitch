import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  // Brand Crimson Primary Action
  primary:
    'bg-[#D91F2B] hover:bg-[#F02E3A] active:bg-[#B81520] text-white shadow-sm shadow-[#D91F2B]/25 border border-transparent font-semibold',
  
  // Elevated Surface Secondary Action
  secondary:
    'bg-theme-elevated hover:bg-theme-hover active:bg-theme-sunken text-theme-primary border border-theme-medium hover:border-theme-strong shadow-sm font-medium',
  
  // Clean Outlined Action
  outline:
    'bg-transparent hover:bg-theme-elevated active:bg-theme-sunken text-theme-primary border border-theme-medium hover:border-theme-strong font-medium',
  
  // Minimal Ghost Action
  ghost:
    'bg-transparent hover:bg-theme-elevated active:bg-theme-sunken text-theme-secondary hover:text-theme-primary border border-transparent font-medium',
  
  // Destructive Alert Action
  destructive:
    'bg-[#D91F2B]/15 hover:bg-[#D91F2B]/25 active:bg-[#D91F2B]/35 text-[#F02E3A] border border-[#D91F2B]/30 font-medium',
  
  // Grounded Research Emerald Variant
  emerald:
    'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 border border-transparent font-semibold',
  
  // Voice Cadence Amber Variant
  amber:
    'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black shadow-sm shadow-amber-500/20 border border-transparent font-bold',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-xs md:text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-sm md:text-base gap-2.5 rounded-xl',
  xl: 'h-14 px-7 text-base md:text-lg gap-3 rounded-2xl tracking-wide',
  icon: 'w-10 h-10 p-0 flex items-center justify-center rounded-xl',
  'icon-sm': 'w-8 h-8 p-0 flex items-center justify-center rounded-lg',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    icon: Icon,
    iconRight: IconRight,
    type = 'button',
    ...props
  },
  ref
) {
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91F2B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
});

export default Button;
