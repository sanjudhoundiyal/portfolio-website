import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    return (
        <section style={styles.projectsSection}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Development Projects<span style={{ color: "#4f46e5" }}>.</span>
                    </h1>
                    <p style={styles.subtitle}>
                        A selection of applications showcasing problem-solving, system design, and software engineering skills.
                    </p>
                </div>

                <div style={styles.grid}>
                    {projects.map((project) => (
                        <div key={project.id} style={styles.card}>
                            <div style={styles.cardContent}>
                                <div style={styles.techBadgeContainer}>
                                    {project.technology.split(",").map((tech, idx) => (
                                        <span key={idx} style={styles.techBadge}>
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                                <h3 style={styles.projectTitle}>{project.title}</h3>
                                <p style={styles.projectDescription}>{project.description}</p>
                            </div>
                            <div style={styles.cardFooter}>
                                <a 
                                    href={project.githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={styles.githubLink}
                                >
                                    View Source Code <span style={styles.arrow}>→</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const styles = {
    projectsSection: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f5f5f7",
        padding: "5rem 2rem",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        marginBottom: "4rem",
        textAlign: "left",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "800",
        color: "#1d1d1f",
        margin: "0 0 0.5rem 0",
        letterSpacing: "-0.5px",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#86868b",
        margin: 0,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "2rem",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Fixed: 'between' changed to 'space-between'
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(0, 0, 0, 0.03)",
        transition: "transform 0.2s ease, boxShadow 0.2s ease",
        overflow: "hidden",
    },
    cardContent: {
        padding: "2rem",
        flexGrow: 1,
    },
    techBadgeContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1.25rem",
    },
    techBadge: {
        backgroundColor: "#f5f5f7",
        color: "#515154",
        fontSize: "0.75rem",
        fontWeight: "600",
        padding: "0.35rem 0.75rem",
        borderRadius: "20px",
        letterSpacing: "0.2px",
    },
    projectTitle: {
        fontSize: "1.35rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 0.75rem 0",
    },
    projectDescription: {
        fontSize: "0.95rem",
        color: "#86868b",
        lineHeight: "1.5",
        margin: 0,
    },
    cardFooter: {
        padding: "0 2rem 2rem 2rem",
        backgroundColor: "#ffffff",
    },
    githubLink: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#4f46e5",
        textDecoration: "none",
        transition: "color 0.2s ease",
    },
    arrow: {
        marginLeft: "0.35rem",
        transition: "transform 0.2s ease",
    }
};

export default Projects;