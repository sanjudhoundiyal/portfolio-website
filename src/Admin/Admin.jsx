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

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to terminate this administrative session?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
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

    const handleDeleteProject = async (id) => {
        Swal.fire({
            title: "Delete Project?",
            text: "Are you sure you want to delete this project record from the database?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
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

    const handleDeleteMessage = async (id) => {
        Swal.fire({
            title: "Permanently Delete Message?",
            text: "This action cannot be undone inside the cloud instance.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
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

    // --- CONDITIONAL RENDER: LOGIN/RECOVERY GATEWAY ---
    if (!isAuthenticated) {
        return (
            <div style={styles.authWrapper}>
                <div style={styles.authCard}>
                    <div style={styles.authLogoSection}>
                        <div style={styles.logoIcon}>⚡</div>
                        <span style={styles.authLogoText}>CorePanel Secure Gateway</span>
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
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
                                    {authLoading ? "Verifying Keys..." : "Authorize Handshake"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 style={styles.authTitle}>Recover Access</h2>
                            <p style={styles.authSubtitle}>Send a secure credential reset trigger link to your system email</p>
                            <form onSubmit={handleForgotSubmit} style={styles.formContainer}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Registered Admin Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        style={styles.formInput} 
                                        placeholder="Enter your administrative email" 
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={authLoading} style={{...styles.authSubmitBtn, width: '100%', backgroundColor: '#6366f1'}}>
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

    // --- MAIN DASHBOARD RENDER ---
    return (
        <div style={styles.dashboardWrapper} className="dashboard-root">
            <aside style={styles.sidebar} className="dashboard-sidebar">
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>⚡</div>
                    <span style={styles.logoText}>CorePanel</span>
                </div>
                <nav style={styles.navMenu} className="dashboard-nav">
                    <button onClick={() => setCurrentTab("overview")} style={{ ...styles.navItem, ...(currentTab === "overview" ? styles.navItemActive : {}) }}>
                        System Overview ({projects.length})
                    </button>
                    <button onClick={() => setCurrentTab("messages")} style={{ ...styles.navItem, ...(currentTab === "messages" ? styles.navItemActive : {}) }}>
                        Messages ({messages.length})
                    </button>
                </nav>
                <div style={styles.sidebarFooter} className="sidebar-footer">
                    <p style={styles.userTag}>S. Dhoundiyal</p>
                    <span style={styles.roleSubtext}>Root Administrator</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Terminate Session</button>
                </div>
            </aside>

            <main style={styles.mainContent} className="dashboard-main">
                <header style={styles.header} className="main-header">
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <h1 style={styles.pageTitle}>{currentTab === "overview" ? "System Console" : "Messages Inbox"}</h1>
                        <p style={styles.pageSubtitle}>{currentTab === "overview" ? "Live database views tracking portfolio projects." : "Review user inquiries."}</p>
                    </div>
                    {currentTab === "overview" && <button style={styles.primaryButton} onClick={openAddModal} className="add-btn">+ Add DB Project</button>}
                </header>

                {currentTab === "overview" && (
                    <section style={styles.resumeUploadSection}>
                        <h2 style={styles.sectionTitle}>Resume Control Center</h2>
                        <form onSubmit={handleResumeUpload} style={styles.resumeForm} className="resume-form">
                            <input type="file" accept=".pdf,.doc,.docx" style={styles.fileInput} onChange={(e) => setResumeFile(e.target.files[0])} />
                            <button type="submit" disabled={isUploadingResume} style={{ ...styles.primaryButton, backgroundColor: isUploadingResume ? "#94a3b8" : "#4f46e5" }}>
                                {isUploadingResume ? "Uploading..." : "Upload New File"}
                            </button>
                        </form>
                    </section>
                )}

                <div style={styles.detailsGrid}>
                    {currentTab === "overview" ? (
                        <div style={styles.fullWidthColumn}>
                            <div style={styles.sectionHeaderRow} className="section-header-row">
                                <h2 style={styles.sectionTitle}>Database Project Records</h2>
                                <span style={styles.counterBadge}>{projects.length} Online</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {projects.length === 0 ? <p style={styles.emptyText}>No deployed projects pulled from Spring Boot.</p> : projects.map((proj) => (
                                    <div key={proj.id} style={styles.dataCard} className="data-card">
                                        <div style={styles.cardHeader} className="card-header">
                                            <h3 style={styles.cardMainTitle}>{proj.title}</h3>
                                            <span style={styles.monoIdBadge}>ID: {proj.id}</span>
                                        </div>
                                        <p style={styles.cardSubtitle}><strong>Tech Stack:</strong> {proj.technology}</p>
                                        <p style={styles.cardDescText}>{proj.description}</p>
                                        <div style={styles.actionRowContainer} className="action-row-container">
                                            <div style={styles.linksRow}>
                                                {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={styles.metaLink}>GitHub</a>}
                                                {proj.liveDemoUrl && <a href={proj.liveDemoUrl} target="_blank" rel="noreferrer" style={styles.metaLink}>Live Deploy</a>}
                                            </div>
                                            <div style={styles.crudButtonsRow} className="crud-buttons-row">
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
                            <div style={styles.sectionHeaderRow} className="section-header-row">
                                <h2 style={styles.sectionTitle}>Live Portfolio Contact Inbox</h2>
                                <span style={{ ...styles.counterBadge, backgroundColor: "#e0e7ff", color: "#4338ca" }}>{messages.length} Received</span>
                            </div>
                            <div style={styles.cardListContainer}>
                                {messages.length === 0 ? <p style={styles.emptyText}>No contact entries exist.</p> : messages.map((msg) => (
                                    <div key={msg.id} style={styles.messageCard} className="data-card">
                                        <div style={styles.cardHeader} className="card-header">
                                            <div style={{ flex: 1, minWidth: "150px" }}>
                                                <h3 style={styles.messageSenderName}>{msg.name}</h3>
                                                <a href={`mailto:${msg.email}`} style={styles.messageEmailLink}>{msg.email}</a>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="msg-header-right">
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
                    <div style={styles.modalOverlay} className="modal-overlay">
                        <div style={styles.modalContent} className="modal-content">
                            <h2 style={styles.modalTitle}>{editingProjectId ? "UPDATE Entity Record" : "POST New Entity Record"}</h2>
                            <form onSubmit={handleSaveProject} style={styles.formContainer}>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Project Title</label><input type="text" required style={styles.formInput} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Technologies Matrix</label><input type="text" required style={styles.formInput} value={technology} onChange={(e) => setTechnology(e.target.value)} /></div>
                                <div style={styles.formGroupGrid} className="form-group-grid">
                                    <div style={styles.formGroup}><label style={styles.formLabel}>GitHub Link</label><input type="url" style={styles.formInput} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} /></div>
                                    <div style={styles.formGroup}><label style={styles.formLabel}>Live Link</label><input type="url" style={styles.formInput} value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} /></div>
                                </div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Image Static URL</label><input type="text" style={styles.formInput} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
                                <div style={styles.formGroup}><label style={styles.formLabel}>Description</label><textarea rows={4} required style={{ ...styles.formInput, resize: "none" }} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px", flexWrap: "wrap" }} className="modal-actions">
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={styles.editButton} className="modal-cancel">Cancel</button>
                                    <button type="submit" disabled={isLoading} style={styles.primaryButton} className="modal-submit">{isLoading ? "Saving..." : "Commit Entity"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            
            {/* UPDATED: Fully Optimized Mobile Phone Screen Responsive Layout Rules & Global Focus Injections */}
            <style dangerouslySetInnerHTML={{__html: `
                .formContainer input:focus, .formContainer textarea:focus {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
                }
                .formContainer input:hover, .formContainer textarea:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .dashboard-main .formContainer input:hover {
                    border-color: #cbd5e1 !important;
                }
                .dashboard-main .formContainer input:focus {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
                    color: #0f172a !important;
                }

                @media (max-width: 768px) {
                    /* Layout Reset */
                    .dashboard-root { flex-direction: column !important; min-height: 100vh !important; }
                    
                    /* Top Bar Navigation Architecture for Mobile */
                    .dashboard-sidebar { 
                        width: 100% !important; 
                        padding: 16px !important; 
                        position: sticky !important; 
                        top: 0 !important; 
                        z-index: 100 !important;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    }
                    .dashboard-sidebar > div:first-child { margin-bottom: 16px !important; justify-content: center !important; }
                    .dashboard-nav { flex-direction: row !important; gap: 8px !important; overflow-x: auto !important; padding-bottom: 4px !important; scrollbar-width: none !important; }
                    .dashboard-nav::-webkit-scrollbar { display: none !important; }
                    .dashboard-nav button { padding: 8px 14px !important; font-size: 13px !important; flex: 1 !important; text-align: center !important; white-space: nowrap !important; }
                    .sidebar-footer { display: none !important; } 

                    /* Main Workspace Adjustment */
                    .dashboard-main { padding: 20px 16px !important; }
                    .main-header { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; margin-bottom: 24px !important; }
                    .add-btn { width: 100% !important; text-align: center !important; padding: 12px !important; display: block !important; }

                    /* Control Panel Blocks */
                    .resume-form { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
                    .resume-form input { width: 100% !important; margin: 0 !important; }

                    /* Data Table Card Elements */
                    .section-header-row { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; }
                    .card-header { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 8px !important; }
                    .msg-header-right { flex-direction: row !important; align-items: center !important; }
                    .action-row-container { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; border-top: 1px solid #eee !important; padding-top: 12px !important; }
                    .crud-buttons-row { justify-content: flex-end !important; gap: 10px !important; width: 100% !important; }
                    .crud-buttons-row button { flex: 1 !important; text-align: center !important; padding: 10px !important; }

                    /* Grid Components Reset */
                    .form-group-grid { grid-template-columns: 1fr !important; gap: 12px !important; }

                    /* Centered Adaptive Dialog Modal System */
                    .modal-overlay { padding: 12px !important; align-items: center !important; }
                    .modal-content { 
                        width: 100% !important; 
                        margin: 0 !important; 
                        padding: 24px !important;
                        max-height: 90vh !important; 
                        overflow-y: auto !important; 
                        border-radius: 16px !important;
                        box-sizing: border-box !important;
                    }
                    .modal-actions { width: 100% !important; }
                    .modal-cancel, .modal-submit { flex: 1 !important; text-align: center !important; }
                }
            `}} />
        </div>
    );
}

// --- UPDATED DESIGNED CONST STYLES MATRIX ---
const styles = {
    // Auth (Login / Recovery) Container Base
    authWrapper: { 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        backgroundColor: "#0f172a", 
        backgroundImage: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent)",
        padding: "24px", 
        boxSizing: "border-box", 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    },
    authCard: { 
        padding: "40px", 
        width: "100%", 
        maxWidth: "440px", 
        backgroundColor: "rgba(30, 41, 59, 0.7)", 
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px", 
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)", 
        boxSizing: "border-box" 
    },
    authLogoSection: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" },
    logoIcon: { fontSize: "20px", background: "linear-gradient(135deg, #6366f1, #a855f7)", padding: "6px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
    authLogoText: { fontWeight: "700", fontSize: "15px", color: "#f8fafc", letterSpacing: "-0.3px" },
    authTitle: { margin: "0 0 10px 0", fontSize: "28px", color: "#f8fafc", fontWeight: "800", letterSpacing: "-0.8px" },
    authSubtitle: { margin: "0 0 28px 0", fontSize: "14px", color: "#94a3b8", lineHeight: "1.5" },
    
    // Core Forms
    formContainer: { display: "flex", flexDirection: "column", gap: "20px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    formGroupGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    formLabel: { fontSize: "13px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.2px" },
    formInput: { 
        padding: "12px 16px", 
        fontSize: "14px", 
        color: "#f8fafc", 
        backgroundColor: "#0f172a", 
        border: "1px solid rgba(255, 255, 255, 0.1)", 
        borderRadius: "10px", 
        outline: "none",
        transition: "all 0.2s ease",
        boxSizing: "border-box"
    },
    
    // Interaction triggers
    forgotLink: { fontSize: "13px", color: "#6366f1", cursor: "pointer", fontWeight: "500", transition: "color 0.2s" },
    authSubmitBtn: { 
        padding: "14px", 
        fontSize: "14px", 
        fontWeight: "600", 
        color: "#ffffff", 
        backgroundColor: "#4f46e5", 
        border: "none", 
        borderRadius: "10px", 
        cursor: "pointer", 
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
    },
    authToggleText: { marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#94a3b8", margin: "24px 0 0 0" },
    authToggleLink: { color: "#6366f1", cursor: "pointer", fontWeight: "600", textDecoration: "none" },

    // Dashboard Structure
    dashboardWrapper: { 
        display: "flex", 
        minHeight: "100vh", 
        backgroundColor: "#f8fafc", 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
    },
    sidebar: { 
        width: "280px", 
        backgroundColor: "#0f172a", 
        padding: "32px 24px", 
        display: "flex", 
        flexDirection: "column", 
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)"
    },
    logoSection: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" },
    logoText: { fontWeight: "800", fontSize: "20px", color: "#f8fafc", letterSpacing: "-0.5px" },
    navMenu: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
    navItem: { 
        padding: "14px 18px", 
        fontSize: "14px", 
        fontWeight: "600", 
        color: "#94a3b8", 
        backgroundColor: "transparent", 
        border: "none", 
        borderRadius: "10px", 
        cursor: "pointer", 
        textAlign: "left", 
        transition: "all 0.2s ease" 
    },
    navItemActive: { 
        color: "#ffffff", 
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "inset 4px 0 0 #6366f1"
    },
    sidebarFooter: { marginTop: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px" },
    userTag: { margin: "0 0 4px 0", fontWeight: "700", fontSize: "15px", color: "#f8fafc" },
    roleSubtext: { fontSize: "12px", color: "#64748b", display: "block", marginBottom: "16px", fontWeight: "500" },
    logoutBtn: { 
        width: "100%", 
        padding: "10px", 
        fontSize: "13px", 
        fontWeight: "600", 
        color: "#ef4444", 
        backgroundColor: "rgba(239, 68, 68, 0.1)", 
        border: "none", 
        borderRadius: "8px", 
        cursor: "pointer", 
        transition: "all 0.2s" 
    },

    // Main Workspace Layout
    mainContent: { flex: 1, padding: "40px 48px", boxSizing: "border-box", overflowY: "auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginBottom: "36px", flexWrap: "wrap" },
    pageTitle: { margin: "0 0 6px 0", fontSize: "32px", color: "#0f172a", fontWeight: "800", letterSpacing: "-1px" },
    pageSubtitle: { margin: "0", fontSize: "15px", color: "#64748b", fontWeight: "400" },
    primaryButton: { 
        padding: "12px 22px", 
        fontSize: "14px", 
        fontWeight: "600", 
        color: "#ffffff", 
        backgroundColor: "#4f46e5", 
        border: "none", 
        borderRadius: "10px", 
        cursor: "pointer", 
        transition: "all 0.2s", 
        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)" 
    },

    // Section configurations
    resumeUploadSection: { backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0", marginBottom: "36px" },
    sectionTitle: { margin: "0 0 16px 0", fontSize: "18px", color: "#0f172a", fontWeight: "700", letterSpacing: "-0.3px" },
    resumeForm: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
    fileInput: { fontSize: "14px", color: "#64748b" },

    detailsGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "32px" },
    fullWidthColumn: { display: "flex", flexDirection: "column", gap: "20px" },
    sectionHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
    counterBadge: { padding: "6px 12px", fontSize: "12px", fontWeight: "700", borderRadius: "20px", backgroundColor: "#e0e7ff", color: "#4338ca" },
    
    // Content Dynamic Lists
    cardListContainer: { display: "flex", flexDirection: "column", gap: "20px" },
    dataCard: { 
        backgroundColor: "#ffffff", 
        padding: "28px", 
        borderRadius: "16px", 
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)", 
        border: "1px solid #e2e8f0", 
        transition: "transform 0.2s, box-shadow 0.2s" 
    },
    messageCard: { backgroundColor: "#ffffff", padding: "28px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)", border: "1px solid #e2e8f0" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px", flexWrap: "wrap" },
    cardMainTitle: { margin: "0", fontSize: "20px", color: "#0f172a", fontWeight: "700", letterSpacing: "-0.4px" },
    monoIdBadge: { fontFamily: "monospace", padding: "4px 8px", fontSize: "12px", color: "#64748b", backgroundColor: "#f1f5f9", borderRadius: "6px" },
    cardSubtitle: { margin: "0 0 12px 0", fontSize: "14px", color: "#475569" },
    cardDescText: { margin: "0 0 24px 0", fontSize: "15px", color: "#64748b", lineHeight: "1.6" },
    
    // Internal buttons layouts
    actionRowContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
    linksRow: { display: "flex", gap: "16px" },
    metaLink: { fontSize: "14px", fontWeight: "600", color: "#4f46e5", textDecoration: "none" },
    crudButtonsRow: { display: "flex", gap: "12px" },
    editButton: { padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", backgroundColor: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" },
    deleteButton: { padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#ef4444", backgroundColor: "#fef2f2", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" },
    
    // Messaging styles
    messageSenderName: { margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" },
    messageEmailLink: { fontSize: "14px", color: "#4f46e5", textDecoration: "none" },
    messageContentText: { margin: "20px 0 0 0", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "10px", fontSize: "14px", color: "#334155", fontStyle: "italic", lineHeight: "1.6" },

    // Centered Dialog Architecture
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
    modalContent: { backgroundColor: "#ffffff", padding: "36px", borderRadius: "20px", width: "100%", maxWidth: "560px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", boxSizing: "border-box" },
    modalTitle: { margin: "0 0 24px 0", fontSize: "22px", color: "#0f172a", fontWeight: "800", letterSpacing: "-0.5px" },
    emptyText: { margin: "0", color: "#94a3b8", textAlign: "center", padding: "40px 20px", fontSize: "15px" }
};

export default Admin;