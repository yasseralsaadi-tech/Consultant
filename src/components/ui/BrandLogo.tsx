import type { CSSProperties } from 'react';
import fullLogo from '../../assets/brand/mostashar-logo-full.jpg';
import symbolLogo from '../../assets/brand/mostashar-symbol.png';
import { useLocale } from '../../contexts/LocaleContext';

interface Props {
  /** `full` = symbol + decorative Arabic wordmark (original image, never recreated in text).
   *  `symbol` = compact symbol-only crop of the original symbol image. */
  variant: 'full' | 'symbol';
  /** Rendered width in CSS px (height follows the intrinsic aspect ratio). */
  width?: number;
  className?: string;
  /** Decorative when a visible product name sits next to it. */
  decorative?: boolean;
}

/**
 * The ONLY component that renders the logo. Rules (see CLAUDE.md):
 * - uses the original raster files, never redrawn, recoloured, stretched or re-typed;
 * - keeps the intrinsic aspect ratio (height: auto);
 * - the dark logo panel stays as is on light backgrounds;
 * - the 10% clear space from the brand guide is applied around the full logo.
 */
export function BrandLogo({ variant, width, className = '', decorative = false }: Props) {
  const { t } = useLocale();
  const alt = decorative ? '' : t('app.nameFull');
  if (variant === 'symbol') {
    const size = width ?? 36;
    return <img className={`logo-symbol ${className}`} src={symbolLogo} width={512} height={512} alt={alt} style={{ width: size, height: size }} />;
  }
  const w = width ?? 280;
  return (
    <span className={`logo-clear ${className}`} style={{ '--logo-w': `${w}px` } as CSSProperties}>
      <img className="logo-full" src={fullLogo} width={715} height={340} alt={alt} />
    </span>
  );
}
