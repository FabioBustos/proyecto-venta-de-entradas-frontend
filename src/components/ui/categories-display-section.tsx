import React from 'react';

export const CategoriesDisplaySection = () => {
    return (
        <section className="px-6 md:px-12 py-16 max-w-[1400px] mx-auto border-t border-outline/10">
            <h2 className="font-headline text-3xl font-light mb-12 text-primary flex items-center gap-6">
                Curated Categories
                <span className="flex-grow h-[1px] bg-outline/30"></span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Concerts */}
                <a className="group relative overflow-hidden aspect-square bg-surface border border-outline/20" href="#">
                    <img alt="Concerts"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 transition-all duration-700"
                        src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60">
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <span
                            className="font-headline text-xl italic text-primary group-hover:pl-2 transition-all duration-300">Concerts</span>
                    </div>
                </a>
                {/* Theatre */}
                <a className="group relative overflow-hidden aspect-square bg-surface border border-outline/20" href="#">
                    <img alt="Theatre"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 transition-all duration-700"
                        src="https://images.unsplash.com/photo-1503095396549-807759245b35?w=800" />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60">
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <span
                            className="font-headline text-xl italic text-primary group-hover:pl-2 transition-all duration-300">Theatre</span>
                    </div>
                </a>
                {/* Festivals */}
                <a className="group relative overflow-hidden aspect-square bg-surface border border-outline/20" href="#">
                    <img alt="Festivals"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 transition-all duration-700"
                        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800" />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60">
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <span
                            className="font-headline text-xl italic text-primary group-hover:pl-2 transition-all duration-300">Festivals</span>
                    </div>
                </a>
                {/* Sports */}
                <a className="group relative overflow-hidden aspect-square bg-surface border border-outline/20" href="#">
                    <img alt="Sports"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 transition-all duration-700"
                        src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800" />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60">
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <span
                            className="font-headline text-xl italic text-primary group-hover:pl-2 transition-all duration-300">Sports</span>
                    </div>
                </a>
            </div>
        </section>
    );
};
