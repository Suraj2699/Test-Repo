'use client';

import React, { forwardRef } from 'react';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type Align = 'left' | 'center' | 'right';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type Scale = 'expressive' | 'compact';

/** 6xl = 3.75rem = 60px */
const sizesExpressive: Record<Variant, string> = {
    display: 'text-4xl sm:text-5xl md:text-6xl', // capped at 60px
    h1: 'text-3xl sm:text-4xl md:text-5xl',
    h2: 'text-2xl sm:text-3xl md:text-4xl',
    h3: 'text-xl sm:text-2xl md:text-3xl',
    h4: 'text-lg sm:text-xl',
    h5: 'text-base sm:text-lg',
    h6: 'text-sm sm:text-base',
};

const sizesCompact: Record<Variant, string> = {
    display: 'text-3xl sm:text-4xl md:text-5xl',
    h1: 'text-2xl sm:text-3xl md:text-4xl',
    h2: 'text-xl sm:text-2xl',
    h3: 'text-lg sm:text-xl',
    h4: 'text-base sm:text-lg',
    h5: 'text-sm sm:text-base',
    h6: 'text-xs sm:text-sm',
};

const weightClass: Record<Weight, string> = {
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
};

const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
} as const;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    variant?: Variant;
    as?: HeadingTag;
    align?: keyof typeof alignClass;
    weight?: Weight;
    eyebrow?: string;
    scale?: Scale;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
    {
        variant = 'h2',
        as,
        align = 'center',
        weight = 'semibold',
        eyebrow,
        scale = 'expressive',
        className = '',
        children,
        ...rest
    },
    ref
) {
    const tag: HeadingTag = as ?? (variant === 'display' ? 'h1' : variant);
    const sizeClass = (scale === 'compact' ? sizesCompact : sizesExpressive)[variant];

    const classes = [
        sizeClass,
        weightClass[weight],
        alignClass[align],
        'tracking-tight',
        'text-foreground',
        'leading-[1.2]',
        'antialiased',
        className,
    ].join(' ');

    return (
        <header className={alignClass[align]}>
            {eyebrow ? (
                <div className="mb-2 text-xs uppercase tracking-[0.12em] text-foreground/60">
                    {eyebrow}
                </div>
            ) : null}

            {React.createElement(
                tag,
                {
                    ...rest,
                    ref,
                    className: classes,
                    style: { textWrap: 'balance', letterSpacing: 'var(--track-tight)', ...(rest.style || {}) },
                },
                children
            )}
        </header>
    );
});

export default Heading;
