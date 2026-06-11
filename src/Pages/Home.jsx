import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function Home() {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);

        const loadFeatured = async () => {
            try {
                const data = await getProjects();
                setFeaturedProjects(data.slice(0, 2));
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
            {/* HARDWARE ACCELERATED PRO ANIMATIONS */}
            <style>{`
                @keyframes professionalFadeUp {
                    0% {
                        opacity: 0;
                        transform: translate3d(0, 20px, 0);
                    }
                    100% {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }

                @keyframes softPulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }

                .animate-hero {
                    animation: professionalFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    will-change: transform, opacity;
                }

                .pulse-dot {
                    animation: softPulse 2s infinite ease-in-out;
                }

                /* Mobile Smooth Interactive Cards */
                .interactive-card {
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                                box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                                border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    will-change: transform, box-shadow;
                }

                @media (min-width: 769px) {
                    .interactive-card:hover {
                        transform: translate3d(0, -6px, 0);
                        box-shadow: 0 20px 38px rgba(0, 102, 204, 0.06) !important;
                        border-color: rgba(0, 102, 204, 0.2) !important;
                    }
                }

                /* Mobile-specific touch feedback (No heavy scale on tap to prevent layout breaking) */
                @media (max-width: 768px) {
                    .interactive-card:active {
                        background-color: #fafbfc !important;
                        border-color: rgba(0, 102, 204, 0.15) !important;
                    }
                }

                /* Button Micro-interactions */
                .btn-interaction {
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .btn-interaction:hover {
                    opacity: 0.95;
                    transform: translate3d(0, -1px, 0);
                }
                .btn-interaction:active {
                    transform: translate3d(0, 1px, 0) scale(0.98);
                }

                /* Animated Text Arrows */
                .arrow-link {
                    display: inline-flex;
                    align-items: center;
                    transition: color 0.2s ease;
                }
                .arrow-link span {
                    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .arrow-link:hover span {
                    transform: translate3d(5px, 0, 0);
                }
            `}</style>

            {/* HERO SECTION */}
            <section style={{
                ...styles.heroSection,
                padding: isMobile ? "4.5rem 1.25rem 3rem" : "7.5rem 2rem 5rem"
            }}>
                <div className="animate-hero" style={{...styles.heroContainer, textAlign: isMobile ? "center" : "left"}}>
                    <span style={{...styles.badgeText, margin: isMobile ? "0 auto" : "0 auto 0 0"}}>
                        <span className="pulse-dot" style={styles.badgePulse}></span> Available for Opportunities
                    </span>
                    <h1 style={{...styles.mainTitle, fontSize: isMobile ? "2.4rem" : "3.8rem"}}>
                        Hi, I am Sanjay<span style={{ color: "#0066cc" }}>.</span>
                    </h1>
                    <p style={{...styles.bioText, fontSize: isMobile ? "1.05rem" : "1.25rem"}}>
                        A passionate software engineer focused on building robust backend systems, distributed architectures, and clean, high-performance web applications. I turn complex database problems into elegant, scalable digital experiences.
                    </p>
                    <div style={{
                        ...styles.ctaGroup,
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "stretch" : "center",
                        gap: isMobile ? "0.8rem" : "1rem"
                    }}>
                        <a href="/projects" className="btn-interaction" style={{...styles.primaryBtn, backgroundColor: "#0066cc"}}>Explore My Work</a>
                        
                        {!isDownloaded && (
                            <button 
                                onClick={handleDownloadResume} disabled={isDownloading}
                                className="btn-interaction"
                                style={{
                                    ...styles.resumeBtn,
                                    backgroundColor: isDownloading ? "#86868b" : "#1d1d1f",
                                    cursor: isDownloading ? "not-allowed" : "pointer"
                                }}
                            >
                                {isDownloading ? "⏳ Downloading..." : "📥 Download Resume"}
                            </button>
                        )}
                        
                        <a href="/contact" className="btn-interaction" style={styles.secondaryBtn}>Get In Touch</a>
                    </div>
                </div>
            </section>

            {/* CORE EXPERTISE MATRICES */}
            <section style={{...styles.skillsSection, padding: isMobile ? "3.5rem 1.25rem" : "5.5rem 2rem"}}>
                <div style={styles.container}>
                    <h2 style={{...styles.sectionHeading, textAlign: isMobile ? "center" : "left", fontSize: isMobile ? "1.8rem" : "2.2rem"}}>Core Competencies</h2>
                    <div style={{
                        ...styles.skillsGrid,
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(310px, 1fr))",
                        gap: isMobile ? "1.25rem" : "1.75rem"
                    }}>
                        <div className="interactive-card" style={styles.skillCard}>
                            <div style={styles.skillIcon}>⚙️</div>
                            <h3 style={styles.skillTitle}>Backend Engineering</h3>
                            <p style={styles.skillDesc}>Designing enterprise REST APIs, microservices architectures, and secure business logic processing units.</p>
                        </div>
                        <div className="interactive-card" style={styles.skillCard}>
                            <div style={styles.skillIcon}>📊</div>
                            <h3 style={styles.skillTitle}>Database Architecture</h3>
                            <p style={styles.skillDesc}>Data modeling, complex query optimizations, and data persistence management across relational storage pipelines.</p>
                        </div>
                        <div className="interactive-card" style={styles.skillCard}>
                            <div style={styles.skillIcon}>💻</div>
                            <h3 style={styles.skillTitle}>Full-Stack Integration</h3>
                            <p style={styles.skillDesc}>Bridging secure data pipelines seamlessly into interactive, dynamic, responsive frontend responsive views.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE SYSTEM HIGHLIGHTS */}
            {featuredProjects.length > 0 && (
                <section style={{...styles.featuredSection, padding: isMobile ? "3.5rem 1.25rem" : "5.5rem 2rem"}}>
                    <div style={styles.container}>
                        <div style={{
                            ...styles.sectionHeaderRow,
                            flexDirection: isMobile ? "column" : "row",
                            gap: isMobile ? "0.5rem" : "1rem",
                            textAlign: isMobile ? "center" : "left",
                            marginBottom: isMobile ? "2rem" : "3rem"
                        }}>
                            <h2 style={{...styles.sectionHeading, margin: 0, fontSize: isMobile ? "1.8rem" : "2.2rem"}}>Featured Builds</h2>
                            <a href="/projects" className="arrow-link" style={styles.textLink}>
                                See all developments &nbsp;<span>→</span>
                            </a>
                        </div>
                        <div style={{
                            ...styles.projectsGrid,
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: isMobile ? "1.25rem" : "2rem"
                        }}>
                            {featuredProjects.map((project) => (
                                <div key={project.id} className="interactive-card" style={styles.projectCard}>
                                    <div>
                                        <span style={styles.projectTechText}>{project.technology}</span>
                                        <h3 style={styles.projectTitleText}>{project.title}</h3>
                                        <p style={styles.projectDescText}>{project.description}</p>
                                    </div>
                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="arrow-link" style={styles.cardLink}>
                                        Analyze Repository Source &nbsp;<span>→</span>
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

const styles = {
    pageWrapper: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fafbfc",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased"
    },
    container: {
        maxWidth: "1120px",
        margin: "0 auto",
        boxSizing: "border-box",
    },
    heroSection: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #edf0f2"
    },
    heroContainer: {
        maxWidth: "760px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        opacity: 0
    },
    badgeText: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.82rem",
        fontWeight: "600",
        color: "#1a7330",
        backgroundColor: "#e6f7ec",
        padding: "0.45rem 1rem",
        borderRadius: "30px",
        letterSpacing: "0.1px"
    },
    badgePulse: {
        width: "6px",
        height: "6px",
        backgroundColor: "#2cd15b",
        borderRadius: "50%",
        display: "inline-block"
    },
    mainTitle: {
        fontWeight: "800",
        color: "#111112",
        lineHeight: "1.15",
        margin: 0,
        letterSpacing: "-0.03em"
    },
    bioText: {
        color: "#4f4f53",
        lineHeight: "1.65",
        margin: 0,
        fontWeight: "400"
    },
    ctaGroup: {
        display: "flex",
        marginTop: "0.5rem"
    },
    primaryBtn: {
        color: "#ffffff",
        padding: "0.95rem 2rem",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.96rem",
        textAlign: "center",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 102, 204, 0.15)"
    },
    resumeBtn: {
        color: "#ffffff",
        border: "none",
        padding: "0.95rem 2rem",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "0.96rem",
        textAlign: "center"
    },
    secondaryBtn: {
        backgroundColor: "#ffffff",
        color: "#1d1d1f",
        border: "1px solid #d2d2d7",
        padding: "0.95rem 2rem",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.96rem",
        textAlign: "center"
    },
    skillsSection: {
        width: "100%",
        boxSizing: "border-box"
    },
    sectionHeading: {
        fontWeight: "800",
        color: "#1d1d1f",
        margin: "0 0 2rem 0",
        letterSpacing: "-0.02em"
    },
    skillsGrid: {
        display: "grid"
    },
    skillCard: {
        backgroundColor: "#ffffff",
        padding: "2.25rem 1.75rem",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.01)",
        border: "1px solid #eaeef1"
    },
    skillIcon: {
        fontSize: "2rem",
        marginBottom: "1rem"
    },
    skillTitle: {
        fontSize: "1.3rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 0.5rem 0"
    },
    skillDesc: {
        fontSize: "0.96rem",
        color: "#66666b",
        lineHeight: "1.55",
        margin: 0
    },
    featuredSection: {
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #edf0f2"
    },
    sectionHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textLink: {
        color: "#0066cc",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "1rem"
    },
    projectsGrid: {
        display: "grid"
    },
    projectCard: {
        backgroundColor: "#f7f9fa",
        padding: "2.25rem 1.75rem",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2.25rem",
        border: "1px solid #eaeef1"
    },
    projectTechText: {
        fontSize: "0.75rem",
        fontWeight: "700",
        color: "#0066cc",
        textTransform: "uppercase",
        letterSpacing: "0.8px"
    },
    projectTitleText: {
        fontSize: "1.45rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0.5rem 0"
    },
    projectDescText: {
        fontSize: "0.98rem",
        color: "#4f4f53",
        lineHeight: "1.55",
        margin: 0
    },
    cardLink: {
        color: "#1d1d1f",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.96rem"
    }
};

export default Home;