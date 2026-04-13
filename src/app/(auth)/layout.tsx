export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-background">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-foreground"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
            </div>
            <span className="text-3xl font-bold">EventosApp</span>
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold text-balance">
            Descubre experiencias inolvidables
          </h2>
          <p className="max-w-md text-center text-lg text-background/80 text-balance">
            Accede a miles de eventos, conciertos, teatro y mas. Tu proxima
            aventura te esta esperando.
          </p>

          {/* Decorative elements */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="m9 9 5 12 1.8-5.2L21 14Z" />
                <path d="M7.2 2.2 8 5.1" />
                <path d="m5.1 8-2.9-.8" />
                <path d="M14 4.1 12 6" />
                <path d="m6 12-1.9 2" />
              </svg>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0" />
              </svg>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
