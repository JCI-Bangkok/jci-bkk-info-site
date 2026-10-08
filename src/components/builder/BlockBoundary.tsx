"use client";
import { Component, type ReactNode } from 'react';

export class BlockBoundary extends Component<{ children: ReactNode; label: string; editor: boolean }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return this.props.editor ? <div role="alert" className="rounded border border-red-200 bg-red-50 p-5 text-sm">Unable to preview {this.props.label}. Check the block settings.<button type="button" onClick={() => this.setState({ failed: false })} className="ml-3 underline">Retry preview</button></div> : <></>;
  }
}
