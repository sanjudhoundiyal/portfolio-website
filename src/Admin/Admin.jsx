import { useState, useEffect } from "react";

function Admin() {
    // Core Database Entity States
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    
    // Tab Navigation State ("overview" or "messages")
    const [currentTab, setCurrentTab] = useState("overview");

    // Modal Form States (Matching Spring Boot Project Entity Schema)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null); // Track if we are editing (null means creating)
    const [title, setTitle] = useState("");
    const [technology, setTechnology] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [liveDemoUrl, setLiveDemoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Resume Upload State
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    const API_PROJECTS_URL = "https://portfolio-website-6-w0fn.onrender.com/api/projects";
    const API_CONTACT_URL = "https://portfolio-website-6-w0fn.onrender.com/api/contact";
    const API_RESUME_URL = "https://portfolio-website-6-w0fn.onrender.com/api/resume/upload";

    // GET: Fetch Projects Matrix from Database
    const fetchProjects = async () => {
        try {
            const response = await fetch(API_PROJECTS_URL);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Projects Fetch Error:", error);
        }
    };

    // GET: Fetch Contact Submissions from Database
    const fetchMessages = async () => {
        try {
            const response = await fetch(API_CONTACT_URL);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Contacts Fetch Error:", error);
        }
    };

    // Lifecycle Synchronizer Loop
    useEffect(() => {
        fetchProjects();
        fetchMessages();
    }, []);

    // Open Modal for Creating New Project
    const openAddModal = () => {
        setEditingProjectId(null);
        setTitle("");
        setTechnology("");
        setGithubUrl("");
        setLiveDemoUrl("");
        setImageUrl("");
        setDescription("");
        setIsModalOpen(true);
    };

    // Open Modal for Editing Existing Project
    const openEditModal = (project) => {
        setEditingProjectId(project.id);
        setTitle(project.title);
        setTechnology(project.technology);
        setGithubUrl(project.githubUrl || "");
        setLiveDemoUrl(project.liveDemoUrl || "");
        setImageUrl(project.imageUrl || "");
        setDescription(project.description);
        setIsModalOpen(true);
    };

    // POST / PUT: Insert or Update Project Record in Backend Database
    const handleSaveProject = async (e) => {
        e.preventDefault();
        if (!title || !technology || !description) {
            return alert("Required configuration properties missing.");
        }

        setIsLoading(true);
        const projectPayload = { title, technology, githubUrl, liveDemoUrl, imageUrl, description };

        // If editingProjectId is present, use PUT URL with id, else use base POST URL
        const url = editingProjectId ? `${API_PROJECTS_URL}/${editingProjectId}` : API_PROJECTS_URL;
        const method = editingProjectId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectPayload),
            });

            if (response.ok) {
                await fetchProjects();
                setIsModalOpen(false);
                // Reset form fields
                setTitle("");
                setTechnology("");
                setGithubUrl("");
                setLiveDemoUrl("");
                setImageUrl("");
                setDescription("");
                setEditingProjectId(null);
            } else {
                alert(`Database transaction rejected by Spring Boot pipeline during ${method}.`);
            }
        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE: Delete Project Record from Backend Database
    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project record from the database?")) {
            return;
        }

        try {
            const response = await fetch(`${API_PROJECTS_URL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Project Deleted Successfully");
                await fetchProjects(); // Refresh UI list
            } else {
                alert("Failed to delete project from Spring Boot backend.");
            }
        } catch (error) {
            console.error("Delete Network Error:", error);
        }
    };

    // POST: Multipart Resume File Upload to Backend
    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            return alert("Please select a resume file first.");
        }

        setIsUploadingResume(true);
        const formData = new FormData();
        formData.append("file", resumeFile);

        try {
            const response = await fetch(API_RESUME_URL, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Resume uploaded successfully into database pipeline!");
                setResumeFile(null);
                e.target.reset();
            } else {
                alert("Resume upload rejected by Spring Boot pipeline.");
            }
        } catch (error) {
            console.error("Resume Upload Network Error:", error);
            alert("Network error occurred while uploading resume.");
        } finally {
            setIsUploadingResume(false);
        }
    };

    return (
        <div style={styles.dashboardWrapper}>
            {/* Left Operational Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>⚡</div>
                    <span style={styles.logoText}>CorePanel</span>
                </div>
                <nav style={styles.navMenu}>
                    <button 
                        onClick={() => setCurrentTab("overview")} 
                        style={{ ...styles.navItem, ...(currentTab === "overview" ? styles.navItemActive : {}) }}
                    >
                        System Overview ({projects.length})
                    </button>
                    <button 
                        onClick={() => setCurrentTab("messages")} 
                        style={{ ...styles.navItem, ...(currentTab === "messages" ? styles.navItemActive : {}) }}
                    >
                        Messages ({messages.length})
                    </button>
                </nav>
                <div style={styles.sidebarFooter}>
                    <p style={styles.userTag}>S. Dhoundiyal</p>
                    <span style={styles.roleSubtext}>Root Administrator</span>
                </div>
            </aside>

            {/* Main Application Window Workspace */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.pageTitle}>
                            {currentTab === "overview" ? "System Console" : "Messages Inbox"}
                        </h1>
                        <p style={styles.pageSubtitle}>
                            {currentTab === "overview" ? "Live database views tracking portfolio projects." : "Review user inquiries from your contact form."}
                        </p>
                    </div>
                    {currentTab === "overview" && (
                        <button style={styles.primaryButton} onClick={openAddModal}>
                            + Add DB Project
                        </button>
                    )}
                </header>

                {/* RESUME UPLOAD UTILITY SECTION (Only visible in System Overview) */}
                {currentTab === "overview" && (
                    <section style={styles.resumeUploadSection}>
                        <h2 style={styles.sectionTitle}>Resume Control Center</h2>
                        <p style={styles.pageSubtitle}>Update your primary portfolio resume document record below.</p>
                        <form onSubmit={handleResumeUpload} style={styles.resumeForm}>
                            <input 
                                type="file" 
                                accept=".pdf,.doc,.docx" 
                                style={styles.fileInput} 
                                onChange={(e) => setResumeFile(e.target.files[0])} 
                            />
                            <button 
                                type="submit" 
                                disabled={isUploadingResume} 
                                style={{
                                    ...styles.primaryButton,
                                    backgroundColor: isUploadingResume ? "#a1a1a6" : "#0066cc",
                                    boxShadow: "none"
                                }}
                            >
                                {isUploadingResume ? "Uploading..." : "Upload New Resume File"}
                            </button>
                        </form>
                    </section>
                )}

                <div style={styles.detailsGrid}>
                    
                    {/* TAB CONDITIONS FOR DYNAMIC DISPLAY */}
                    {currentTab === "overview" ? (
                        /* SHOW ONLY PROJECTS IN OVERVIEW */
                        <div style={styles.fullWidthColumn}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Database Project Records</h2>
                                <span style={styles.counterBadge}>{projects.length} Online</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {projects.length === 0 ? (
                                    <p style={styles.emptyText}>No deployed projects pulled from your Spring Boot database.</p>
                                ) : (
                                    projects.map((proj) => (
                                        <div key={proj.id} style={styles.dataCard}>
                                            <div style={styles.cardHeader}>
                                                <h3 style={styles.cardMainTitle}>{proj.title}</h3>
                                                <span style={styles.monoIdBadge}>ID: {proj.id}</span>
                                            </div>
                                            <p style={styles.cardSubtitle}><strong>Tech Stack:</strong> {proj.technology}</p>
                                            <p style={styles.cardDescText}>{proj.description}</p>
                                            <div style={styles.actionRowContainer}>
                                                <div style={styles.linksRow}>
                                                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={styles.metaLink}>GitHub</a>}
                                                    {proj.liveDemoUrl && <a href={proj.liveDemoUrl} target="_blank" rel="noreferrer" style={styles.metaLink}>Live Deploy</a>}
                                                </div>
                                                <div style={styles.crudButtonsRow}>
                                                    <button onClick={() => openEditModal(proj)} style={styles.editButton}>Edit</button>
                                                    <button onClick={() => handleDeleteProject(proj.id)} style={styles.deleteButton}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* SHOW ONLY MESSAGES IN MESSAGES TAB */
                        <div style={styles.fullWidthColumn}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Live Portfolio Contact Inbox</h2>
                                <span style={{ ...styles.counterBadge, backgroundColor: "#e8f2ff", color: "#0066cc" }}>{messages.length} Received</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {messages.length === 0 ? (
                                    <p style={styles.emptyText}>No contact entries exist in the database record matrix.</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} style={styles.messageCard}>
                                            <div style={styles.cardHeader}>
                                                <div>
                                                    <h3 style={styles.messageSenderName}>{msg.name}</h3>
                                                    <a href={`mailto:${msg.email}`} style={styles.messageEmailLink}>{msg.email}</a>
                                                </div>
                                                <span style={styles.monoIdBadge}>ID: {msg.id}</span>
                                            </div>
                                            <p style={styles.messageContentText}>"{msg.message}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* MODAL SYSTEM OVERLAY PANEL */}
                {isModalOpen && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h2 style={styles.modalTitle}>
                                {editingProjectId ? "UPDATE Entity Record" : "POST New Entity Record"}
                            </h2>
                            <form onSubmit={handleSaveProject} style={styles.formContainer}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Project Title</label>
                                    <input type="text" required style={styles.formInput} placeholder="e.g. Microservices Gateway" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Technologies Matrix</label>
                                    <input type="text" required style={styles.formInput} placeholder="e.g. Java, Spring Boot, MySQL" value={technology} onChange={(e) => setTechnology(e.target.value)} />
                                </div>
                                <div style={styles.formGroupGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>GitHub Repository Link</label>
                                        <input type="url" style={styles.formInput} placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>Live Deployment Link</label>
                                        <input type="url" style={styles.formInput} placeholder="https://..." value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Image Static URL Path</label>
                                    <input type="text" style={styles.formInput} placeholder="https://images.com/preview.png" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Description Context (Max 2000 Chars)</label>
                                    <textarea rows={4} required style={{ ...styles.formInput, resize: "none" }} placeholder="Provide functional specification logs here..." value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div style={styles.modalActionsRow}>
                                    <button type="button" disabled={isLoading} style={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" disabled={isLoading} style={styles.submitButton}>
                                        {isLoading ? "Saving..." : editingProjectId ? "Update Entity Object" : "Commit Entity Object"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// Style Configurations
const styles = {
    dashboardWrapper: { display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    sidebar: { width: "260px", backgroundColor: "#1d1d1f", color: "#ffffff", display: "flex", flexDirection: "column", padding: "2rem 1.5rem", boxSizing: "border-box" },
    logoSection: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" },
    logoIcon: { fontSize: "1.5rem" },
    logoText: { fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.5px" },
    navMenu: { display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 },
    navItem: { background: "none", border: "none", textAlign: "left", color: "#a1a1a6", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", width: "100%", fontFamily: "inherit" },
    navItemActive: { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#ffffff" },
    sidebarFooter: { borderTop: "1px solid #333336", paddingTop: "1.5rem" },
    userTag: { fontSize: "0.95rem", fontWeight: "600", margin: "0 0 0.2rem 0" },
    roleSubtext: { fontSize: "0.8rem", color: "#86868b" },
    mainContent: { flex: 1, padding: "3rem 4rem", boxSizing: "border-box", overflowY: "auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" },
    pageTitle: { fontSize: "2.2rem", fontWeight: "700", color: "#1d1d1f", margin: "0 0 0.4rem 0", letterSpacing: "-0.5px" },
    pageSubtitle: { fontSize: "1rem", color: "#86868b", margin: 0 },
    primaryButton: { backgroundColor: "#0066cc", color: "#ffffff", border: "none", padding: "0.85rem 1.6rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 102, 204, 0.15)" },
    resumeUploadSection: { backgroundColor: "#ffffff", padding: "2rem", borderRadius: "14px", border: "1px solid rgba(0, 0, 0, 0.03)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)", marginBottom: "2.5rem" },
    resumeForm: { display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1.25rem", flexWrap: "wrap" },
    fileInput: { padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e5e5ea", backgroundColor: "#f5f5f7", outline: "none" },
    detailsGrid: { display: "flex", width: "100%" },
    fullWidthColumn: { width: "100%" },
    sectionHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid #e5e5ea", paddingBottom: "0.75rem" },
    sectionTitle: { fontSize: "1.4rem", fontWeight: "700", color: "#1d1d1f", margin: 0 },
    counterBadge: { fontSize: "0.8rem", fontWeight: "700", backgroundColor: "#e5e5ea", color: "#1d1d1f", padding: "0.25rem 0.65rem", borderRadius: "20px" },
    cardListContainer: { display: "flex", flexDirection: "column", gap: "1.25rem" },
    emptyText: { fontSize: "1rem", color: "#86868b", fontStyle: "italic", margin: "1rem 0" },
    dataCard: { backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)", border: "1px solid rgba(0, 0, 0, 0.03)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "1rem" },
    cardMainTitle: { fontSize: "1.15rem", fontWeight: "700", color: "#1d1d1f", margin: 0 },
    monoIdBadge: { fontFamily: "monospace", fontSize: "0.8rem", backgroundColor: "#f5f5f7", color: "#515154", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "600" },
    cardSubtitle: { fontSize: "0.9rem", color: "#515154", margin: "0 0 0.5rem 0" },
    cardDescText: { fontSize: "0.9rem", color: "#86868b", lineHeight: "1.45", margin: "0 0 1rem 0" },
    actionRowContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderTop: "1px solid #f5f5f7", paddingTop: "0.75rem" },
    linksRow: { display: "flex", gap: "1rem" },
    metaLink: { fontSize: "0.85rem", color: "#0066cc", fontWeight: "600", textDecoration: "none" },
    crudButtonsRow: { display: "flex", gap: "0.75rem" },
    editButton: { backgroundColor: "#f5f5f7", border: "none", color: "#0066cc", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" },
    deleteButton: { backgroundColor: "rgba(255, 59, 48, 0.1)", border: "none", color: "#ff3b30", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" },
    messageCard: { backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)", border: "1px solid rgba(0, 0, 0, 0.03)", borderLeft: "4px solid #0066cc" },
    messageSenderName: { fontSize: "1.1rem", fontWeight: "700", color: "#1d1d1f", margin: 0 },
    messageEmailLink: { fontSize: "0.85rem", color: "#0066cc", textDecoration: "none" },
    messageContentText: { fontSize: "0.95rem", color: "#515154", lineHeight: "1.5", backgroundColor: "#f5f5f7", padding: "0.85rem 1rem", borderRadius: "8px", margin: "0.5rem 0 0 0" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "#ffffff", padding: "2.5rem", borderRadius: "16px", width: "100%", maxWidth: "550px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
    modalTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#1d1d1f", margin: "0 0 1.5rem 0" },
    formContainer: { display: "flex", flexDirection: "column", gap: "1.25rem" },
    formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    formGroupGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
    formLabel: { fontSize: "0.9rem", fontWeight: "600", color: "#515154" },
    formInput: { padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #e5e5ea", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" },
    modalActionsRow: { display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" },
    cancelButton: { backgroundColor: "#f5f5f7", border: "none", color: "#1d1d1f", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
    submitButton: { backgroundColor: "#0066cc", border: "none", color: "#ffffff", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default Admin;