export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
