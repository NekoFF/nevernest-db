import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.DEV) {
      console.error('Unhandled frontend error', error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f7] px-4 py-10 text-[#111111]">
        <section className="w-full max-w-xl rounded-[28px] border border-black/[0.06] bg-white/92 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
            <AlertTriangle className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Something went wrong</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">The database view could not render.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6b7280]">
            Refresh the page to try again. In development, details are logged to the console without exposing a stack trace in the app UI.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
          >
            Refresh page
          </button>
        </section>
      </div>
    )
  }
}
