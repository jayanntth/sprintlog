import { useState } from "react"
import axios from "axios"

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  primaryHover: "#4338CA",
  success: "#059669",
  successLight: "#D1FAE5",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  purple: "#7C3AED",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
}

const API_URL = "https://sprintlog-backend.onrender.com"

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #F0F4FF 0%, #FAFAFA 50%, #F5F3FF 100%)",
    fontFamily: "'Arial', sans-serif",
  },
  navbar: {
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    boxSizing: "border-box",
  },
  navLogo: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#4F46E5",
    letterSpacing: "-0.5px",
  },
  navBadge: {
    background: "#EEF2FF",
    color: "#4F46E5",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  container: {
    maxWidth: "960px",
    width: "100%",
    margin: "0 auto",
    padding: "48px 24px",
    boxSizing: "border-box",
  },
  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "900",
    color: "#111827",
    margin: "0 0 12px",
    letterSpacing: "-1px",
    lineHeight: "1.1",
  },
  heroSpan: {
    color: "#4F46E5",
  },
  heroSubtitle: {
    fontSize: "17px",
    color: "#6B7280",
    margin: "0 0 24px",
    lineHeight: "1.5",
  },
  heroBadges: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroBadge: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "13px",
    color: "#6B7280",
    fontWeight: "500",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  label: {
    fontWeight: "700",
    color: "#374151",
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #E5E7EB",
    fontSize: "15px",
    background: "#FFFFFF",
    color: "#374151",
    outline: "none",
    cursor: "pointer",
  },
  toggleRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    background: "#F3F4F6",
    borderRadius: "10px",
    padding: "4px",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1.5px solid #E5E7EB",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
    color: "#374151",
    lineHeight: "1.6",
    outline: "none",
    fontFamily: "Arial, sans-serif",
  },
  uploadBox: {
    border: "2px dashed #E5E7EB",
    borderRadius: "12px",
    padding: "40px 24px",
    textAlign: "center",
    background: "#F9FAFB",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  uploadIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  uploadText: {
    color: "#6B7280",
    margin: "0 0 6px",
    fontSize: "15px",
    fontWeight: "600",
  },
  uploadHint: {
    color: "#9CA3AF",
    margin: "0",
    fontSize: "13px",
  },
  errorBox: {
    marginTop: "12px",
    padding: "14px 16px",
    background: "#FEE2E2",
    borderRadius: "10px",
    color: "#DC2626",
    fontSize: "14px",
    fontWeight: "500",
  },
  healthBar: {
    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    borderRadius: "14px",
    padding: "18px 24px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    flexWrap: "wrap",
  },
  healthItem: {
    textAlign: "center",
    color: "#FFFFFF",
  },
  healthNumber: {
    fontSize: "28px",
    fontWeight: "900",
    display: "block",
    lineHeight: "1",
  },
  healthLabel: {
    fontSize: "12px",
    opacity: 0.85,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "4px",
    display: "block",
  },
  exportRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    borderBottom: "2px solid #F3F4F6",
    color: "#6B7280",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },
  td: {
    padding: "12px",
    color: "#374151",
    fontSize: "14px",
    borderBottom: "1px solid #F3F4F6",
  },
  blockerCard: {
    background: "#FFF5F5",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "10px",
    borderLeft: "3px solid #DC2626",
  },
  blockerTitle: {
    margin: "0 0 6px",
    fontWeight: "700",
    color: "#374151",
    fontSize: "14px",
  },
  blockerMeta: {
    margin: "0",
    fontSize: "13px",
    color: "#6B7280",
  },
  decisionItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #F3F4F6",
    gap: "10px",
  },
  questionItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #F3F4F6",
    gap: "10px",
  },
  summaryText: {
    color: "#374151",
    lineHeight: "1.7",
    fontSize: "15px",
    margin: "0 0 12px",
  },
  participantsBadge: {
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "4px",
  },
  participantChip: {
    background: "#EEF2FF",
    color: "#4F46E5",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
}

