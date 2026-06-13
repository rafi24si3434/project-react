import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl max-w-xl mx-auto my-12 text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h1 className="text-lg font-bold text-red-800">Terjadi Kesalahan Aplikasi</h1>
          </div>
          <p className="text-sm text-red-700 font-semibold mb-3">
            Halaman ini gagal dimuat karena ada kesalahan sistem:
          </p>
          <pre className="p-4 bg-red-950 text-red-200 text-xs font-mono rounded-xl overflow-auto max-h-40">
            {this.state.error?.toString() || "Unknown Error"}
          </pre>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Tips: Silakan coba segarkan halaman (refresh) atau hubungi administrator jika masalah berlanjut.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Segarkan Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
