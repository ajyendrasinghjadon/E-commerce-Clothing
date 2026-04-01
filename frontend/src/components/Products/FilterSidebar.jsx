import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    const [priceRange, setPriceRange] = useState([0, 100]);

    const categories = ["Top Wear", "Bottom Wear"];

    const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Gray", "Brown"];

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    const materials = ["Cotton", "Polyester", "Wool", "Silk", "Denim", "Leather"];

    const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];

    const genders = ["Men", "Women"]

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams])

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters };

        if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value]
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }
        setFilters(newFilters);
        updateURLParams(newFilters)
    }


    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","));
            } else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParams(params)
        navigate(`?${params.toString()}`)
    }

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice])
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice }
        setFilters(filters)
        updateURLParams(newFilters)
    }


    return (
        <div className="p-6 bg-gray-50 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-medium tracking-tight">Filters</h3>
                <button
                    onClick={() => {
                        setFilters({
                            category: "",
                            gender: "",
                            color: "",
                            size: [],
                            material: [],
                            brand: [],
                            minPrice: 0,
                            maxPrice: 100,
                        });
                        setSearchParams({});
                    }}
                    className="flex items-center gap-2 text-xs font-medium 
             px-3 py-1.5 rounded-full 
             bg-gray-200 hover:bg-black hover:text-white 
             transition-all duration-200"
                >
                    Clear All
                </button>
            </div>

            {/* CATEGORY */}
            <div className="mb-8 border-b pb-6">
                <h4 className="text-[13px] font-medium uppercase tracking-tight mb-4 text-gray-700">
                    Category
                </h4>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                onChange={handleFilterChange}
                                checked={filters.category === category}
                                className="w-4 h-4 accent-black"
                            />
                            <span className="text-[13px] text-gray-600 group-hover:text-black transition">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* GENDER */}
            <div className="mb-8 border-b pb-6">
                <h4 className="text-[13px] font-medium uppercase tracking-tight mb-4 text-gray-700">
                    Gender
                </h4>
                <div className="space-y-3">
                    {genders.map((gender) => (
                        <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="gender"
                                value={gender}
                                onChange={handleFilterChange}
                                checked={filters.gender === gender}
                                className="w-4 h-4 accent-black"
                            />
                            <span className="text-[13px] text-gray-600 group-hover:text-black transition">
                                {gender}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* COLOR */}
            <div className="mb-8 border-b pb-6">
                <h4 className="text-[13px] font-medium uppercase tracking-tight mb-4 text-gray-700">
                    Color
                </h4>

                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            name="color"
                            value={color}
                            onClick={handleFilterChange}
                            type="button"
                            className={`w-7 h-7 rounded-full border border-gray-300 
              transition transform hover:scale-110
              ${filters.color === color ? "ring-2 ring-black" : ""}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        />
                    ))}
                </div>
            </div>

            {/* SIZE */}
            <div className="mb-8 border-b pb-6">
                <h4 className="text-[13px] font-medium uppercase tracking-tight mb-4 text-gray-700">
                    Size
                </h4>

                <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => (
                        <label key={size} className="cursor-pointer">
                            <input
                                type="checkbox"
                                name="size"
                                value={size}
                                onChange={handleFilterChange}
                                checked={filters.size.includes(size)}
                                className="hidden peer"
                            />
                            <div className="border border-gray-300 text-[13px] py-2 text-center rounded-md 
                            peer-checked:bg-black peer-checked:text-white 
                            hover:bg-black hover:text-white transition">
                                {size}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* PRICE */}
            <div className="mb-8">
                <h4 className="text-[13px] font-medium uppercase tracking-tight mb-4 text-gray-700">
                    Price
                </h4>

                <input
                    type="range"
                    min={0}
                    max={100}
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full accent-black"
                />

                <div className="flex justify-between text-[13px] text-gray-600 mt-3">
                    <span>$0</span>
                    <span className="text-[13px] font-medium">${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );



}

export default FilterSidebar