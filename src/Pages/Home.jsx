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
            {/* HERO SECTION */}
            <section style={{
                ...styles.heroSection,
                padding: isMobile ? "4rem 1rem" : "6rem 2rem"
            }}>
                <div style={{...styles.heroContainer, textAlign: isMobile ? "center" : "left"}}>
                    <span style={styles.badgeText}>Available for Opportunities</span>
                    <h1 style={{...styles.mainTitle, fontSize: isMobile ? "2.5rem" : "3.5rem"}}>
                        Hi, I am Sanjay<span style={{ color: "#0066cc" }}>.</span>
                    </h1>
                    <p style={{...styles.bioText, fontSize: isMobile ? "1.1rem" : "1.25rem"}}>
                        A passionate software engineer focused on building robust backend systems, distributed architectures, and clean, high-performance web applications. I turn complex database problems into elegant, scalable digital experiences.
                    </p>
                    <div style={{
                        ...styles.ctaGroup,
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "stretch" : "center"
                    }}>
                        <a href="/projects" style={styles.primaryBtn}>Explore My Work</a>
                        
                        {!isDownloaded && (
                            <button 
                                onClick={handleDownloadResume} disabled={isDownloading}
                                style={{
                                    ...styles.resumeBtn,
                                    backgroundColor: isDownloading ? "#86868b" : "#0066cc",
                                    cursor: isDownloading ? "not-allowed" : "pointer"
                                }}
                            >
                                {isDownloading ? "⏳ Downloading..." : "📥 Download Resume"}
                            </button>
                        )}
                        
                        <a href="/contact" style={styles.secondaryBtn}>Get In Touch</a>
                    </div>
                </div>
            </section>

            {/* CORE EXPERTISE MATRICES */}
            <section style={{...styles.skillsSection, padding: isMobile ? "3rem 1rem" : "5rem 2rem"}}>
                <div style={styles.container}>
                    <h2 style={{...styles.sectionHeading, textAlign: isMobile ? "center" : "left"}}>Core Competencies</h2>
                    <div style={{
                        ...styles.skillsGrid,
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))"
                    }}>
                        <div style={styles.skillCard}>
                            <div style={styles.skillIcon}>⚙️</div>
                            <h3 style={styles.skillTitle}>Backend Engineering</h3>
                            <p style={styles.skillDesc}>Designing enterprise REST APIs, microservices architectures, and secure business logic processing units.</p>
                        </div>
                        <div style={styles.skillCard}>
                            <div style={styles.skillIcon}>📊</div>
                            <h3 style={styles.skillTitle}>Database Architecture</h3>
                            <p style={styles.skillDesc}>Data modeling, complex query optimizations, and data persistence management across relational storage pipelines.</p>
                        </div>
                        <div style={styles.skillCard}>
                            <div style={styles.skillIcon}>💻</div>
                            <h3 style={styles.skillTitle}>Full-Stack Integration</h3>
                            <p style={styles.skillDesc}>Bridging secure data pipelines seamlessly into interactive, dynamic, responsive frontend responsive views.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE SYSTEM HIGHLIGHTS */}
            {featuredProjects.length > 0 && (
                <section style={{...styles.featuredSection, padding: isMobile ? "3rem 1rem" : "5rem 2rem"}}>
                    <div style={styles.container}>
                        <div style={{
                            ...styles.sectionHeaderRow,
                            flexDirection: isMobile ? "column" : "row",
                            gap: "1rem",
                            textAlign: isMobile ? "center" : "left"
                        }}>
                            <h2 style={styles.sectionHeading}>Featured Builds</h2>
                            <a href="/projects" style={styles.textLink}>See all developments ↗</a>
                        </div>
                        <div style={{
                            ...styles.projectsGrid,
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
                        }}>
                            {featuredProjects.map((project) => (
                                <div key={project.id} style={styles.projectCard}>
                                    <div>
                                        <span style={styles.projectTechText}>{project.technology}</span>
                                        <h3 style={styles.projectTitleText}>{project.title}</h3>
                                        <p style={styles.projectDescText}>{project.description}</p>
                                    </div>
                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" style={styles.cardLink}>
                                        Analyze Repository Source ↗
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
        backgroundColor: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
    },
    heroSection: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
    },
    heroContainer: {
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
    },
    badgeText: {
        alignSelf: "flex-start",
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#34c759",
        backgroundColor: "#e8fdf0",
        padding: "0.4rem 1rem",
        borderRadius: "20px",
        margin: "0 auto 0 0"
    },
    mainTitle: {
        fontWeight: "800",
        color: "#1d1d1f",
        lineHeight: "1.1",
        margin: 0
    },
    bioText: {
        color: "#515154",
        lineHeight: "1.6",
        margin: 0
    },
    ctaGroup: {
        display: "flex",
        gap: "1rem",
        marginTop: "1rem"
    },
    primaryBtn: {
        backgroundColor: "#1d1d1f",
        color: "#ffffff",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center",
        transition: "background-color 0.2s ease"
    },
    resumeBtn: {
        color: "#ffffff",
        border: "none",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center",
        transition: "all 0.2s ease"
    },
    secondaryBtn: {
        backgroundColor: "#ffffff",
        color: "#1d1d1f",
        border: "1px solid #d2d2d7",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "center",
        transition: "all 0.2s ease"
    },
    skillsSection: {
        width: "100%",
        boxSizing: "border-box"
    },
    sectionHeading: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 2rem 0"
    },
    skillsGrid: {
        display: "grid",
        gap: "2rem"
    },
    skillCard: {
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(0, 0, 0, 0.02)"
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
        fontSize: "0.95rem",
        color: "#86868b",
        lineHeight: "1.5",
        margin: 0
    },
    featuredSection: {
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
    },
    sectionHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
    },
    textLink: {
        color: "#0066cc",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "1rem"
    },
    projectsGrid: {
        display: "grid",
        gap: "2rem"
    },
    projectCard: {
        backgroundColor: "#f5f5f7",
        padding: "2rem",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2rem"
    },
    projectTechText: {
        fontSize: "0.8rem",
        fontWeight: "700",
        color: "#0066cc",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    projectTitleText: {
        fontSize: "1.4rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0.5rem 0"
    },
    projectDescText: {
        fontSize: "1rem",
        color: "#515154",
        lineHeight: "1.5",
        margin: 0
    },
    cardLink: {
        color: "#1d1d1f",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem"
    }
};

export default Home;