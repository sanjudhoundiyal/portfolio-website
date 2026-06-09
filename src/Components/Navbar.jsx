import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track responsive breakpoints and window scrolls smoothly
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
            if (window.innerWidth > 991) setIsOpen(false);
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
        fontSize: "0.95rem",
        letterSpacing: "0.5px",
        transition: "color 0.25s ease",
        color: isActive ? "#0066cc" : "#1d1d1f",
        fontWeight: isActive ? "600" : "500",
        padding: "0.5rem 0",
    });

    return (
        <header style={{
            ...styles.headerWrapper,
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "#ffffff",
            backdropFilter: isScrolled ? "blur(20px)" : "none",
            boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.03)" : "0 1px 0px rgba(0, 0, 0, 0.06)"
        }}>
            <nav style={styles.navbarContainer}>
                {/* Brand Logo Identity */}
                <div style={styles.logoContainer}>
                    <NavLink to="/" style={styles.logo}>
                        Sanjay TechHub — <span style={{ color: "#0066cc" }}></span>
                    </NavLink>
                </div>

                {/* Animated Mobile Hamburger Button */}
                {isMobile && (
                    <div style={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                        <div style={{ ...styles.bar, width: "22px", transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></div>
                        <div style={{ ...styles.bar, width: isOpen ? "0px" : "16px", opacity: isOpen ? 0 : 1 }}></div>
                        <div style={{ ...styles.bar, width: "22px", transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}></div>
                    </div>
                )}

                {/* Navigation Menu Links & CTA Wrapper */}
                <div style={{
                    ...styles.menuWrapper,
                    ...(isMobile ? styles.mobileMenu(isOpen) : styles.desktopMenu)
                }}>
                    <div style={{ ...styles.navLinks, flexDirection: isMobile ? "column" : "row" }}>
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
                    <div style={{ width: isMobile ? "100%" : "auto", display: "flex", justifyContent: "center" }}>
                        <NavLink to="/contact" style={styles.ctaButton} onClick={() => setIsOpen(false)}>
                            Let's Talk
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
}

// Fixed Premium Inline Layout Blueprint
const styles = {
    headerWrapper: {
        width: "100%",                  // Spans completely from left margin edge to right margin edge
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 9999,
        boxSizing: "border-box",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    navbarContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem 4rem",         // Wide screen structural layout padding
        boxSizing: "border-box",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        fontSize: "1.25rem",
        fontWeight: "800",
        letterSpacing: "1.5px",
        textDecoration: "none",
        color: "#1d1d1f",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    hamburger: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "6px",
        cursor: "pointer",
        zIndex: 10000,
    },
    bar: {
        height: "2px",
        backgroundColor: "#1d1d1f",
        borderRadius: "10px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    menuWrapper: {
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    desktopMenu: {
        display: "flex",
        alignItems: "center",
        gap: "4rem",
    },
    mobileMenu: (isOpen) => ({
        display: isOpen ? "flex" : "none",
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 2rem",
        gap: "2.5rem",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        borderTop: "1px solid #f5f5f7",
    }),
    navLinks: {
        display: "flex",
        gap: "3.5rem",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    ctaButton: {
        backgroundColor: "#1d1d1f",
        color: "#ffffff",
        padding: "0.75rem 2rem",
        borderRadius: "30px",           // Clean luxury pill geometry 
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: "500",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        textAlign: "center",
    }
};

export default Navbar;