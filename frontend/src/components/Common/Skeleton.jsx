import React from 'react';

const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
);

export const ProductCardSkeleton = () => (
    <div className="bg-white p-2 sm:p-4 rounded-lg h-full">
        <div className="relative w-full h-48 sm:h-96 mb-2 sm:mb-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
        </div>
        <div className="relative h-3 w-3/4 bg-gray-200 mb-2 rounded overflow-hidden">
            <Shimmer />
        </div>
        <div className="relative h-3 w-1/4 bg-gray-200 rounded overflow-hidden">
            <Shimmer />
        </div>
    </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 m-4 sm:m-8 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export const ProductDetailsSkeleton = () => (
    <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-3 mr-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
                <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg"></div>
            </div>
            {/* Right Side */}
            <div className="md:w-1/2 md:ml-6 flex flex-col space-y-6">
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 w-3/4 rounded-md"></div>
                    <div className="h-6 bg-gray-200 w-1/4 rounded-md"></div>
                </div>
                <div className="h-20 bg-gray-200 w-full rounded-md"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 w-1/2 rounded-md"></div>
                    <div className="h-10 bg-gray-200 w-1/2 rounded-md"></div>
                </div>
                <div className="h-12 bg-gray-200 w-full rounded-md mt-4"></div>
            </div>
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="w-full bg-white rounded-lg border border-[#E5E5E5] overflow-hidden animate-pulse">
        <div className="bg-gray-50 h-12 border-b border-[#E5E5E5]"></div>
        <div className="p-4 space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export const OrderDetailsSkeleton = () => (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-10 bg-gray-200 w-1/4 mb-6 rounded-md"></div>
        <div className="p-4 sm:p-6 rounded-lg border border-gray-200 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="space-y-2 w-1/3">
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
                    <div className="h-6 bg-gray-200 w-24 rounded-full"></div>
                    <div className="h-6 bg-gray-200 w-32 rounded-full"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <div className="h-5 bg-gray-200 w-1/2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-5 bg-gray-200 w-1/2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center space-x-4 border-b border-gray-50 pb-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
