/**
 * Error State Component for Analytics Dashboard
 */

interface IErrorStateProps {
  error: Error | unknown
  onRetry: () => void
}

export const ErrorState = ({ error, onRetry }: IErrorStateProps) => {
  return (
    <div className="container mx-auto py-8">
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">
          Failed to load analytics
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error
            ? error.message
            : 'An error occurred while loading dashboard data'}
        </p>
        <button
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
