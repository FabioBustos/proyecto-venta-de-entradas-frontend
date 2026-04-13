'use client';

export const TopNavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1113]/80 backdrop-blur-md border-b border-[#3f444c]/30 flex justify-between items-center px-6 md:px-12 py-5">
            <div className="flex items-center gap-12">
                <span className="text-xl font-[variable(--font-headline)] italic font-semibold tracking-tight text-[#e2e8f0]">The Electric Editorial</span>
                <div className="hidden md:flex items-center bg-[#24282e]/50 border border-[#3f444c]/20 px-4 py-2 w-80 group focus-within:border-[#d1d5db] transition-all">
                    <span className="material-symbols-outlined text-[#94a3b8] text-sm mr-2">search</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 text-xs w-full placeholder:text-[#94a3b8]/60 font-sans"
                        placeholder="Search curated experiences..." 
                        type="text" 
                    />
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="hidden lg:flex items-center gap-10 font-sans text-xs uppercase tracking-widest font-medium">
                    <a className="text-[#e2e8f0] border-b border-[#e2e8f0] pb-1" href="#">Explore</a>
                    <a className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors" href="#">Music</a>
                    <a className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors" href="#">Arts</a>
                </div>
                <div className="flex items-center gap-6">
                    <button className="material-symbols-outlined text-[#94a3b8] hover:text-[#e2e8f0] transition-all text-lg">
                        favorite
                    </button>
                    <button className="material-symbols-outlined text-[#94a3b8] hover:text-[#e2e8f0] transition-all text-lg">
                        notifications
                    </button>
                    <button className="w-8 h-8 rounded-full overflow-hidden border border-[#3f444c] flex items-center justify-center bg-[#24282e]">
                        <span className="material-symbols-outlined text-[#94a3b8] text-sm">person</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
