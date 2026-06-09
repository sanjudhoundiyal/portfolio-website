import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function Home() {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    // State to track if the resume has been downloaded
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const data = await getProjects();
                setFeaturedProjects(data.slice(0, 2));
            } catch (error) {
                console.error("Error loading featured projects:", error);
            }
        };
        loadFeatured();
    }, []);

    // Function to handle secure download pipeline and auto-hide button
    const handleDownloadResume = async (e) => {
        e.preventDefault();
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch("http://localhost:8080/api/resume/download");
            
            if (!response.ok) {
                throw new Error("Download pipeline rejected by Spring Boot backend.");
            }

            // Convert data stream to a blob
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // Temporary virtual link generation for forced system download
            const virtualLink = document.createElement("a");
            virtualLink.href = downloadUrl;
            virtualLink.setAttribute("download", "Sanjay_Resume.pdf"); // Default dynamic filename
            document.body.appendChild(virtualLink);
            virtualLink.click();
            
            // Clean up virtual link from DOM structure
            virtualLink.remove();
            window.URL.revokeObjectURL(downloadUrl);

            // SUCCESS: Change state to hide the button permanently for this session
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
            <section style={styles.heroSection}>
                <div style={styles.heroContainer}>
                    <span style={styles.badgeText}>Available for Opportunities</span>
                    <h1 style={styles.mainTitle}>
                        Hi, I am Sanjay<span style={{ color: "#0066cc" }}>.</span>
                    </h1>
                    <p style={styles.bioText}>
                        A passionate software engineer focused on building robust backend systems, distributed architectures, and clean, high-performance web applications. I turn complex database problems into elegant, scalable digital experiences.
                    </p>
                    <div style={styles.ctaGroup}>
                        <a href="/projects" style={styles.primaryBtn}>Explore My Work</a>
                        
                        {/* CONDITIONAL RENDERING: Button will disappear completely if isDownloaded is true */}
                        {!isDownloaded && (
                            <button 
                                onClick={handleDownloadResume} 
                                disabled={isDownloading}
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
            <section style={styles.skillsSection}>
                <div style={styles.container}>
                    <h2 style={styles.sectionHeading}>Core Competencies</h2>
                    <div style={styles.skillsGrid}>
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
                <section style={styles.featuredSection}>
                    <div style={styles.container}>
                        <div style={styles.sectionHeaderRow}>
                            <h2 style={styles.sectionHeading}>Featured Builds</h2>
                            <a href="/projects" style={styles.textLink}>See all developments ↗</a>
                        </div>
                        <div style={styles.projectsGrid}>
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
        padding: "0 2rem",
        boxSizing: "border-box",
    },
    heroSection: {
        width: "100%",
        padding: "8rem 2rem 6rem 2rem",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    heroContainer: {
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    badgeText: {
        fontSize: "0.85rem",
        fontWeight: "700",
        color: "#0066cc",
        backgroundColor: "#e8f2ff",
        padding: "0.4rem 1rem",
        borderRadius: "20px",
        marginBottom: "1.5rem",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
    },
    mainTitle: {
        fontSize: "4rem",
        fontWeight: "800",
        color: "#1d1d1f",
        margin: "0 0 1.5rem 0",
        letterSpacing: "-1.5px",
        lineHeight: "1.1",
    },
    bioText: {
        fontSize: "1.25rem",
        color: "#86868b",
        lineHeight: "1.6",
        margin: "0 0 2.5rem 0",
        fontWeight: "400",
    },
    ctaGroup: {
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
    },
    primaryBtn: {
        backgroundColor: "#1d1d1f",
        color: "#ffffff",
        textDecoration: "none",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        fontSize: "1rem",
        fontWeight: "600",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
    },
    resumeBtn: {
        color: "#ffffff",
        border: "none",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        fontSize: "1rem",
        fontWeight: "600",
        boxShadow: "0 4px 15px rgba(0, 102, 204, 0.2)",
        transition: "all 0.2s ease",
        fontFamily: "inherit"
    },
    secondaryBtn: {
        backgroundColor: "transparent",
        color: "#0066cc",
        textDecoration: "none",
        padding: "0.9rem 2rem",
        borderRadius: "30px",
        fontSize: "1rem",
        fontWeight: "600",
        border: "1px solid #0066cc",
        transition: "all 0.2s ease",
    },
    skillsSection: {
        padding: "6rem 0",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e5ea",
        borderBottom: "1px solid #e5e5ea",
    },
    sectionHeading: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 3rem 0",
        letterSpacing: "-0.5px",
    },
    skillsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2.5rem",
    },
    skillCard: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    skillIcon: {
        fontSize: "2rem",
        marginBottom: "0.5rem",
    },
    skillTitle: {
        fontSize: "1.35rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: 0,
    },
    skillDesc: {
        fontSize: "1rem",
        color: "#86868b",
        lineHeight: "1.55",
        margin: 0,
    },
    featuredSection: {
        padding: "6rem 0",
    },
    sectionHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "3rem",
        flexWrap: "wrap",
        gap: "1rem",
    },
    textLink: {
        color: "#0066cc",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "1rem",
    },
    projectsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "2rem",
    },
    projectCard: {
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.03)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2rem",
    },
    projectTechText: {
        fontSize: "0.8rem",
        fontWeight: "700",
        color: "#86868b",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        display: "block",
        marginBottom: "0.5rem",
    },
    projectTitleText: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 1rem 0",
    },
    projectDescText: {
        fontSize: "1rem",
        color: "#515154",
        lineHeight: "1.5",
        margin: 0,
    },
    cardLink: {
        color: "#0066cc",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.95rem",
        alignSelf: "flex-start",
    },
};

export default Home;