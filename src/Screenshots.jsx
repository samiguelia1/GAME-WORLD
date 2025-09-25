import React, { useEffect, useState, useCallback, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function Screenshots() {
    const [isLoading, setIsLoading] = useState(true);
    const [screenshots, setScreenshots] = useState([]);
    const [selectedScreenshot, setSelectedScreenshot] = useState(0);
    const [prevScreenshot, setPrevScreenshot] = useState(0);
    const [direction, setDirection] = useState('right'); // 'left' or 'right'
    const imageRef = useRef(null);
    const imageContainerRef = useRef(null);
    const thumbnailsContainerRef = useRef(null);
    const thumbnailsRef = useRef({});
    const animationRef = useRef(null);
    const { id } = useParams();

    const fetchScreenshots = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=5fb7eda2d0ba415c8470730f5b1e56d5`);
            const data = await res.json();
            setScreenshots(data.results || []);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchScreenshots();
    }, [fetchScreenshots]);
    
    // Function to ensure selected thumbnail is in view - only scrolls if not fully visible
    const scrollSelectedThumbnailIntoView = useCallback(() => {
        if (!thumbnailsContainerRef.current || !thumbnailsRef.current[selectedScreenshot]) return;
        
        const container = thumbnailsContainerRef.current;
        const thumbnail = thumbnailsRef.current[selectedScreenshot];
        
        // Get positions and dimensions
        const containerRect = container.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();
        
        // Check if thumbnail is fully visible
        const isVisible = (
            thumbnailRect.left >= containerRect.left &&
            thumbnailRect.right <= containerRect.right
        );
        
        // Only scroll if the thumbnail is not fully visible
        if (!isVisible) {
            // Calculate center position for the container
            const containerCenter = containerRect.left + containerRect.width / 2;
            const thumbnailCenter = thumbnailRect.left + thumbnailRect.width / 2;
            
            // Calculate scroll amount to center the thumbnail
            const scrollLeft = container.scrollLeft + (thumbnailCenter - containerCenter);
            
            // Animate scroll to center the selected thumbnail
            gsap.to(container, {
                scrollLeft: scrollLeft,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }, [selectedScreenshot]);
    
    // Using the animationRef declared in the component scope
    
    useEffect(() => {
        if (isLoading || !imageRef.current) return;
        
        // Set the direction based on whether we're going forward or backward in the screenshots
        if (selectedScreenshot > prevScreenshot) {
            setDirection('right');
        } else if (selectedScreenshot < prevScreenshot) {
            setDirection('left');
        }
        
        // Store the current screenshot index for the next comparison
        setPrevScreenshot(selectedScreenshot);
        
        // Kill any existing animations to prevent conflicts
        if (animationRef.current) {
            animationRef.current.kill();
        }
        
        // Reset animation styles
        const imageElement = imageRef.current;
        
        // Create a new animation timeline and store the reference
        const tl = gsap.timeline();
        animationRef.current = tl;
        
        // Force clean state
        gsap.set(imageElement, { 
            clearProps: "all" 
        });
        
        // Add circular style when small
        imageElement.style.borderRadius = "50%";
        
        // Initial state of the image - starting small from the center as a circle
        gsap.set(imageElement, { 
            opacity: 0, 
            scale: 0.1,  // Start very small
            borderRadius: "50%", // Start as a circle
            transformOrigin: "center center" // Ensure scaling happens from center
        });
        
        // Run animation on screenshot change - zoom in from center while changing shape
        tl.to(imageElement, { 
            opacity: 1, 
            scale: 1,    // Grow to full size
            borderRadius: "0%", // End as a rectangle
            duration: 1.2, // Slightly longer animation
            ease: "power2.out", // Smoother easing for zoom effect
            onComplete: () => {
                // Scroll to make selected thumbnail visible after animation completes
                scrollSelectedThumbnailIntoView();
                // Clean up animation properties
                gsap.set(imageElement, { clearProps: "scale,borderRadius" });
            }
        });
        
        // Also scroll immediately for quick navigation
        scrollSelectedThumbnailIntoView();
        
        // Cleanup function to kill animations when component unmounts
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, [selectedScreenshot, isLoading, direction, prevScreenshot, scrollSelectedThumbnailIntoView]);

    return (
        <>
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <img src="/loading.svg" className="h-20" alt="Loading..." />
                </div>
            ) : (
                <div className="min-h-screen bg-[#1e222b3c] relative">


                    <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="max-w-7xl mx-auto">
                            
                            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-gray-400 text-sm font-mono">
                                        HOME / GAMES / {id} / SCREENSHOTS
                                    </p>
                                    <h1 className="text-2xl font-bold text-white mt-2">Game Screenshots</h1>
                                </div>
                                <Link 
                                    to={`/games/${id}`}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-3 py-2 sm:px-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
                                >
                                    <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
                                    
                                    <span className=" ">Back to Game</span>
                                </Link>
                            </div>

                            {screenshots.length > 0 ? (
                                <>
                                    {/* Main Featured Screenshot */}
                                    <div className="mb-4 flex justify-center" ref={imageContainerRef}>
                                        <div className="relative bg-[#22252b] border-2 border-gray-600/50 rounded-xl overflow-hidden shadow-lg aspect-video w-full max-w-5xl">
                                            <div ref={imageRef} className="w-full h-full">
                                                <LazyLoadImage
                                                    src={screenshots[selectedScreenshot]?.image}
                                                    alt={`Screenshot ${selectedScreenshot + 1}`}
                                                    className="w-full h-full object-cover"
                                                    effect="blur"
                                                    wrapperClassName="w-full h-full"
                                                />
                                            </div>
                                            
                                            {/* Next/Prev Navigation Buttons */}
                                            <div className="absolute inset-0 flex items-center justify-between px-4 md:opacity-0 md:hover:opacity-100 opacity-100 transition-opacity duration-300">
                                                <button 
                                                    onClick={() => {
                                                        // Circular navigation: if at first image, go to last image
                                                        setSelectedScreenshot(prev => 
                                                            prev === 0 ? screenshots.length - 1 : prev - 1
                                                        );
                                                    }}
                                                    className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 sm:p-3 transition-all duration-300"
                                                    aria-label="Previous screenshot"
                                                >
                                                    <i className="fas fa-chevron-left text-lg sm:text-xl"></i>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        // Circular navigation: if at last image, go to first image
                                                        setSelectedScreenshot(prev => 
                                                            prev === screenshots.length - 1 ? 0 : prev + 1
                                                        );
                                                    }}
                                                    className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 sm:p-3 transition-all duration-300"
                                                    aria-label="Next screenshot"
                                                >
                                                    <i className="fas fa-chevron-right text-lg sm:text-xl"></i>
                                                </button>
                                            </div>
                                            
                                            {/* Page Indicator */}
                                            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                                                {selectedScreenshot + 1} / {screenshots.length}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Thumbnail Taskbar */}
                                    <div 
                                        ref={thumbnailsContainerRef} 
                                        className="bg-[#101114] border border-gray-700 rounded-xl p-3 overflow-x-auto scroll-smooth"
                                    >
                                        <div className="flex gap-3 min-w-max justify-center">
                                            {screenshots.map((screenshot, index) => (
                                                <div 
                                                    key={index}
                                                    ref={el => thumbnailsRef.current[index] = el}
                                                    onClick={() => {
                                                        // Only animate if selecting a different thumbnail
                                                        if (selectedScreenshot !== index) {
                                                            setSelectedScreenshot(index);
                                                            
                                                            // Simple animation for the selected thumbnail - just scale up slightly
                                                            if (index !== selectedScreenshot) {
                                                                // Kill any existing animations on this element
                                                                gsap.killTweensOf(`.thumbnail-${index}`);
                                                                
                                                                gsap.fromTo(
                                                                    `.thumbnail-${index}`,
                                                                    { scale: 1 },
                                                                    { 
                                                                        scale: 1.05,
                                                                        duration: 0.3, // Slightly longer duration
                                                                        overwrite: "auto" // Ensures this animation takes precedence
                                                                    }
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    className={`
                                                        thumbnail-${index} w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 
                                                        ${selectedScreenshot === index 
                                                            ? 'border-2 border-white scale-105' 
                                                            : 'border border-gray-600'
                                                        }
                                                    `}
                                                >
                                                    <LazyLoadImage
                                                        src={screenshot.image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        effect="blur"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                                    <h2 className="text-white text-xl">No screenshots available for this game.</h2>
                                    <p className="text-gray-400 mt-2">Check back later or try another game.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Screenshots;