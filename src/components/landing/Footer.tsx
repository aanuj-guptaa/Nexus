export function Footer() {
  return (
    <footer className="px-6 md:px-12 py-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1" y="1" width="3" height="3" rx="0.5" fill="white" />
            <rect x="6" y="1" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
            <rect x="1" y="6" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
            <rect x="6" y="6" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Nexus</span>
        <span className="text-[13px] text-text-subtle ml-4">© 2025 All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        {['Privacy', 'Terms', 'Security', 'Status'].map(link => (
          <a key={link} href="#" className="text-[12px] text-text-muted hover:text-text-primary transition-colors">{link}</a>
        ))}
      </div>
    </footer>
  )
}
