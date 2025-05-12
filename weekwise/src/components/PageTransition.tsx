"use client";

import React, { ReactNode } from "react";
import { gsap } from "gsap";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { usePathname } from "next/navigation";

interface Props {
    children: ReactNode;
}
export default function PageTransition({ children }: Props) {
    const pathname = usePathname();

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            // Exit: fade out + zoom out
            tl.to(".page-container", {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power1.out",
            });
            // Entry: fade in + zoom in
            tl.from(
                ".page-container",
                {
                    opacity: 0,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power1.out",
                },
                "+=0.1"
            );
        });

        return () => ctx.revert();
    }, [pathname]);

    return <div className="page-container">{children}</div>;
}
