import React from 'react';

export const NewsletterSection = () => {
    return (
        <section className="px-6 md:px-12 py-24 max-w-[1400px] mx-auto">
            <div className="relative bg-surface p-12 md:p-24 border border-outline/20 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-headline text-4xl md:text-6xl font-light text-primary mb-8 tracking-tight">Stay
                        Informed.</h2>
                    <p className="text-on-surface-variant font-body font-light text-lg mb-12 leading-relaxed">Join a
                        community of 50,000+ patrons receiving priority access to editorial premieres and early-stage
                        ticketing.</p>
                    <div className="flex flex-col md:flex-row gap-0 max-w-lg mx-auto border border-outline/40">
                        <input
                            className="w-full bg-transparent border-none px-6 py-4 text-primary focus:ring-0 font-body text-sm placeholder:text-secondary/40"
                            placeholder="Email Address" type="email" />
                        <button
                            className="w-full md:w-auto bg-primary text-on-primary font-body text-[10px] uppercase tracking-[0.2em] font-bold px-10 py-4 hover:bg-accent transition-all">Join</button>
                    </div>
                </div>
            </div>
        </section>
    );
};
