'use client';

import React, { forwardRef, useId } from 'react';

type Size = 'sm' | 'md' | 'lg';

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'type'> {
    checked: boolean;
    onChange: (value: boolean) => void;

    label?: string;
    helperText?: string;
    error?: string;

    size?: Size;
    fullWidth?: boolean;
    id?: string;
}

const sizeClass: Record<Size, { box: string; label: string }> = {
    sm: { box: 'h-4 w-4', label: 'text-xs' },
    md: { box: 'h-5 w-5', label: 'text-sm' },
    lg: { box: 'h-6 w-6', label: 'text-base' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    { checked, onChange, label, helperText, error, size = 'md', fullWidth, id, disabled, className = '', ...props },
    ref
) {
    const autoId = useId();
    const inputId = id || autoId;
    const helpId = helperText ? `${inputId}-help` : undefined;
    const errId = error ? `${inputId}-error` : undefined;

    return (
        <div className={fullWidth ? 'w-full' : undefined}>
            <label htmlFor={inputId} className={`flex cursor-pointer select-none items-center gap-3 ${className}`}>
                <input
                    id={inputId}
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    aria-invalid={!!error || undefined}
                    aria-describedby={[helpId, errId].filter(Boolean).join(' ') || undefined}
                    disabled={disabled}
                    className={[
                        'rounded border-border text-primary outline-none ring-1 ring-foreground/5 transition focus:ring-2 focus:ring-primary/40',
                        sizeClass[size].box,
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                    ].join(' ')}
                    {...props}
                />
                {label ? <span className={`${sizeClass[size].label} text-foreground`}>{label}</span> : null}
            </label>

            {helperText ? (
                <p id={helpId} className="mt-1 text-xs text-foreground/60">{helperText}</p>
            ) : null}
            {error ? (
                <p id={errId} className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
        </div>
    );
});

export default Checkbox;
