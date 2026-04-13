import React from 'react';

export const BottomNavBar = () => {
    return (
        <div
            className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-background/95 backdrop-blur-xl border-t border-outline/20 z-50">
            <a className="flex flex-col items-center justify-center text-primary" href="#">
                <span className="material-symbols-outlined">explore</span>
                <span className="font-body text-[8px] uppercase tracking-widest mt-1">Explore</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
                <span className="material-symbols-outlined">search</span>
                <span className="font-body text-[8px] uppercase tracking-widest mt-1">Search</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
                <span className="material-symbols-outlined">confirmation_number</span>
                <span className="font-body text-[8px] uppercase tracking-widest mt-1">Tickets</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
                <span className="material-symbols-outlined">person</span>
                <span className="font-body text-[8px] uppercase tracking-widest mt-1">Profile</span>
            </a>
        </div>
    );
};
