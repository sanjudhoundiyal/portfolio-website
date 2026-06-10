import { useState, useEffect } from "react";

function About() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const skills = [
        "Java", "Spring Boot", "React", "JavaScript", 
        "Python", "C++", "C", "HTML / CSS", 
        "SQL", "Git & GitHub", "RESTful APIs"
    ];

    const educationTimeline = [
        {
            degree: "Bachelor of Computer Applications (BCA)",
            institution: "Indira Gandhi National Open University (IGNOU)",
            duration: "Completed",
            description: "Established fundamental principles in data structures, object-oriented programming methodologies, and core web technologies."
        }
    ];

    const strengths = [
        "Punctual", "Hardworking", "Self-Motivated", "Quick Learner", 
        "Team Player", "Responsible", "Disciplined", "Goal-Oriented", 
        "Positive Attitude", "Time Management", "Attention to Detail", 
        "Continuous Learner", "Technology Enthusiast", "Music Lover", "Cricket Enthusiast"
    ];

    return (
        <section style={{
            ...styles.aboutWrapper,
            padding: isMobile ? "3rem 1rem" : "5rem 2rem"
        }}>
            <div style={styles.container}>
                
                {/* Top Section: Profile Branding & Intro */}
                <div style={{
                    ...styles.heroSection,
                    flexDirection: isMobile ? "column" : "row",
                    textAlign: isMobile ? "center" : "left"
                }}>
                    <div style={styles.avatarPlaceholder}>SD</div>
                    <div style={styles.heroTextContent}>
                        <h1 style={{ ...styles.heading, fontSize: isMobile ? "2.2rem" : "2.8rem" }}>Sanjay Dhoundiyal</h1>
                        <p style={styles.titleTag}>Software Developer</p>
                        <p style={styles.bioText}>
                            I am a Software Developer with a strong foundation in Java, Spring Boot, React.js, and Database Management. I enjoy building scalable web applications and solving real-world problems through technology.
                        </p>
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* Bottom Section: Split Content Area */}
                <div style={{
                    ...styles.detailsGrid,
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "3rem" : "5rem"
                }}>
                    
                    {/* Left Column: Technical Skill Grid Matrix */}
                    <div>
                        <h2 style={styles.sectionTitle}>Technologies & Tools</h2>
                        <p style={styles.sectionSubtitle}>A comprehensive list of core engineering languages, system frameworks, and version controls I utilize daily.</p>
                        <div style={styles.skillsContainer}>
                            {skills.map((skill, index) => (
                                <div key={index} style={styles.skillBadge}>
                                    <span style={styles.skillDot}></span>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Structured Educational Timeline & Personal Strengths */}
                    <div style={styles.rightColumnContainer}>
                        <div>
                            <h2 style={styles.sectionTitle}>Educational Background</h2>
                            <p style={styles.sectionSubtitle}>My structured computer science background and academic credentials.</p>
                            <div style={styles.timeline}>
                                {educationTimeline.map((edu, index) => (
                                    <div key={index} style={styles.timelineItem}>
                                        <div style={styles.timelineNode}></div>
                                        <div style={styles.timelineContent}>
                                            <div style={styles.timelineHeaderRow}>
                                                <h3 style={styles.degreeText}>{edu.degree}</h3>
                                                <span style={styles.durationBadge}>{edu.duration}</span>
                                            </div>
                                            <h4 style={styles.institutionText}>{edu.institution}</h4>
                                            <p style={styles.eduDescription}>{edu.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Appended Personal Strengths Sub-section */}
                        <div style={styles.strengthsSection}>
                            <h2 style={styles.sectionTitle}>Personal Strengths</h2>
                            <p style={styles.sectionSubtitle}>Core traits and values that shape my professional work ethic and daily life.</p>
                            <div style={styles.skillsContainer}>
                                {strengths.map((strength, index) => (
                                    <div key={index} style={styles.strengthBadge}>
                                        <span style={styles.strengthDot}></span>
                                        {strength}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

const styles = {
    aboutWrapper: {
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#ffffff", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    container: {
        width: "100%",
        maxWidth: "1100px",
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
    },
    heroSection: {
        display: "flex",
        alignItems: "center",
        gap: "2.5rem",
    },
    avatarPlaceholder: {
        width: "120px",
        height: "120px",
        backgroundColor: "#1d1d1f",
        color: "#ffffff",
        fontSize: "2.5rem",
        fontWeight: "700",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "1px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        flexShrink: 0,
    },
    heroTextContent: {
        flex: "1",
    },
    heading: {
        fontWeight: "800",
        color: "#1d1d1f",
        margin: "0 0 0.25rem 0",
        letterSpacing: "-0.5px",
    },
    titleTag: {
        fontSize: "1.1rem",
        fontWeight: "600",
        color: "#0066cc", 
        margin: "0 0 1.25rem 0",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    bioText: {
        fontSize: "1.15rem",
        color: "#515154",
        lineHeight: "1.65",
        margin: 0,
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e5e5ea",
        margin: 0,
    },
    detailsGrid: {
        display: "grid",
    },
    rightColumnContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "3.5rem",
    },
    sectionTitle: {
        fontSize: "1.6rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 0.5rem 0",
    },
    sectionSubtitle: {
        fontSize: "0.95rem",
        color: "#86868b",
        lineHeight: "1.5",
        margin: "0 0 2rem 0",
    },
    skillsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.85rem",
    },
    skillBadge: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        backgroundColor: "#f5f5f7",
        padding: "0.75rem 1.25rem",
        borderRadius: "12px",
        fontSize: "0.95rem",
        fontWeight: "500",
        color: "#1d1d1f",
        border: "1px solid rgba(0, 0, 0, 0.02)",
    },
    skillDot: {
        width: "6px",
        height: "6px",
        backgroundColor: "#0066cc",
        borderRadius: "50%",
    },
    strengthsSection: {
        display: "flex",
        flexDirection: "column",
    },
    strengthBadge: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        backgroundColor: "#f5f5f7",
        padding: "0.75rem 1.25rem",
        borderRadius: "12px",
        fontSize: "0.95rem",
        fontWeight: "500",
        color: "#1d1d1f",
        border: "1px solid rgba(0, 0, 0, 0.02)",
    },
    strengthDot: {
        width: "6px",
        height: "6px",
        backgroundColor: "#34c759", 
        borderRadius: "50%",
    },
    timeline: {
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        borderLeft: "2px solid #e5e5ea",
        paddingLeft: "1.5rem",
        marginLeft: "0.5rem",
    },
    timelineItem: {
        position: "relative",
    },
    timelineNode: {
        position: "absolute",
        left: "calc(-1.5rem - 6px)",
        top: "6px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#1d1d1f",
        border: "2px solid #ffffff",
    },
    timelineContent: {
        display: "flex",
        flexDirection: "column",
    },
    timelineHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "0.5rem",
        margin: "0 0 0.5rem 0",
    },
    degreeText: {
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: 0,
        flex: "1",
        minWidth: "200px"
    },
    durationBadge: {
        fontSize: "0.8rem",
        fontWeight: "600",
        color: "#0066cc",
        backgroundColor: "#e8f2ff",
        padding: "0.2rem 0.6rem",
        borderRadius: "6px",
        textTransform: "uppercase",
    },
    institutionText: {
        fontSize: "0.95rem",
        fontWeight: "600",
        color: "#515154",
        margin: "0 0 0.75rem 0",
    },
    eduDescription: {
        fontSize: "0.95rem",
        color: "#86868b",
        lineHeight: "1.5",
        margin: 0,
    }
};

export default About;