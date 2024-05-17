interface Properties {
  error?: Error
}

export default function LoadingOrError({ error }: Properties) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-xl">{error ? error.message : 'Loading...'}</h1>
    </div>
  )
}
