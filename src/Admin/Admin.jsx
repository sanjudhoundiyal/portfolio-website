import { useState, useEffect } from "react";
// Import SweetAlert2
import Swal from "sweetalert2";

function Admin() {
    // --- AUTHENTICATION STATES ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authMode, setAuthMode] = useState("login"); 
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // --- CORE DATABASE ENTITY STATES ---
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    
    // Tab Navigation State
    const [currentTab, setCurrentTab] = useState("overview");

    // Modal Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null); 
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

    // --- API ENDPOINTS CONFIGURATION ---
    const API_AUTH_BASE = "https://portfolio-website-6-w0fn.onrender.com/api/admin"; 
    const API_PROJECTS_URL = "https://portfolio-website-6-w0fn.onrender.com/api/projects";
    const API_CONTACT_URL = "https://portfolio-website-6-w0fn.onrender.com/api/contact";
    const API_RESUME_URL = "https://portfolio-website-6-w0fn.onrender.com/api/resume/upload";

    // --- EFFECT LIFECYCLE ---
    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
            fetchMessages();
        }
    }, [isAuthenticated]);

    // --- BACKEND API LOGIC CONTROLLERS ---

    // FIX: Strict Authentication and Swal Notification Added
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setAuthLoading(true);

        const params = new URLSearchParams();
        params.append("email", authEmail.trim());
        params.append("password", authPassword);

        try {
            const response = await fetch(`${API_AUTH_BASE}/login?${params.toString()}`, {
                method: "POST"
            });
            const textResult = await response.text();

            // Check if request is completely successful and backend string explicitly approves
            if (response.ok && !textResult.toLowerCase().includes("invalid") && !textResult.toLowerCase().includes("fail")) {
                Swal.fire({
                    icon: "success",
                    title: "Access Granted",
                    text: "Authentication clearance granted successfully!",
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsAuthenticated(true); 
            } else {
                // Throws error if another email is entered or database rejects it
                Swal.fire({
                    icon: "error",
                    title: "Authentication Failed",
                    text: textResult || "Invalid administrative credentials processed."
                });
            }
        } catch (error) {
            console.error("Login Request Error:", error);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Authentication server pipeline unreachable."
            });
        } finally {
            setAuthLoading(false);
        }
    };

    // AUTH POST: Handle Forgot Password Flow with Swal
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!authEmail) {
            return Swal.fire({ icon: "warning", title: "Missing Input", text: "Please enter your registered email address." });
        }
        
        setAuthLoading(true);
        const params = new URLSearchParams();
        params.append("email", authEmail.trim());

        try {
            const response = await fetch(`${API_AUTH_BASE}/forgot-password?${params.toString()}`, {
                method: "POST"
            });
            const textResult = await response.text();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Reset Request Sent",
                    text: textResult || "Password reset instructions processed! Check your email."
                });
                setAuthMode("login"); 
            } else {
                Swal.fire({ icon: "error", title: "Rejected", text: textResult || "Forgot password request rejected by server." });
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            Swal.fire({ icon: "error", title: "Server Error", text: "Error communicating with recovery server pipeline." });
        } finally {
            setAuthLoading(false);
        }
    };

    // AUTH LOGOUT: Destroys dashboard context access state
    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to terminate this administrative session?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff453a",
            cancelButtonColor: "#3a3a3c",
            confirmButtonText: "Yes, Logout"
        }).then((result) => {
            if (result.isConfirmed) {
                setIsAuthenticated(false);
                setAuthEmail("");
                setAuthPassword("");
                setProjects([]);
                setMessages([]);
                Swal.fire({ icon: "info", title: "Logged Out", text: "Session destroyed safely.", timer: 1500, showConfirmButton: false });
            }
        });
    };

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

    // POST / PUT: Insert or Update Project Record with Swal Confirmation
    const handleSaveProject = async (e) => {
        e.preventDefault();
        if (!title || !technology || !description) {
            return Swal.fire({ icon: "warning", title: "Validation Error", text: "Required configuration properties missing." });
        }

        setIsLoading(true);
        const projectPayload = { title, technology, githubUrl, liveDemoUrl, imageUrl, description };

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
                setTitle("");
                setTechnology("");
                setGithubUrl("");
                setLiveDemoUrl("");
                setImageUrl("");
                setDescription("");
                setEditingProjectId(null);
                
                Swal.fire({ icon: "success", title: "Saved!", text: `Project successfully handled via ${method}.`, timer: 2000, showConfirmButton: false });
            } else {
                Swal.fire({ icon: "error", title: "Transaction Rejected", text: `Database transaction rejected by Spring Boot pipeline.` });
            }
        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE: Delete Project Record from Database with Swal Confirm Dialog
    const handleDeleteProject = async (id) => {
        Swal.fire({
            title: "Delete Project?",
            text: "Are you sure you want to delete this project record from the database?",
            icon: "danger",
            showCancelButton: true,
            confirmButtonColor: "#ff453a",
            confirmButtonText: "Yes, Delete Record"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_PROJECTS_URL}/${id}`, { method: "DELETE" });
                    if (response.ok) {
                        Swal.fire("Deleted!", "Project deleted successfully.", "success");
                        await fetchProjects(); 
                    } else {
                        Swal.fire("Failed", "Failed to delete project from backend.", "error");
                    }
                } catch (error) {
                    console.error("Delete Network Error:", error);
                }
            }
        });
    };

    // DELETE: Delete Message/Contact Record from Database with Swal Confirm
    const handleDeleteMessage = async (id) => {
        Swal.fire({
            title: "Permanently Delete Message?",
            text: "This action cannot be undone inside the cloud instance.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff453a",
            confirmButtonText: "Yes, Delete It"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_CONTACT_URL}/${id}`, { method: "DELETE" });
                    if (response.ok) {
                        Swal.fire("Erased!", "Message deleted safely.", "success");
                        await fetchMessages(); 
                    } else {
                        Swal.fire("Failed", "Failed to erase database entry.", "error");
                    }
                } catch (error) {
                    console.error("Contact Delete Request Error:", error);
                }
            }
        });
    };

    // POST: Multipart Resume File Upload to Backend
    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            return Swal.fire({ icon: "warning", title: "No File", text: "Please select a resume file first." });
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
                Swal.fire({ icon: "success", title: "Uploaded!", text: "Resume uploaded successfully into database pipeline." });
                setResumeFile(null);
                e.target.reset();
            } else {
                Swal.fire({ icon: "error", title: "Rejected", text: "Resume upload rejected by backend." });
            }
        } catch (error) {
            console.error("Resume Upload Network Error:", error);
            Swal.fire({ icon: "error", title: "Error", text: "Network error occurred while uploading resume." });
        } finally {
            setIsUploadingResume(false);
        }
    };

    // --- CONDITION RENDER: SECURITY GATEWAY AUTHENTICATION SHIELD ---
    if (!isAuthenticated) {
        return (
            <div style={styles.authWrapper}>
                <div style={styles.authCard}>
                    <div style={styles.authLogoSection}>
                        <div style={styles.logoIcon}>⚡</div>
                        <span style={styles.authLogoText}>CorePanel Admin Secure Gateway</span>
                    </div>

                    {authMode === "login" ? (
                        <div>
                            <h2 style={styles.authTitle}>Sign In</h2>
                            <p style={styles.authSubtitle}>Provide verification variables to boot database environment access</p>
                            <form onSubmit={handleLoginSubmit} style={styles.formContainer}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        style={styles.formInput} 
                                        placeholder="root@corepanel.com" 
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <label style={styles.formLabel}>Secure Password Matrix</label>
                                        <span style={styles.forgotLink} onClick={() => setAuthMode("forgot")}>
                                            Forgot Password?
                                        </span>
                                    </div>
                                    <input 
                                        type="password" 
                                        required 
                                        style={styles.formInput} 
                                        placeholder="••••••••" 
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={authLoading} style={{...styles.authSubmitBtn, width: '100%'}}>
                                    {authLoading ? "Verifying Keys..." : "Authorize System Handshake"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 style={styles.authTitle}>Recover Access</h2>
                            <p style={styles.authSubtitle}>Send a secure credential reset trigger link to your system email</p>
                            <form onSubmit={handleForgotSubmit} style={styles.formContainer}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Registered Admin Admin Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        style={styles.formInput} 
                                        placeholder="Enter your administrative email" 
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={authLoading} style={{...styles.authSubmitBtn, width: '100%', backgroundColor: '#e28743'}}>
                                    {authLoading ? "Sending Trigger..." : "Dispatch Recovery Link"}
                                </button>
                            </form>
                            <p style={styles.authToggleText}>
                                Remembered keys?{" "}
                                <span style={styles.authToggleLink} onClick={() => setAuthMode("login")}>
                                    Back to Sign In
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.dashboardWrapper}>
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>⚡</div>
                    <span style={styles.logoText}>CorePanel</span>
                </div>
                <nav style={styles.navMenu}>
                    <button onClick={() => setCurrentTab("overview")} style={{ ...styles.navItem, ...(currentTab === "overview" ? styles.navItemActive : {}) }}>
                        System Overview ({projects.length})
                    </button>
                    <button onClick={() => setCurrentTab("messages")} style={{ ...styles.navItem, ...(currentTab === "messages" ? styles.navItemActive : {}) }}>
                        Messages ({messages.length})
                    </button>
                </nav>
                <div style={styles.sidebarFooter}>
                    <p style={styles.userTag}>S. Dhoundiyal</p>
                    <span style={styles.roleSubtext}>Root Administrator</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Terminate Session</button>
                </div>
            </aside>

            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.pageTitle}>{currentTab === "overview" ? "System Console" : "Messages Inbox"}</h1>
                        <p style={styles.pageSubtitle}>{currentTab === "overview" ? "Live database views tracking portfolio projects." : "Review user inquiries."}</p>
                    </div>
                    {currentTab === "overview" && <button style={styles.primaryButton} onClick={openAddModal}>+ Add DB Project</button>}
                </header>

                {currentTab === "overview" && (
                    <section style={styles.resumeUploadSection}>
                        <h2 style={styles.sectionTitle}>Resume Control Center</h2>
                        <form onSubmit={handleResumeUpload} style={styles.resumeForm}>
                            <input type="file" accept=".pdf,.doc,.docx" style={styles.fileInput} onChange={(e) => setResumeFile(e.target.files[0])} />
                            <button type="submit" disabled={isUploadingResume} style={{ ...styles.primaryButton, backgroundColor: isUploadingResume ? "#a1a1a6" : "#0066cc" }}>
                                {isUploadingResume ? "Uploading..." : "Upload New Resume File"}
                            </button>
                        </form>
                    </section>
                )}

                <div style={styles.detailsGrid}>
                    {currentTab === "overview" ? (
                        <div style={styles.fullWidthColumn}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Database Project Records</h2>
                                <span style={styles.counterBadge}>{projects.length} Online</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {projects.length === 0 ? <p style={styles.emptyText}>No deployed projects pulled from Spring Boot.</p> : projects.map((proj) => (
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
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={styles.fullWidthColumn}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Live Portfolio Contact Inbox</h2>
                                <span style={{ ...styles.counterBadge, backgroundColor: "#e8f2ff", color: "#0066cc" }}>{messages.length} Received</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {messages.length === 0 ? <p style={styles.emptyText}>No contact entries exist.</p> : messages.map((msg) => (
                                    <div key={msg.id} style={styles.messageCard}>
                                        <div style={styles.cardHeader}>
                                            <div>
                                                <h3 style={styles.messageSenderName}>{msg.name}</h3>
                                                <a href={`mailto:${msg.email}`} style={styles.messageEmailLink}>{msg.email}</a>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={styles.monoIdBadge}>ID: {msg.id}</span>
                                                <button onClick={() => handleDeleteMessage(msg.id)} style={styles.deleteButton}>Delete</button>
                                            </div>
                                        </div>
                                        <p style={styles.messageContentText}>"{msg.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h2 style={styles.modalTitle}>{editingProjectId ? "UPDATE Entity Record" : "POST New Entity Record"}</h2>
                            <form onSubmit={handleSaveProject} style={styles.formContainer}>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Project Title</label><input type="text" required style={styles.formInput} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Technologies Matrix</label><input type="text" required style={styles.formInput} value={technology} onChange={(e) => setTechnology(e.target.value)} /></div>
                                <div style={styles.formGroupGrid}>
                                    <div style={styles.formGroup}><label style={styles.formLabel}>GitHub Link</label><input type="url" style={styles.formInput} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} /></div>
                                    <div style={styles.formGroup}><label style={styles.formLabel}>Live Link</label><input type="url" style={styles.formInput} value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} /></div>
                                </div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Image Static URL</label><input type="text" style={styles.formInput} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Description</label><textarea rows={4} required style={{ ...styles.formInput, resize: "none" }} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={styles.editButton}>Cancel</button>
                                    <button type="submit" disabled={isLoading} style={styles.primaryButton}>{isLoading ? "Saving..." : "Commit Entity"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// Fallback style mappings block
const styles = {
    authWrapper: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f7" },
    authCard: { padding: "40px", width: "400px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    authLogoSection: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { fontSize: "24px" },
    authLogoText: { fontWeight: "bold", fontSize: "16px", color: "#1d1d1f" },
    authTitle: { margin: "0 0 8px 0", fontSize: "24px", color: "#1d1d1f" },
    authSubtitle: { margin: "0 0 24px 0", fontSize: "14px", color: "#86868b", lineHeight: "1.4" },
    formContainer: { display: "flex", flexDirection: "column", gap: "16px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    formGroupGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    formLabel: { fontSize: "12px", fontWeight: "6px", color: "#515154" },
    formInput: { padding: "10px", borderRadius: "6px", border: "1px solid #d2d2d7", fontSize: "14px" },
    forgotLink: { fontSize: "12px", color: "#0066cc", cursor: "pointer" },
    authSubmitBtn: { padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#0066cc", color: "#fff", fontWeight: "6px", cursor: "pointer" },
    authToggleText: { textAlign: "center", fontSize: "14px", color: "#515154", marginTop: "20px" },
    authToggleLink: { color: "#0066cc", cursor: "pointer" },
    dashboardWrapper: { display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f7" },
    sidebar: { width: "260px", backgroundColor: "#1d1d1f", color: "#fff", padding: "24px", display: "flex", flexDirection: "column" },
    logoSection: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" },
    logoText: { fontSize: "18px", fontWeight: "bold" },
    navMenu: { display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 },
    navItem: { padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "transparent", color: "#a1a1a6", textAlign: "left", cursor: "pointer", fontSize: "14px" },
    navItemActive: { backgroundColor: "#3a3a3c", color: "#fff", fontWeight: "6px" },
    sidebarFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px" },
    userTag: { margin: 0, fontWeight: "bold", fontSize: "14px" },
    roleSubtext: { fontSize: "11px", color: "#86868b", marginBottom: "12px" },
    logoutBtn: { padding: "8px", borderRadius: "4px", border: "none", backgroundColor: "#ff453a", color: "#fff", cursor: "pointer", fontSize: "12px" },
    mainContent: { flexGrow: 1, padding: "40px", overflowY: "auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
    pageTitle: { margin: 0, fontSize: "28px", color: "#1d1d1f" },
    pageSubtitle: { margin: "4px 0 0 0", fontSize: "14px", color: "#86868b" },
    primaryButton: { padding: "10px 16px", borderRadius: "6px", border: "none", backgroundColor: "#0066cc", color: "#fff", fontWeight: "6px", cursor: "pointer" },
    resumeUploadSection: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    sectionTitle: { margin: "0 0 8px 0", fontSize: "18px", color: "#1d1d1f" },
    resumeForm: { display: "flex", gap: "16px", alignItems: "center", marginTop: "12px" },
    fileInput: { fontSize: "14px" },
    detailsGrid: { display: "flex", flexDirection: "column", gap: "24px" },
    fullWidthColumn: { width: "100%" },
    sectionHeaderRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
    counterBadge: { padding: "4px 8px", borderRadius: "12px", backgroundColor: "#e3e3e8", color: "#515154", fontSize: "12px", fontWeight: "6px" },
    cardListContainer: { display: "flex", flexDirection: "column", gap: "16px" },
    dataCard: { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardMainTitle: { margin: 0, fontSize: "16px", color: "#1d1d1f" },
    monoIdBadge: { fontFamily: "monospace", fontSize: "12px", color: "#86868b" },
    cardSubtitle: { fontSize: "14px", color: "#515154", margin: "8px 0" },
    cardDescText: { fontSize: "14px", color: "#86868b", margin: "0 0 16px 0", lineHeight: "1.4" },
    actionRowContainer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    linksRow: { display: "flex", gap: "12px" },
    metaLink: { fontSize: "14px", color: "#0066cc", textDecoration: "none" },
    crudButtonsRow: { display: "flex", gap: "8px" },
    editButton: { padding: "6px 12px", borderRadius: "4px", border: "1px solid #d2d2d7", backgroundColor: "#fff", cursor: "pointer", fontSize: "12px" },
    deleteButton: { padding: "6px 12px", borderRadius: "4px", border: "none", backgroundColor: "#ff453a", color: "#fff", cursor: "pointer", fontSize: "12px" },
    messageCard: { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    messageSenderName: { margin: 0, fontSize: "16px", color: "#1d1d1f" },
    messageEmailLink: { fontSize: "12px", color: "#0066cc", textDecoration: "none" },
    messageContentText: { fontSize: "14px", color: "#1d1d1f", margin: "12px 0 0 0", fontStyle: "italic" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" },
    modalContent: { backgroundColor: "#fff", padding: "32px", borderRadius: "12px", width: "500px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
    modalTitle: { margin: "0 0 20px 0", fontSize: "20px", color: "#1d1d1f" }
};

export default Admin;