import type { ReactNode, SVGProps } from 'react';
import { useId } from 'react';
import { vars } from './theme.css';

export type StaticIconName =
  | 'x'
  | 'plus'
  | 'backArrow'
  | 'camera'
  | 'check'
  | 'rightArrow'
  | 'downArrow'
  | 'crown'
  | 'setting';

export type ArrayIconVariant = 'badook' | 'list';
export type ToggleIconVariant = 'on' | 'off';
export type IconVariant = ArrayIconVariant | ToggleIconVariant;

export type ArrayIconName = 'array';
export type ToggleIconName = 'compass' | 'mypage' | 'heart' | 'coffee' | 'book';
export type IconName = StaticIconName | ArrayIconName | ToggleIconName;

type IconBaseProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  title?: string;
};

type StaticIconProps = IconBaseProps & {
  name: StaticIconName;
  variant?: never;
};

type ArrayIconProps = IconBaseProps & {
  name: ArrayIconName;
  variant?: ArrayIconVariant;
};

type ToggleIconProps = IconBaseProps & {
  name: ToggleIconName;
  variant?: ToggleIconVariant;
};

export type IconProps = StaticIconProps | ArrayIconProps | ToggleIconProps;

const lineProps = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8
} as const;

function staticIconPath(name: StaticIconName): ReactNode {
  switch (name) {
    case 'x':
      return <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" {...lineProps} />;
    case 'plus':
      return <path d="M12 5.5v13M5.5 12h13" {...lineProps} />;
    case 'backArrow':
      return <path d="M14.5 6 8.5 12l6 6" {...lineProps} />;
    case 'camera':
      return (
        <>
          <path
            d="M8.5 7.5 9.9 5.8h4.2l1.4 1.7H18a2.5 2.5 0 0 1 2.5 2.5v6.2a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5V10A2.5 2.5 0 0 1 6 7.5h2.5Z"
            {...lineProps}
          />
          <circle cx="12" cy="13" r="3.1" {...lineProps} />
        </>
      );
    case 'check':
      return <path d="m5.4 12.2 4 4 9.2-9.2" {...lineProps} />;
    case 'rightArrow':
      return <path d="m9.5 6 6 6-6 6" {...lineProps} />;
    case 'downArrow':
      return <path d="m6 9.5 6 6 6-6" {...lineProps} />;
    case 'crown':
      return <path d="m4.5 8 4.2 3.7L12 5.8l3.3 5.9L19.5 8l-1.4 9.7H5.9L4.5 8Z" {...lineProps} />;
    case 'setting':
      return (
        <>
          <path
            d="M13.7 4.5 14.3 7a7.2 7.2 0 0 1 1.6.9l2.4-.7 1.7 3-1.8 1.8v1.8l1.8 1.8-1.7 3-2.4-.7a7.2 7.2 0 0 1-1.6.9l-.6 2.5h-3.4l-.6-2.5a7.2 7.2 0 0 1-1.6-.9l-2.4.7-1.7-3 1.8-1.8V12L4 10.2l1.7-3 2.4.7A7.2 7.2 0 0 1 9.7 7l.6-2.5h3.4Z"
            {...lineProps}
          />
          <circle cx="12" cy="12.9" r="2.8" {...lineProps} />
        </>
      );
  }
}

function arrayIconPath(variant: ArrayIconVariant): ReactNode {
  if (variant === 'list') {
    return (
      <>
        <path d="M8.5 7h11M8.5 12h11M8.5 17h11" {...lineProps} />
        <path d="M4.7 7h.1M4.7 12h.1M4.7 17h.1" {...lineProps} />
      </>
    );
  }

  return (
    <>
      <rect height="5.8" rx="1.4" width="5.8" x="5" y="5" {...lineProps} />
      <rect height="5.8" rx="1.4" width="5.8" x="13.2" y="5" {...lineProps} />
      <rect height="5.8" rx="1.4" width="5.8" x="5" y="13.2" {...lineProps} />
      <rect height="5.8" rx="1.4" width="5.8" x="13.2" y="13.2" {...lineProps} />
    </>
  );
}

