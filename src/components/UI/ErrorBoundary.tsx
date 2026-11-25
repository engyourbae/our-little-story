import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children?: ReactNode; fallback?: ReactNode; label?: string }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e: unknown) { console.warn('[ErrorBoundary]', this.props.label ?? '', e); }
  render() { return this.state.err ? (this.props.fallback ?? null) : this.props.children; }
}
