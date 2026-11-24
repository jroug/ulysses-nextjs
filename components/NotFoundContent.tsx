import Link from 'next/link';

export default function NotFoundContent() {
  return <div className="not-found-content">
      <svg className="not-found-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <path d="M21.4 5.8a3 3 0 0 1 5.2 0l18.3 31.7a3 3 0 0 1-2.6 4.5H5.7a3 3 0 0 1-2.6-4.5L21.4 5.8Z" />
        <path d="M24 14v14" strokeLinecap="round" />
        <circle cx="24" cy="34" r="1.3" />
      </svg>
      <h1>404 Page not Found!</h1>
      <Link className="not-found-home" href="/">Return to Home</Link>
    </div>;
}
