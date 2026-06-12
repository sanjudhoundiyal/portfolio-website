import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function Home() {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // सिस्टम मैट्रिक्स के लिए स्टेटिक लेकिन रियल डेटा काउंटर
    

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);

        const loadFeatured = async () => {
            try {
                const data = await getProjects();
                // अगर डेटा आ रहा है तो उसे दिखाएगा, नहीं तो प्रोफेशनल फॉलबैक डेटा सेट करेगा
                if (data && data.length > 0) {
                    setFeaturedProjects(data.slice(0, 2));
                } else {
                    setFeaturedProjects([
                        {
                            id: 1,
                            title: "E-Commerce Website",
                            technology: "ReactSpring BootMySQLREST APIs",
                            description: "A full-stack e-commerce platform developed using React, Spring Boot, and MySQL. The application includes product browsing, category-based filtering, shopping cart management, and a secure order workflow. Built with a responsive user interface, RESTful APIs, and a scalable backend architecture to ensure performance, reliability, and maintainability.",
                            githubUrl: "https://github.com/sanjudhoundiyal/Ecommerce-Project"
                        },
                        {
                            id: 2,
                            title: "Snake Game",
                            technology: "Python, Turtle Graphics, Pygame",
                            description: "A classic Snake game implemented using Python and the Pygame library, featuring smooth controls, score tracking, and increasing difficulty levels.",
                            githubUrl: "https://github.com/sanjudhoundiyal/Snake_game"
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error loading featured projects:", error);
            }
        };

        loadFeatured();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleDownloadResume = async (e) => {
        e.preventDefault();
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch("http://localhost:8080/api/resume/download");
            if (!response.ok) throw new Error("Download pipeline rejected.");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            const virtualLink = document.createElement("a");
            virtualLink.href = downloadUrl;
            virtualLink.setAttribute("download", "Sanjay_Resume.pdf");
            document.body.appendChild(virtualLink);
            virtualLink.click();
            
            virtualLink.remove();
            window.URL.revokeObjectURL(downloadUrl);
            setIsDownloaded(true);
        } catch (error) {
            console.error("Blob Streaming Error:", error);
            alert("Could not download resume. Please ensure file exists in backend.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* ADVANCED ENTERPRISE-GRADE UI INTERACTIONS */}
            <style>{`
                @keyframes professionalFadeUp {
                    0% { opacity: 0; transform: translate3d(0, 40px, 0); }
                    100% { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes pulseDot {
                    0% { transform: scale(0.9); opacity: 0.4; }
                    50% { transform: scale(1.3); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.4; }
                }
                @keyframes gridFlow {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }
                .animate-hero {
                    animation: professionalFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .grid-bg {
                    background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
                    background-size: 24px 24px;
                    animation: gridFlow 20s linear infinite;
                }
                .pulse-active {
                    animation: pulseDot 2s infinite ease-in-out;
                }
                .premium-card {
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                @media (min-width: 769px) {
                    .premium-card:hover {
                        transform: translate3d(0, -6px, 0);
                        box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08) !important;
                        border-color: #0f172a !important;
                    }
                    .premium-card:hover .tech-tag {
                        background-color: #0f172a !important;
                        color: #ffffff !important;
                    }
                }
                .action-btn {
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .action-btn:hover {
                    transform: translate3d(0, -3px, 0);
                    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.15) !important;
                }
                .action-btn:active {
                    transform: translate3d(0, 1px, 0) scale(0.98);
                }
            `}</style>

            {/* HERO HERO COMPONENT WITH GLOBAL GRID LAYER */}
            <section className="grid-bg" style={{
                ...styles.heroSection,
                padding: isMobile ? "5.5rem 1.5rem 4rem" : "9rem 2rem 7rem"
            }}>
                <div className="animate-hero" style={styles.heroContainer}>
                    <div style={{...styles.badgeText, alignSelf: isMobile ? "center" : "flex-start"}}>
                        <span className="pulse-active" style={styles.badgePulse}></span> 
                       <span style={{ color: "#475569", fontWeight: "500" }}>
  Developer Status:
</span> Available
                    </div>
                    
                    <h1 style={{...styles.mainTitle, fontSize: isMobile ? "2.6rem" : "4.5rem", textAlign: isMobile ? "center" : "left"}}>
                        Sanjay Dhoundiyal
                    </h1>
                    <div style={{...styles.subTitle, fontSize: isMobile ? "1.4rem" : "2rem", textAlign: isMobile ? "center" : "left"}}>
                        Software Engineer <span style={{color: "#64748b"}}> & </span>Backend Developer
                    </div>

                    <p style={{...styles.bioText, fontSize: isMobile ? "1.05rem" : "1.2rem", textAlign: isMobile ? "center" : "left"}}>
                        Designing and developing reliable, scalable, and secure web applications with a strong focus on clean architecture, maintainable code, and exceptional user experiences. Experienced in building RESTful APIs, high-performance backend systems, and responsive frontend interfaces using Spring Boot, React, and modern web technologies. Passionate about creating efficient digital solutions that prioritize performance, security, scalability, and long-term maintainability while solving real-world business challenges. 🚀 
                    </p>

                    {/* LIVE METRICS DASHBOARD DISPLAY */}
                    
                        
                

                    <div style={{
                        ...styles.ctaGroup,
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "stretch" : "center",
                        gap: "12px"
                    }}>
                        <a href="/projects" className="action-btn" style={styles.primaryBtn}>Explore My Expertise</a>
                        
                        {!isDownloaded && (
                            <button 
                                onClick={handleDownloadResume} disabled={isDownloading}
                                className="action-btn"
                                style={{
                                    ...styles.resumeBtn,
                                    backgroundColor: isDownloading ? "#94a3b8" : "#0f172a",
                                    cursor: isDownloading ? "not-allowed" : "pointer"
                                }}
                            >
                                {isDownloading ? "⚡ Fetching Encrypted File..." : "📥 Download Signed CV"}
                            </button>
                        )}
                        
                        <a href="/contact" className="action-btn" style={styles.secondaryBtn}>Initialize Handshake</a>
                    </div>
                </div>
            </section>

            {/* CORE SERVICES COMPETENCIES */}
            <section style={{...styles.skillsSection, padding: isMobile ? "4rem 1.5rem" : "6.5rem 2rem"}}>
                <div style={styles.container}>
                    <div style={styles.sectionHeaderMeta}>
                        <span style={styles.sectionSectionTag}>ENGINEERING CAPABILITIES</span>
                        <h2 style={{...styles.sectionHeading, fontSize: isMobile ? "1.8rem" : "2.5rem"}}>Technical Capabilities Matrix</h2>
                    </div>

                    <div style={{
                        ...styles.skillsGrid,
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                        gap: isMobile ? "16px" : "24px"
                    }}>
                        <div className="premium-card" style={styles.skillCard}>
                            <div style={styles.cardHeaderArea}>
                                <span style={styles.cardIndex}></span>
                                <h3 style={styles.skillTitle}>Frontend Engineering</h3>
                            </div>
                            <p style={styles.skillDesc}>Developing modern, responsive, and user-centric web interfaces with a strong focus on performance, usability, accessibility, and clean design principles.</p>
                        </div>

                        <div className="premium-card" style={styles.skillCard}>
                            <div style={styles.cardHeaderArea}>
                                <span style={styles.cardIndex}></span>
                                <h3 style={styles.skillTitle}>Backend Engineering</h3>
                            </div>
                            <p style={styles.skillDesc}>Building scalable, secure, and high-performance backend solutions with Spring Boot and modern development practices. Skilled in designing robust RESTful APIs, optimizing data workflows, and creating reliable application architectures that deliver seamless user experiences and long-term scalability.</p>
                        </div>

                        <div className="premium-card" style={styles.skillCard}>
                            <div style={styles.cardHeaderArea}>
                                <span style={styles.cardIndex}></span>
                                <h3 style={styles.skillTitle}>Database & Persistence</h3>
                            </div>
                            <p style={styles.skillDesc}>Building and maintaining robust database systems with an emphasis on performance, reliability, and efficient data management. Skilled in database design, optimization, and developing scalable solutions for modern applications.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED BUILDS */}
            {featuredProjects.length > 0 && (
                <section style={{...styles.featuredSection, padding: isMobile ? "4rem 1.5rem" : "6.5rem 2rem"}}>
                    <div style={styles.container}>
                        <div style={{
                            ...styles.sectionHeaderRow,
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: isMobile ? "flex-start" : "flex-end",
                            gap: isMobile ? "16px" : "24px",
                            marginBottom: "3rem"
                        }}>
                            <div style={styles.sectionHeaderMeta}>
                                <span style={styles.sectionSectionTag}>PRODUCTION DEPLOYMENTS</span>
                                <h2 style={{...styles.sectionHeading, margin: 0, fontSize: isMobile ? "1.8rem" : "2.5rem"}}>Featured Verified Builds</h2>
                            </div>
                            <a href="/projects" style={styles.textLink}>
                                Open Global Repository Source <span>→</span>
                            </a>
                        </div>

                        <div style={{
                            ...styles.projectsGrid,
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: isMobile ? "20px" : "32px"
                        }}>
                            {featuredProjects.map((project) => (
                                <div key={project.id} className="premium-card" style={styles.projectCard}>
                                    <div style={styles.projectCardTop}>
                                        <span className="tech-tag" style={styles.projectTechText}>{project.technology}</span>
                                        <h3 style={styles.projectTitleText}>{project.title}</h3>
                                        <p style={styles.projectDescText}>{project.description}</p>
                                    </div>
                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" style={styles.cardLink}>
                                        Inspect Source Pipeline Code <span style={{marginLeft: "4px"}}>→</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

// --- FULLY REDESIGNED ULTRA-PROFESSIONAL DESIGN SYSTEMS ---
const styles = {
    pageWrapper: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#0f172a",
        WebkitFontSmoothing: "antialiased"
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box"
    },
    heroSection: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "rgba(248, 250, 252, 0.4)"
    },
    heroContainer: {
        maxWidth: "880px",
        display: "flex",
        flexDirection: "column",
        gap: "1.8rem"
    },
    badgeText: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "0.8rem",
        fontWeight: "600",
        color: "#0f172a",
        backgroundColor: "#ffffff",
        padding: "0.5rem 1.2rem",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        letterSpacing: "0.02em"
    },
    badgePulse: {
        width: "8px",
        height: "8px",
        backgroundColor: "#10b981",
        borderRadius: "50%",
        display: "inline-block",
        marginRight: "10px"
    },
    badgeDivider: { color: "#cbd5e1", margin: "0 10px" },
    mainTitle: {
        fontWeight: "900",
        color: "#0f172a",
        lineHeight: "1.05",
        margin: 0,
        letterSpacing: "-0.04em"
    },
    subTitle: {
        fontWeight: "700",
        color: "#4f46e5",
        margin: "-0.5rem 0 0 0",
        letterSpacing: "-0.02em"
    },
    bioText: {
        color: "#334155",
        lineHeight: "1.75",
        margin: "0 0 0.5rem 0",
        fontWeight: "400"
    },
    inlineHighlight: {
        fontWeight: "600",
        color: "#0f172a",
        backgroundColor: "#f1f5f9",
        padding: "2px 6px",
        borderRadius: "4px"
    },
    metricsWrapper: {
        display: "grid",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.02)"
    },
    metricItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    metricLabel: {
        fontSize: "0.7rem",
        fontWeight: "700",
        color: "#64748b",
        letterSpacing: "0.08em"
    },
    metricValue: {
        fontSize: "1.25rem",
        fontWeight: "800",
        color: "#0f172a"
    },
    ctaGroup: {
        display: "flex",
        marginTop: "1rem"
    },
    primaryBtn: {
        color: "#ffffff",
        backgroundColor: "#4f46e5",
        padding: "1rem 2.2rem",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center",
        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)"
    },
    resumeBtn: {
        color: "#ffffff",
        border: "none",
        padding: "1rem 2.2rem",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center"
    },
    secondaryBtn: {
        backgroundColor: "#ffffff",
        color: "#0f172a",
        border: "1px solid #cbd5e1",
        padding: "1rem 2.2rem",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center"
    },
    skillsSection: {
        width: "100%",
        boxSizing: "border-box",
        borderBottom: "1px solid #f1f5f9"
    },
    sectionHeaderMeta: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "2.5rem"
    },
    sectionSectionTag: {
        fontSize: "0.75rem",
        fontWeight: "700",
        color: "#4f46e5",
        letterSpacing: "0.15em"
    },
    sectionHeading: {
        fontWeight: "800",
        color: "#0f172a",
        margin: 0,
        letterSpacing: "-0.03em"
    },
    skillsGrid: { display: "grid" },
    skillCard: {
        backgroundColor: "#f8fafc",
        padding: "2.5rem 2rem",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
    },
    cardHeaderArea: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "1.2rem"
    },
    cardIndex: {
        fontFamily: "monospace",
        fontSize: "0.85rem",
        color: "#64748b",
        fontWeight: "600"
    },
    skillTitle: {
        fontSize: "1.35rem",
        fontWeight: "700",
        color: "#0f172a",
        margin: 0
    },
    skillDesc: {
        fontSize: "0.95rem",
        color: "#475569",
        lineHeight: "1.6",
        margin: 0
    },
    featuredSection: {
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc"
    },
    sectionHeaderRow: {
        display: "flex",
        justifyContent: "space-between"
    },
    textLink: {
        color: "#4f46e5",
        textDecoration: "none",
        fontWeight: "700",
        fontSize: "0.95rem",
        borderBottom: "2px solid rgba(79, 70, 229, 0.15)",
        paddingBottom: "4px",
        transition: "all 0.2s"
    },
    projectsGrid: { display: "grid" },
    projectCard: {
        backgroundColor: "#ffffff",
        padding: "2.8rem 2.2rem",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2.5rem",
        border: "1px solid #e2e8f0"
    },
    projectCardTop: { display: "flex", flexDirection: "column" },
    projectTechText: {
        fontSize: "0.72rem",
        fontWeight: "700",
        color: "#4f46e5",
        backgroundColor: "#eff6ff",
        padding: "4px 10px",
        borderRadius: "4px",
        alignSelf: "flex-start",
        letterSpacing: "0.03em",
        transition: "all 0.3s ease"
    },
    projectTitleText: {
        fontSize: "1.5rem",
        fontWeight: "800",
        color: "#0f172a",
        margin: "1.2rem 0 0.8rem 0",
        letterSpacing: "-0.02em"
    },
    projectDescText: {
        fontSize: "0.96rem",
        color: "#475569",
        lineHeight: "1.65",
        margin: 0
    },
    cardLink: {
        color: "#0f172a",
        textDecoration: "none",
        fontWeight: "700",
        fontSize: "0.95rem",
        display: "inline-flex",
        alignItems: "center"
    }
};

export default Home;