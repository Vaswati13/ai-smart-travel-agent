function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-black/10 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✈️</span>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent tracking-wider font-sans">
          VOYAGEAI
        </h1>
      </div>

      <div className="flex gap-8 text-sm font-semibold text-white/85">
        <a href="#" className="hover:text-blue-400 transition-colors">Discover</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Services</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Offlines</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
      </div>
    </nav>
  );
}

export default Navbar;