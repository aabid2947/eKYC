"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Menu, X, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import AppLogo from "@/assets/sidebarLogo.svg"
import { useGetServicesQuery } from "@/app/api/serviceApiSlice"

// Static navigation items, "Products" will be handled dynamically
const staticNavItems = [
  {
    name: "Solutions",
    hasDropdown: true,
    items: [
      { name: "Financial Services", href: "#", description: "Banking & fintech solutions" },
      { name: "Healthcare", href: "#", description: "HIPAA compliant verification" },
      { name: "E-commerce", href: "#", description: "Online marketplace security" },
      { name: "Real Estate", href: "#", description: "Property transaction verification" },
    ],
  },
  { 
    name: "Pricing", 
    hasDropdown: false,  
    href:"/pricing",
    items: [], 
  },
  {
    name: "Resources",
    hasDropdown: true,
    items: [
      { name: "Case Studies", href: "#", description: "Customer success stories" },
      { name: "Blog", href: "/blog", description: "Industry insights and updates" },
      { name: "Help Center", href: "#", description: "Support and FAQs" },
    ],
  },
  {
    name: "Company",
    hasDropdown: true,
    items: [
      { name: "About Us", href: "/about-us", description: "Our mission and team" },
      { name: "Careers", href: "#", description: "Join our growing team" },
      { name: "Contact", href: "/contact-us", description: "Get in touch with us" },
    ],
  },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [processedProducts, setProcessedProducts] = useState(null)
  const [navigationItems, setNavigationItems] = useState(staticNavItems)
  const [activeMobileCategory, setActiveMobileCategory] = useState(null)

  const navigate = useNavigate()
  const { data: servicesData } = useGetServicesQuery()

  // Process services data to group by category
   useEffect(() => {
    if (servicesData && Array.isArray(servicesData.data)) {
      const groupedServices = servicesData.data.reduce((acc, service) => {
        const category = service.category || "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(service);
        return acc;
      }, {});
      setProcessedProducts(groupedServices);

      // MODIFICATION: The default hovered category has been removed.
      // The right-hand service list will now only appear on user hover.
      
      // Create the new dynamic navigation items array
      const dynamicProductItem = {
          name: "Products",
          hasDropdown: true,
      };
      // Ensure "Products" is only added once
      if (!navigationItems.find(item => item.name === 'Products')) {
        setNavigationItems([dynamicProductItem, ...staticNavItems]);
      }
    }
  }, [servicesData, navigationItems]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleNavigation = (href) => {
    if (href) navigate(href);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }

  // The onClick dropdown toggle has been removed in favor of hover events.

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-out ${isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100" : "bg-white border-b-2 border-blue-400"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={()=> navigate("/")}>
              <img src={AppLogo} className="w-32 h-32 text-white" alt="App Logo"/>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex">
              <ul className="flex items-center space-x-6 relative">
                {navigationItems.map((item) => (
                  <li 
                    key={item.name} 
                    className="relative"
                    // MODIFIED: Added hover events to the list item to control the dropdown visibility
                    onMouseEnter={item.hasDropdown ? () => setActiveDropdown(item.name) : undefined}
                    onMouseLeave={item.hasDropdown ? () => setActiveDropdown(null) : undefined}
                  >
                    {item.name === "Products" && processedProducts ? (
                       <div className="relative">
                        <div // MODIFIED: Changed button to a div for semantics, but kept styling
                          className={`bg-transparent hover:bg-gray-50 text-gray-700 hover:text-[#1987BF] font-bold text-base px-5 py-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 flex items-center gap-1 cursor-pointer ${activeDropdown === item.name ? 'bg-gray-50 text-[#1987BF]' : ''} ${isScrolled ? "hover:shadow-sm" : ""}`}
                        >
                          {item.name}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                        </div>
                         {activeDropdown === item.name && (
                            <div className="absolute top-full left-0 mt-2 w-[40rem] bg-white shadow-xl rounded-xl border border-gray-100 p-4 z-50 flex">
                                {/* Left Pane: Categories */}
                                <div className="w-1/3 border-r border-gray-100 pr-3 space-y-1">
                                    {Object.keys(processedProducts).map(category => (
                                        <button
                                            key={category}
                                            onMouseEnter={() => setHoveredCategory(category)}
                                            onClick={() => setHoveredCategory(category)} // for mobile taps
                                            className={`w-full text-left p-3 rounded-lg font-semibold text-sm transition-colors duration-200 whitespace-nowrap ${hoveredCategory === category ? 'bg-blue-50 text-[#1987BF]' : 'text-gray-800 hover:bg-gray-50'}`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                {/* Right Pane: Services */}
                                <div className="w-2/3 pl-3 space-y-1">
                                    {hoveredCategory && processedProducts[hoveredCategory]?.map(service => (
                                        <a
                                            key={service._id}
                                            href={`/product/${service._id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigation(`/product/${service._id}`);
                                            }}
                                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                                        >
                                            <div className="font-semibold text-gray-800 group-hover:text-[#1987BF] transition-colors duration-200 text-sm whitespace-nowrap">
                                                {service.name}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                         )}
                       </div>
                    ) : item.hasDropdown ? (
                      <div className="relative">
                        <div // MODIFIED: Changed button to a div for semantics
                          className={`bg-transparent hover:bg-gray-50 text-gray-700 hover:text-[#1987BF] font-bold text-base px-5 py-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 flex items-center gap-1 cursor-pointer ${activeDropdown === item.name ? 'bg-gray-50 text-[#1987BF]' : ''} ${isScrolled ? "hover:shadow-sm" : ""}`}
                        >
                          {item.name}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                        </div>
                        {activeDropdown === item.name && (
                          <div className="absolute top-full left-0 mt-2 min-w-full bg-white shadow-xl rounded-xl border border-gray-100 py-3 px-3 z-50">
                            <div className="space-y-1">
                              {item.items?.map((subItem) => (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) => { e.preventDefault(); handleNavigation(subItem.href) }}
                                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                                >
                                  <div className="font-semibold text-gray-800 group-hover:text-[#1987BF] transition-colors duration-200 text-sm whitespace-nowrap">
                                    {subItem.name}
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.preventDefault(); navigate(item.href) }}
                        className={`bg-transparent font-bold hover:bg-gray-50 text-gray-700 hover:text-[#1987BF] text-base px-5 py-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 ${isScrolled ? "hover:shadow-sm" : ""}`}
                      >
                        {item.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-5">
              <div className="hidden lg:block">
                <Button
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-7 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 text-[1.1rem]"
                  type="button"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="lg:hidden h-12 w-12 p-0 hover:bg-gray-100 rounded-lg" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - NO CHANGES NEEDED */}
        {/* The mobile menu uses a standard click-to-open accordion pattern, which is best for touch devices. */}
        {/* The height animation (`max-h-0` to `max-h-[...]) already makes the submenu height dependent on its content, as requested. */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-gray-100 px-4 ${isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"}`}>
          <div className="px-4 py-8 space-y-5 max-w-7xl mx-auto">
            {navigationItems.map((item) => (
              <div key={item.name} className="space-y-3">
                 {item.name === 'Products' && processedProducts ? (
                    <div>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                            className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-900 hover:text-[#1987BF] transition-colors duration-200 py-3"
                        >
                            {item.name}
                            <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeDropdown === item.name ? "max-h-[1000px]" : "max-h-0"}`}>
                            <div className="pl-4 space-y-2 pt-3">
                                {Object.keys(processedProducts).map(category => (
                                    <div key={category}>
                                        <button
                                            onClick={() => setActiveMobileCategory(activeMobileCategory === category ? null : category)}
                                            className="flex items-center justify-between w-full text-left font-semibold text-lg text-gray-700 hover:text-[#1987BF] transition-colors duration-200 py-2"
                                        >
                                            {category}
                                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileCategory === category ? "rotate-180" : ""}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ease-out ${activeMobileCategory === category ? "max-h-96" : "max-h-0"}`}>
                                            <div className="pl-4 space-y-3 pt-2">
                                                {processedProducts[category].map(service => (
                                                    <a
                                                        key={service._id}
                                                        href={`/product/${service._id}`}
                                                        onClick={(e) => { e.preventDefault(); handleNavigation(`/product/${service._id}`) }}
                                                        className="block py-2 text-md text-gray-600 hover:text-[#1987BF] transition-colors duration-200 cursor-pointer"
                                                    >
                                                        {service.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-900 hover:text-[#1987BF] transition-colors duration-200 py-3"
                    >
                      {item.name}
                      <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="pl-4 space-y-3 pt-3">
                        {item.items?.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => { e.preventDefault(); handleNavigation(subItem.href) }}
                            className="block py-3 text-lg text-gray-600 hover:text-[#1987BF] transition-colors duration-200 cursor-pointer"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.preventDefault(); handleNavigation(item.href) }}
                    className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-900 hover:text-[#1987BF] transition-colors duration-200 py-3"
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}

            {/* Mobile Actions */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-center bg-transparent border-gray-200 text-gray-700 hover:border-[#1987BF] hover:text-[#1987BF] hover:bg-[#1987BF]/5 text-lg py-6"
                onClick={() => handleNavigation('/contact-us')}
              >
                <Phone className="w-5 h-5 mr-3" />
                Contact Sales
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg py-4"
                onClick={() => handleNavigation('/signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}