function toggleIconPath(name: ToggleIconName, variant: ToggleIconVariant): ReactNode {
  const isOn = variant === 'on';

  switch (name) {
    case 'compass':
      return (
        <>
          <circle cx="12" cy="12" r="8.2" {...lineProps} />
          <path
            d="m14.9 8.2-1.7 5-5 1.7 1.7-5 5-1.7Z"
            fill={isOn ? 'currentColor' : 'none'}
            {...lineProps}
          />
        </>
      );
    case 'mypage':
      return (
        <>
          <circle cx="12" cy="8.5" fill={isOn ? 'currentColor' : 'none'} r="3.2" {...lineProps} />
          <path d="M5.8 19.2c.7-3.5 3-5.5 6.2-5.5s5.5 2 6.2 5.5" fill="none" {...lineProps} />
        </>
      );
    case 'heart':
      if (isOn) {
        return (
          <path
            d="M12 19.3s-6.8-4.1-8.2-8.5C2.9 8 4.5 5.5 7.2 5.5c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3 2.7 0 4.3 2.5 3.4 5.3C18.8 15.2 12 19.3 12 19.3Z"
            fill="currentColor"
          />
        );
      }

      return (
        <path
          d="M12 19.3s-6.8-4.1-8.2-8.5C2.9 8 4.5 5.5 7.2 5.5c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3 2.7 0 4.3 2.5 3.4 5.3C18.8 15.2 12 19.3 12 19.3Z"
          {...lineProps}
        />
      );
    case 'coffee':
      return (
        <>
          <path
            d="M6.2 8.2h10.4v5.5a5.2 5.2 0 0 1-10.4 0V8.2Z"
            fill={isOn ? 'currentColor' : 'none'}
            {...lineProps}
          />
          <path d="M16.6 10h1.1a2.2 2.2 0 1 1 0 4.4h-1.1M7.3 19.3h8.4" {...lineProps} />
        </>
      );
    case 'book':
      return (
        <>
          <path
            d="M5 6.4h5.1c1.1 0 1.9.8 1.9 1.9v11c0-1.1-.8-1.9-1.9-1.9H5V6.4Z"
            fill={isOn ? 'currentColor' : 'none'}
            {...lineProps}
          />
          <path
            d="M19 6.4h-5.1c-1.1 0-1.9.8-1.9 1.9v11c0-1.1.8-1.9 1.9-1.9H19V6.4Z"
            fill={isOn ? 'currentColor' : 'none'}
            {...lineProps}
          />
        </>
      );
  }
}

function getIconPath(name: IconName, variant: IconVariant | undefined): ReactNode {
  if (name === 'array') {
    return arrayIconPath((variant as ArrayIconVariant | undefined) ?? 'badook');
  }

  if (
    name === 'compass' ||
    name === 'mypage' ||
    name === 'heart' ||
    name === 'coffee' ||
    name === 'book'
  ) {
    return toggleIconPath(name, (variant as ToggleIconVariant | undefined) ?? 'on');
  }

  return staticIconPath(name);
}

export function Icon(props: IconProps) {
  const {
    name,
    title,
    variant,
    width = 24,
    height = 24,
    color,
    style,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...svgProps
  } = props;
  const titleId = useId();
  const hasAccessibleName =
    ariaLabel !== undefined || ariaLabelledBy !== undefined || title !== undefined;
  const variantWithDefault = variant ?? (name === 'array' ? 'badook' : 'on');
  const defaultColor =
    name === 'heart' && variantWithDefault === 'on' && color === undefined
      ? vars.color.error
      : undefined;
  const iconStyle = defaultColor === undefined ? style : { color: defaultColor, ...style };
  const titleLabelledBy = title !== undefined && ariaLabel === undefined ? titleId : undefined;

  return (
    <svg
      aria-hidden={hasAccessibleName ? undefined : true}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? titleLabelledBy}
      color={color}
      fill="none"
      focusable="false"
      height={height}
      role={hasAccessibleName ? (role ?? 'img') : role}
      style={iconStyle}
      viewBox="0 0 24 24"
      width={width}
      {...svgProps}
    >
      {title !== undefined ? <title id={titleId}>{title}</title> : null}
      {getIconPath(name, variant)}
    </svg>
  );
}
