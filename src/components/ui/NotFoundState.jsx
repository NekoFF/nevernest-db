import EmptyState from './EmptyState.jsx'

export default function NotFoundState({
  title = 'Page not found',
  description = 'This route does not match anything in the current database.',
  action = null,
}) {
  return (
    <EmptyState
      eyebrow="Not found"
      title={title}
      description={description}
      action={action}
    />
  )
}

