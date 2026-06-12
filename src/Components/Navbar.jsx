import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track responsive breakpoints and window scrolls smoothly
    useEffect(() => {
        const handleResize = () => {
            const mobileCheck = window.innerWidth <= 991;
            setIsMobile(mobileCheck);
            if (!mobileCheck) setIsOpen(false);
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Active state highlighting configuration
    const getLinkStyle = ({ isActive }) => ({
        textDecoration: "none",
        fontSize: isMobile ? "1.05rem" : "0.92rem", // Clean, deliberate typography spacing
        letterSpacing: "-0.1px",
        transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
        color: isActive ? "#4f46e5" : "#515154", // Premium soft charcoal for idle, corporate blue for active
        fontWeight: isActive ? "600" : "500",
        padding: isMobile ? "0.75rem 0" : "0.5rem 0",
        width: isMobile ? "100%" : "auto",
        textAlign: "center",
        display: "inline-block"
    });

    return (
        <header style={{
            ...styles.headerWrapper,
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 1)",
            backdropFilter: isScrolled ? "blur(24px)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(24px)" : "none", // Apple Safari support
            boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.02), inset 0 -1px 0 rgba(0, 0, 0, 0.04)" : "0 1px 0px rgba(0, 0, 0, 0.04)"
        }}>
            <nav style={{
                ...styles.navbarContainer,
                // Premium breathing room dynamic paddings
                padding: isMobile ? "1rem 1.5rem" : "1rem 5rem" 
            }}>
                {/* Brand Logo Identity */}
                <div style={styles.logoContainer}>
                    <NavLink to="/" style={styles.logo}>
                        Sanjay TechHub <span style={{ color: "#4f46e5", marginLeft: "1px" }}>.</span>
                    </NavLink>
                </div>

                {/* Animated Mobile Hamburger Button */}
                {isMobile && (
                    <div style={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                        <div style={{ ...styles.bar, width: "20px", transform: isOpen ? "rotate(45deg) translate(4px, 5px)" : "none" }}></div>
                        <div style={{ ...styles.bar, width: "16px", opacity: isOpen ? 0 : 1, transform: isOpen ? "translateX(4px)" : "none" }}></div>
                        <div style={{ ...styles.bar, width: "20px", transform: isOpen ? "rotate(-45deg) translate(4px, -5px)" : "none" }}></div>
                    </div>
                )}

                {/* Navigation Menu Links & CTA Wrapper */}
                <div style={{
                    ...styles.menuWrapper,
                    ...(isMobile ? styles.mobileMenu(isOpen) : styles.desktopMenu)
                }}>
                    <div style={{ 
                        ...styles.navLinks, 
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "1rem" : "2.5rem" 
                    }}>
                        <NavLink to="/" className="premium-nav-link" style={getLinkStyle} onClick={() => setIsOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/projects" className="premium-nav-link" style={getLinkStyle} onClick={() => setIsOpen(false)}>
                            Projects
                        </NavLink>
                        <NavLink to="/about" className="premium-nav-link" style={getLinkStyle} onClick={() => setIsOpen(false)}>
                            About
                        </NavLink>
                    </div>

                    {/* Premium Call to Action Button */}
                    <div style={{ width: isMobile ? "100%" : "auto", display: "flex", justifyContent: "center", marginTop: isMobile ? "0.5rem" : "0" }}>
                        <NavLink to="/contact" style={{...styles.ctaButton, width: isMobile ? "100%" : "auto"}} onClick={() => setIsOpen(false)}>
                            Let's Talk
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
}

// Professional Design System Layout Blueprint
const styles = {
    headerWrapper: {
        width: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 9999,
        boxSizing: "border-box",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    navbarContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        maxWidth: "1440px",
        margin: "0 auto"
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        fontSize: "1.15rem",
        fontWeight: "700",
        letterSpacing: "-0.3px",
        textDecoration: "none",
        color: "#0f0f11",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    },
    hamburger: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "5px",
        cursor: "pointer",
        zIndex: 10000,
        padding: "8px",
        borderRadius: "8px",
        transition: "background-color 0.2s ease"
    },
    bar: {
        height: "2px",
        backgroundColor: "#0f0f11",
        borderRadius: "4px",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    menuWrapper: {
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    desktopMenu: {
        display: "flex",
        alignItems: "center",
        gap: "3rem",
    },
    mobileMenu: (isOpen) => ({
        display: "flex",
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        flexDirection: "column",
        alignItems: "stretch",
        padding: isOpen ? "1.5rem 2rem 2.5rem 2rem" : "0rem 2rem",
        gap: "1.25rem",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
        borderBottom: "1px solid #eaeaea",
        boxSizing: "border-box",
        // Smooth architectural transition toggle instead of instant structural collapse
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: isOpen ? "auto" : "none",
        maxHeight: isOpen ? "400px" : "0px",
        overflow: "hidden"
    }),
    navLinks: {
        display: "flex",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
    },
    ctaButton: {
        backgroundColor: "#0f0f11",
        color: "#ffffff",
        padding: "0.65rem 1.5rem",
        borderRadius: "20px", // Clean pill design
        textDecoration: "none",
        fontSize: "0.88rem",
        fontWeight: "500",
        letterSpacing: "-0.1px",
        boxShadow: "0 4px 12px rgba(15, 15, 17, 0.1)",
        transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
        textAlign: "center",
        boxSizing: "border-box",
        border: "1px solid transparent"
    }
};

export default Navbar;