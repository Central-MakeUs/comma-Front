import type { SVGProps } from 'react';

export type NavigationBarIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
};

export function RestIcon({ active = false, ...props }: NavigationBarIconProps) {
  if (active) {
    return (
      <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
        <path d="M9.333 8.333v-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M14.666 8.333v-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M20 8.333v-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path
          d="M24.001 13H6.667a1.333 1.333 0 0 0-1.333 1.333v4c0 5.155 4.178 9.334 9.333 9.334S24.001 23.488 24.001 18.333V13Z"
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M24.667 13H24v6.667h.667a3.333 3.333 0 1 0 0-6.667Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M5.334 27.667H24.001"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        d="M24.999 12.014a4.334 4.334 0 0 1-.268 8.651 10.356 10.356 0 0 1-3.957 6.002h3.225a1 1 0 0 1 0 2H5.332a1 1 0 0 1 0-2h3.226a10.326 10.326 0 0 1-4.226-8.334v-4A2.334 2.334 0 0 1 6.666 12h18.333v.014ZM6.666 14a.334.334 0 0 0-.334.333v4a8.334 8.334 0 0 0 16.667 0V14H6.666Zm18.333 4.64a2.334 2.334 0 0 0 0-4.614v4.614ZM9.332 3.333a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm5.334 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm5.333 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FeedIcon({ active = false, ...props }: NavigationBarIconProps) {
  if (active) {
    return (
      <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
        <path
          d="M16.001 14.668a1.334 1.334 0 1 1 0 2.667 1.334 1.334 0 0 1 0-2.667Z"
          fill="currentColor"
        />
        <path
          clipRule="evenodd"
          d="M15.999 2.667c7.364 0 13.334 5.969 13.334 13.333s-5.97 13.333-13.334 13.333C8.636 29.333 2.666 23.364 2.666 16S8.636 2.667 15.999 2.667Zm6.699 8.32c.347-1.042-.644-2.033-1.686-1.686l-8.783 2.928L9.3 21.013c-.347 1.042.644 2.033 1.686 1.686l8.784-2.928 2.928-8.784Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        d="M16.001 2.667c7.364 0 13.333 5.969 13.333 13.333s-5.969 13.333-13.333 13.333S2.668 23.364 2.668 16 8.637 2.667 16.001 2.667Zm0 2C9.742 4.667 4.668 9.741 4.668 16s5.074 11.333 11.333 11.333S27.334 22.259 27.334 16 22.26 4.667 16.001 4.667Zm4.696 3.685c1.824-.608 3.56 1.128 2.952 2.952l-2.928 8.784-.158.475-.474.157-8.784 2.928c-1.824.608-3.56-1.128-2.952-2.952l2.928-8.784.158-.475.474-.157 8.784-2.928Zm.633 1.897-8.31 2.77-2.77 8.31a.333.333 0 0 0 .422.422l8.309-2.77 2.771-8.31a.333.333 0 0 0-.422-.422Zm-5.329 4.418a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArchiveIcon({ active = false, ...props }: NavigationBarIconProps) {
  if (active) {
    return (
      <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
        <path
          clipRule="evenodd"
          d="M4 6.667a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v18.666a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6.667Zm6.667 0V16l3.057-3.057a1.333 1.333 0 0 1 1.886 0L18.667 16V6.667a1.333 1.333 0 0 0-1.334-1.334H12a1.333 1.333 0 0 0-1.333 1.334Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        d="M25.667 6.667A1.667 1.667 0 0 0 24.001 5h-4.334v11a1 1 0 0 1-1.707.707l-3.293-3.293-3.293 3.293A1 1 0 0 1 9.667 16V5H8.001a1.667 1.667 0 0 0-1.667 1.667v18.666A1.667 1.667 0 0 0 8.001 27h16a1.667 1.667 0 0 0 1.666-1.667V6.667Zm-14 6.919 2.293-2.293.076-.069a1 1 0 0 1 1.338.069l2.293 2.293V5h-6v8.586Zm16 11.747a3.667 3.667 0 0 1-3.666 3.667h-16a3.667 3.667 0 0 1-3.667-3.667V6.667A3.667 3.667 0 0 1 8.001 3h16a3.667 3.667 0 0 1 3.666 3.667v18.666Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MyPageIcon({ active = false, ...props }: NavigationBarIconProps) {
  if (active) {
    return (
      <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
        <path
          d="M21.048 19.667a7.286 7.286 0 0 1 7.285 7.285A2.048 2.048 0 0 1 26.285 29H5.714a2.048 2.048 0 0 1-2.048-2.048 7.286 7.286 0 0 1 7.285-7.285h10.097Z"
          fill="currentColor"
        />
        <path
          d="M15.999 4.333a6.333 6.333 0 1 1 0 12.667 6.333 6.333 0 0 1 0-12.667Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        clipRule="evenodd"
        d="M21.048 19.667a7.286 7.286 0 0 1 7.285 7.285A2.048 2.048 0 0 1 26.285 29H5.714a2.048 2.048 0 0 1-2.048-2.048 7.286 7.286 0 0 1 7.285-7.285h10.097Zm-10.097 2A5.286 5.286 0 0 0 5.666 26.952c0 .026.022.048.048.048h20.571a.049.049 0 0 0 .048-.048 5.286 5.286 0 0 0-5.285-5.285H10.951Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M15.999 4.333a6.333 6.333 0 1 1 0 12.667 6.333 6.333 0 0 1 0-12.667Zm0 2a4.333 4.333 0 1 0 0 8.667 4.333 4.333 0 0 0 0-8.667Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
