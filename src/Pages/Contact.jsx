import { useState } from "react";

function Contact() {
    // 1. Core Form Field Buffers
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    
    // 2. Operational Feedback States
    const [statusType, setStatusType] = useState("IDLE"); // Options: IDLE, PENDING, SUCCESS, ERROR
    const [validationError, setValidationError] = useState(""); // Captures explicit validation breaks

    const API_CONTACT_URL = "http://localhost:8080/api/contact";

    // HTTP POST Form Submission Pipeline handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(""); // Reset local structural errors
        
        // --- REAL VALIDATION MATRIX START ---
        
        // 1. Clean data inputs
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanMessage = message.trim();

        // 2. Base Empty Check
        if (!cleanName || !cleanEmail || !cleanMessage) {
            setValidationError("⚠️ Form processing rejected: All fields are required.");
            return;
        }

        // 3. Name Structural Check (Alphabets and spaces only, min 2 characters)
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        if (!nameRegex.test(cleanName)) {
            setValidationError("⚠️ Invalid Name: Please use letters only (minimum 2 characters).");
            return;
        }

        // 4. Strict Email Regex Validation (RFC 5322 standard check)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(cleanEmail)) {
            setValidationError("⚠️ Invalid Email Layout: Please provide a authentic email address.");
            return;
        }

        // 5. Message Depth Analysis (Minimum 10 characters to prevent spam)
        if (cleanMessage.length < 10) {
            setValidationError("⚠️ Context is too brief: Message must contain at least 10 characters.");
            return;
        }

        // --- REAL VALIDATION MATRIX END ---

        setStatusType("PENDING");

        // Object payload mapped explicitly to your backend's expected JSON properties
        const contactPayload = {
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage
        };

        try {
            const response = await fetch(API_CONTACT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactPayload),
            });

            if (response.ok) {
                setStatusType("SUCCESS");
                // Reset user context input fields
                setName("");
                setEmail("");
                setMessage("");
                setValidationError("");
                
                // Clear the successful notification frame after a short period
                setTimeout(() => setStatusType("IDLE"), 5000);
            } else {
                setStatusType("ERROR");
            }
        } catch (error) {
            console.error("Transmission Gateway Failure:", error);
            setStatusType("ERROR");
        }
    };

    return (
        <section style={styles.contactWrapper}>
            <div style={styles.container}>
                
                {/* Left Side: Contact Information Cards */}
                <div style={styles.infoColumn}>
                    <h1 style={styles.heading}>Have a project in mind? Let's talk.<span style={{ color: "#0066cc" }}>.</span></h1>
                    <p style={styles.subheading}>Have an idea, a project, or just want to connect? Reach out through any of these channels.</p>
                    
                    <div style={styles.cardsGrid}>
                        {/* Phone Card */}
                        <div style={styles.infoCard}>
                            <div style={styles.iconContainer}>📞</div>
                            <div>
                                <h3 style={styles.cardTitle}>Call Directly</h3>
                                <a href="tel:+918193821315" style={styles.cardLink}>+91 81938 21315</a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div style={styles.infoCard}>
                            <div style={styles.iconContainer}>✉️</div>
                            <div>
                                <h3 style={styles.cardTitle}>Email Me</h3>
                                <a href="mailto:sanjudhoundiayalsanju@gmail.com" style={styles.cardLink}>sanjudhoundiayalsanju@gmail.com</a>
                            </div>
                        </div>

                        {/* LinkedIn Card */}
                        <div style={styles.infoCard}>
                            <div style={styles.iconContainer}>💼</div>
                            <div>
                                <h3 style={styles.cardTitle}>LinkedIn</h3>
                                <a href="https://www.linkedin.com/in/sanjay-dhoundiyal-35bb47322/" target="_blank" rel="noopener noreferrer" style={styles.cardLink}>Sanjay Dhoundiyal ↗</a>
                            </div>
                        </div>

                        {/* GitHub Card */}
                        <div style={styles.infoCard}>
                            <div style={styles.iconContainer}>💻</div>
                            <div>
                                <h3 style={styles.cardTitle}>GitHub</h3>
                                <a href="https://github.com/sanjudhoundiyal" target="_blank" rel="noopener noreferrer" style={styles.cardLink}>@sanjudhoundiyal ↗</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Communication Form */}
                <div style={styles.formColumn}>
                    <form onSubmit={handleSubmit} style={styles.contactForm}>
                        <h2 style={styles.formHeading}>Send a Message</h2>
                        
                        {/* Inline Error Tracking Banner */}
                        {validationError && (
                            <div style={styles.validationBanner}>
                                {validationError}
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Name</label>
                            <input 
                                type="text" 
                                required
                                disabled={statusType === "PENDING"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe" 
                                style={styles.inputField}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Email</label>
                            <input 
                                type="email" 
                                required
                                disabled={statusType === "PENDING"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com" 
                                style={styles.inputField}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Message</label>
                            <textarea 
                                rows="5" 
                                required
                                disabled={statusType === "PENDING"}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell me about your project context (min. 10 characters)..." 
                                style={{ ...styles.inputField, resize: "none" }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={statusType === "PENDING"} 
                            style={{
                                ...styles.submitButton, 
                                backgroundColor: statusType === "PENDING" ? "#86868b" : "#1d1d1f",
                                cursor: statusType === "PENDING" ? "not-allowed" : "pointer"
                            }}
                        >
                            {statusType === "PENDING" ? "Processing Network Payload..." : "Send Message"}
                        </button>

                        {/* Status Messaging Panels */}
                        {statusType === "SUCCESS" && (
                            <div style={styles.successMessage}>
                                ✓ Thank you! Your message has been safely logged in the system database.
                            </div>
                        )}

                        {statusType === "ERROR" && (
                            <div style={styles.errorMessage}>
                                ⚠️ Could not establish connection to Spring Boot Service API. Please check your system logs.
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </section>
    );
}

// Fixed Premium Inline Styling Map
const styles = {
    contactWrapper: {
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#f5f5f7",       
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem 2rem",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    container: {
        width: "100%",
        maxWidth: "1200px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "4rem",
        alignItems: "center",
    },
    infoColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    heading: {
        fontSize: "2.5rem",
        fontWeight: "800",
        color: "#1d1d1f",
        lineHeight: "1.2",
        margin: 0,
    },
    subheading: {
        fontSize: "1.05rem",
        color: "#86868b",
        lineHeight: "1.6",
        margin: "0 0 1.5rem 0",
    },
    cardsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
    },
    infoCard: {
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        backgroundColor: "#ffffff",
        padding: "1.25rem 1.5rem",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(0, 0, 0, 0.03)",
    },
    iconContainer: {
        fontSize: "1.5rem",
        width: "45px",
        height: "45px",
        backgroundColor: "#f5f5f7",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#86868b",
        margin: "0 0 0.25rem 0",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    cardLink: {
        fontSize: "1rem",
        fontWeight: "500",
        color: "#1d1d1f",
        textDecoration: "none",
        transition: "color 0.2s ease",
    },
    formColumn: {
        width: "100%",
    },
    contactForm: {
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    formHeading: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#1d1d1f",
        margin: "0 0 0.5rem 0",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#1d1d1f",
    },
    inputField: {
        width: "100%",
        padding: "0.85rem 1rem",
        borderRadius: "10px",
        border: "1px solid #d2d2d7",
        backgroundColor: "#f5f5f7",
        fontSize: "0.95rem",
        fontFamily: "inherit",
        color: "#1d1d1f",
        outline: "none",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
    },
    submitButton: {
        color: "#ffffff",
        border: "none",
        padding: "1rem 2rem",
        borderRadius: "30px",
        fontSize: "0.95rem",
        fontWeight: "600",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        marginTop: "0.5rem",
    },
    validationBanner: {
        padding: "0.85rem 1rem",
        backgroundColor: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba",
        borderRadius: "10px",
        fontSize: "0.9rem",
        fontWeight: "500",
    },
    successMessage: {
        padding: "1rem",
        backgroundColor: "#e8fdf0",
        color: "#34c759",
        borderRadius: "10px",
        fontSize: "0.9rem",
        fontWeight: "600",
        textAlign: "center",
    },
    errorMessage: {
        padding: "1rem",
        backgroundColor: "#fff2f1",
        color: "#ff3b30",
        borderRadius: "10px",
        fontSize: "0.9rem",
        fontWeight: "600",
        textAlign: "center",
    }
};

export default Contact;