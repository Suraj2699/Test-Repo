'use client';

import React from 'react';
import Image from 'next/image';

export interface IconSpec {
    src: string;
    width: number;
    height: number;
}

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    leftImage?: IconSpec;
    rightImage?: IconSpec;
    className?: string;
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const HEIGHTS: Record<Size, string> = {
    sm: 'h-10 text-sm px-3',
    md: 'h-11 text-sm px-4',
    lg: 'h-12 text-base px-5',
    xl: 'h-13 text-xl px-5',
};

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90 border border-transparent cursor-pointer',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 border border-transparent cursor-pointer',
    outline: 'bg-transparent text-secondary border border-secondary cursor-pointer',
};

const DISABLED = 'disabled:opacity-60 disabled:cursor-not-allowed';

const BASE =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors select-none';

const Spinner = () => (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="opacity-25"
        />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
);

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    leftImage,
    rightImage,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    ...props
}) => {
    const widthCls = fullWidth ? 'w-full' : 'w-auto';

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={[BASE, HEIGHTS[size], VARIANTS[variant], DISABLED, widthCls, className].join(' ')}
        >
            {isLoading ? (
                <Spinner />
            ) : (
                leftImage && (
                    <Image src={leftImage.src} alt="" width={leftImage.width} height={leftImage.height} />
                )
            )}

            <span className="whitespace-nowrap">{children}</span>

            {!isLoading && rightImage && (
                <Image src={rightImage.src} alt="" width={rightImage.width} height={rightImage.height} />
            )}
        </button>
    );
};

export default Button;
