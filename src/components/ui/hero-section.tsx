import React from 'react';

export const HeroSection = () => {
    return (
        <section className="px-6 md:px-12 py-12 md:py-20 max-w-[1400px] mx-auto">
            <div
                className="relative overflow-hidden aspect-[21/9] md:aspect-[2.5/1] bg-surface-container border border-outline/20">
                <img alt="Major music event"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 brightness-75"
                    data-alt="vibrant live concert scene with a large crowd raising their hands under intense purple and blue stage lights and laser beams"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOH3sIbA38hHAxfx4drViCkxpJcQ99f_rNrXe0MPFdSmyz_Q9Bze7lRvCDkmb7yLP1jZwK0kZfJj9An8y1ctnWVC2nFpEtoUSyS-R1p4L9llXAh2XbS8zMp1BanCNoUSVp6GEMxnJiqmNmBl6livelM_D5tO84uEGUMQioPlGxyZPGKlJtGiVb27-552N-6CG4hovLYOtpoz7li5okJpYFcSaidPloJLGHxl8nZ770VfNuUtsaKWjnaS7QLLE1eZwJlSwp1W_eAZ8" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary border-l border-secondary pl-3">Editorial
                            Selection</span>
                    </div>
                    <h1
                        className="font-headline text-5xl md:text-8xl font-light text-primary leading-[0.9] tracking-tight mb-8">
                        Neon Dreams <br /><span className="italic font-extralight text-secondary">MMXXIV</span>
                    </h1>
                    <p
                        className="font-body text-base md:text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed font-light">
                        A multi-sensory exploration of digital soundscapes and light architecture. Three nights of
                        boundary-pushing performance in an industrial cathedral.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="bg-primary text-on-primary font-body text-xs uppercase tracking-widest font-semibold px-10 py-4 hover:bg-accent transition-all active:scale-[0.98]">
                            Acquire Passes
                        </button>
                        <button
                            className="border border-outline text-primary font-body text-xs uppercase tracking-widest font-semibold px-10 py-4 hover:bg-surface-container transition-all active:scale-[0.98]">
                            View Program
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
