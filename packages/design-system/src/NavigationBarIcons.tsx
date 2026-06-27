import type { SVGProps } from 'react';

export function RestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        d="M9.2 22.2c2.8 2.8 7.3 2.8 10.1 0 2.4-2.4 2.8-6.1 1-8.9-.4-.6.2-1.4.9-1.2 1.2.4 2.3 1.1 3.2 2 3.4 3.4 3.4 8.9 0 12.3s-8.9 3.4-12.3 0c-.9-.9-1.6-2-2-3.2-.2-.7.6-1.3 1.2-.9 2.8 1.7 6.5 1.4 8.9-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12.6 6.8 14 9.7l3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.9 1.5.6-3.2L8 10.2l3.2-.5 1.4-2.9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function FeedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <rect
        height="19.4"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
        width="18.8"
        x="6.6"
        y="6.3"
      />
      <path
        d="M11.2 12.2h9.6M11.2 16h9.6M11.2 19.8h5.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ArchiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <path
        d="M8 11.7h16v12.1a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V11.7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 6.8h13a2 2 0 0 1 2 2v2.9h-17V8.8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M12.5 16h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function MyPageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 32 32" {...props}>
      <circle cx="16" cy="11.8" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.4 25.4c.7-4 3.6-6.6 7.6-6.6s6.9 2.6 7.6 6.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