export default function App() {
  const [transcript, setTranscript] = useState("")
  const [meetingType, setMeetingType] = useState("standup")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inputMode, setInputMode] = useState("text")
  const [audioFile, setAudioFile] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleAnalyse = async () => {
    if (inputMode === "text" && !transcript.trim()) {
      setError("Please paste a transcript first")
      return
    }
    if (inputMode === "audio" && !audioFile) {
      setError("Please select an audio file first")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      let response
      if (inputMode === "text") {
        response = await axios.post(`${API_URL}/analyse`, {
          transcript,
          meeting_type: meetingType,
        })
      } else {
        const formData = new FormData()
        formData.append("file", audioFile)
        formData.append("meeting_type", meetingType)
        response = await axios.post(`${API_URL}/transcribe`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
      setResult(response.data)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || "Something went wrong. Make sure your backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = (data, headers, filename) => {
    const csv = [headers, ...data.map(row => row.map(cell => `"${cell || ""}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadTasksCSV = () => {
    downloadCSV(
      result.action_items.map(i => [i.task, i.assignee, i.due_date, i.priority, i.notes]),
      ["Task", "Assignee", "Due Date", "Priority", "Notes"],
      "sprintlog-tasks.csv"
    )
  }

  const downloadBlockersCSV = () => {
    downloadCSV(
      result.blockers.map(b => [b.blocker, b.raised_by, b.owner, b.follow_up_date]),
      ["Blocker", "Raised By", "Owner", "Follow Up Date"],
      "sprintlog-blockers.csv"
    )
  }

  const downloadSummary = () => {
    const content = `SPRINTLOG MEETING SUMMARY\n${"=".repeat(40)}\nType: ${result.meeting_type}\nParticipants: ${result.participants.join(", ")}\n\nSUMMARY\n${result.summary}\n\nACTION ITEMS\n${result.action_items.map(i => `• ${i.task} — ${i.assignee || "Unassigned"} — Due: ${i.due_date || "TBD"} — ${i.priority}`).join("\n")}\n\nBLOCKERS\n${result.blockers.length > 0 ? result.blockers.map(b => `• ${b.blocker} — Owner: ${b.owner}`).join("\n") : "None"}\n\nDECISIONS\n${result.decisions.length > 0 ? result.decisions.map(d => `• ${d}`).join("\n") : "None"}\n\nOPEN QUESTIONS\n${result.open_questions.length > 0 ? result.open_questions.map(q => `• ${q}`).join("\n") : "None"}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sprintlog-summary.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyFollowUpEmail = () => {
    const tasks = result.action_items.map(i => `- ${i.task} (${i.assignee || "Unassigned"}${i.due_date ? ` — due ${i.due_date}` : ""})`).join("\n")
    const decisions = result.decisions.length > 0 ? `\nDecisions made:\n${result.decisions.map(d => `- ${d}`).join("\n")}` : ""
    const questions = result.open_questions.length > 0 ? `\nOpen questions:\n${result.open_questions.map(q => `- ${q}`).join("\n")}` : ""
    const email = `Hi team,\n\nHere's a summary of our meeting:\n\n${result.summary}${decisions}\n\nAction items:\n${tasks}${questions}\n\nBest regards`
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleBtn = (active) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    background: active ? "#FFFFFF" : "transparent",
    color: active ? "#4F46E5" : "#6B7280",
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
  })

  const analyseBtn = (loading) => ({
    width: "100%",
    padding: "16px",
    background: loading ? "#9CA3AF" : "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: loading ? "not-allowed" : "pointer",
    letterSpacing: "0.3px",
    boxShadow: loading ? "none" : "0 4px 14px rgba(79,70,229,0.4)",
    marginTop: "8px",
  })

  const exportBtn = (color) => ({
    padding: "10px 18px",
    background: color,
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow: `0 2px 6px ${color}55`,
  })

  const priorityBadge = (priority) => ({
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    background: priority === "High" ? "#FEE2E2" : priority === "Medium" ? "#FEF3C7" : "#D1FAE5",
    color: priority === "High" ? "#DC2626" : priority === "Medium" ? "#D97706" : "#059669",
  })

  const sectionTitle = (color) => ({
    color: color || "#4F46E5",
    marginTop: "0",
    marginBottom: "16px",
    fontSize: "18px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  })

  const meetingLabels = {
    standup: "Daily Standup",
    sprint: "Sprint Planning",
    product_review: "Product Review",
    client_call: "Client Call",
  }

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>⚡ Sprintlog</div>
        <div style={styles.navBadge}>AI-Powered</div>
      </nav>

      <div style={styles.container}>

        {/* Hero */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Turn meetings into<br />
            <span style={styles.heroSpan}>action, instantly.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Drop in your meeting transcript or recording.<br />
            Get tasks, blockers, decisions, and exports in seconds.
          </p>
          <div style={styles.heroBadges}>
            {["Daily Standup", "Sprint Planning", "Product Review", "Client Call"].map(b => (
              <span key={b} style={styles.heroBadge}>✓ {b}</span>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div style={styles.card}>

          {/* Meeting Type */}
          <div style={{ marginBottom: "20px" }}>
            <label style={styles.label}>Meeting Type</label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              style={styles.select}
            >
              <option value="standup">Daily Standup</option>
              <option value="sprint">Sprint Planning</option>
              <option value="product_review">Product Review</option>
              <option value="client_call">Client Call</option>
            </select>
          </div>

          {/* Toggle */}
          <div style={styles.toggleRow}>
            <button style={toggleBtn(inputMode === "text")} onClick={() => setInputMode("text")}>
              📝 Paste Transcript
            </button>
            <button style={toggleBtn(inputMode === "audio")} onClick={() => setInputMode("audio")}>
              🎙️ Upload Audio
            </button>
          </div>

          {/* Text Input */}
          {inputMode === "text" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Transcript</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here — speaker labels like 'John: ...' help identify participants..."
                rows={8}
                style={styles.textarea}
              />
            </div>
          )}

          {/* Audio Input */}
          {inputMode === "audio" && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={styles.uploadBox}
                onClick={() => document.getElementById("audioInput").click()}
              >
                <div style={styles.uploadIcon}>{audioFile ? "✅" : "🎵"}</div>
                <p style={styles.uploadText}>
                  {audioFile ? audioFile.name : "Click to upload your meeting recording"}
                </p>
                <p style={styles.uploadHint}>Supports MP3, MP4, WAV, M4A — transcribed automatically</p>
                <input
                  id="audioInput"
                  type="file"
                  accept=".mp3,.mp4,.wav,.m4a"
                  style={{ display: "none" }}
                  onChange={(e) => setAudioFile(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {/* Button */}
          <button onClick={handleAnalyse} disabled={loading} style={analyseBtn(loading)}>
            {loading
              ? (inputMode === "audio" ? "⏳ Transcribing & Analysing..." : "⏳ Analysing Meeting...")
              : "Analyse Meeting →"}
          </button>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        </div>

        {/* Results */}
        {result && (
          <div>

            {/* Health Bar */}
            <div style={styles.healthBar}>
              {[
                { number: result.health_score.tasks, label: "Tasks" },
                { number: result.health_score.blockers, label: "Blockers" },
                { number: result.health_score.decisions, label: "Decisions" },
                { number: result.health_score.open_questions, label: "Questions" },
              ].map(({ number, label }) => (
                <div key={label} style={styles.healthItem}>
                  <span style={styles.healthNumber}>{number}</span>
                  <span style={styles.healthLabel}>{label}</span>
                </div>
              ))}
            </div>

            {/* Export Buttons */}
            <div style={styles.exportRow}>
              <button onClick={downloadTasksCSV} style={exportBtn("#059669")}>⬇ Tasks CSV</button>
              <button onClick={downloadBlockersCSV} style={exportBtn("#DC2626")}>⬇ Blockers CSV</button>
              <button onClick={downloadSummary} style={exportBtn("#7C3AED")}>⬇ Summary</button>
              {result.meeting_type === "client_call" && (
                <button onClick={copyFollowUpEmail} style={exportBtn(copied ? "#059669" : "#D97706")}>
                  {copied ? "✅ Copied!" : "✉ Copy Follow-up Email"}
                </button>
              )}
            </div>

            {/* Summary */}
            <div style={styles.card}>
              <h2 style={sectionTitle("#4F46E5")}>
                📋 Summary — {meetingLabels[result.meeting_type]}
              </h2>
              <p style={styles.summaryText}>{result.summary}</p>
              <div style={styles.participantsBadge}>
                {result.participants.map(p => (
                  <span key={p} style={styles.participantChip}>{p}</span>
                ))}
              </div>
            </div>

            {/* Action Items */}
            {result.action_items.length > 0 && (
              <div style={styles.card}>
                <h2 style={sectionTitle("#4F46E5")}>✅ Action Items</h2>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["Task", "Assignee", "Due Date", "Priority"].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.action_items.map((item, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{item.task}</td>
                        <td style={styles.td}>{item.assignee || "Unassigned"}</td>
                        <td style={styles.td}>{item.due_date || "—"}</td>
                        <td style={styles.td}>
                          <span style={priorityBadge(item.priority)}>{item.priority}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Blockers */}
            {result.blockers.length > 0 && (
              <div style={styles.card}>
                <h2 style={sectionTitle("#DC2626")}>🚨 Blockers</h2>
                {result.blockers.map((b, i) => (
                  <div key={i} style={styles.blockerCard}>
                    <p style={styles.blockerTitle}>{b.blocker}</p>
                    <p style={styles.blockerMeta}>
                      Raised by <strong>{b.raised_by}</strong> · Owner: <strong>{b.owner}</strong> · Follow up: {b.follow_up_date || "TBD"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Decisions */}
            {result.decisions.length > 0 && (
              <div style={styles.card}>
                <h2 style={sectionTitle("#059669")}>🎯 Decisions Made</h2>
                {result.decisions.map((d, i) => (
                  <div key={i} style={styles.decisionItem}>
                    <span style={{ color: "#059669", fontSize: "18px" }}>✓</span>
                    <span style={{ color: "#374151", fontSize: "14px" }}>{d}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Open Questions */}
            {result.open_questions.length > 0 && (
              <div style={styles.card}>
                <h2 style={sectionTitle("#D97706")}>❓ Open Questions</h2>
                {result.open_questions.map((q, i) => (
                  <div key={i} style={styles.questionItem}>
                    <span style={{ color: "#D97706", fontSize: "18px" }}>?</span>
                    <span style={{ color: "#374151", fontSize: "14px" }}>{q}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}