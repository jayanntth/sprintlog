import { useState } from "react"
import axios from "axios"

export default function App() {
  const [transcript, setTranscript] = useState("")
  const [meetingType, setMeetingType] = useState("standup")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyse = async () => {
    if (!transcript.trim()) {
      setError("Please paste a transcript first")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyse", {
        transcript: transcript,
        meeting_type: meetingType
      })
      setResult(response.data)
    } catch (err) {
      setError("Something went wrong. Make sure your backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "42px", color: "#4F46E5", margin: "0" }}>Sprintlog</h1>
        <p style={{ color: "#6B7280", fontSize: "16px", marginTop: "8px" }}>
          AI Meeting Summarizer for Software Startups
        </p>
      </div>

      {/* Input Section */}
      <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
        
        {/* Meeting Type Selector */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold", color: "#374151", display: "block", marginBottom: "8px" }}>
            Meeting Type
          </label>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "15px", background: "white" }}
          >
            <option value="standup">Daily Standup</option>
            <option value="sprint">Sprint Planning</option>
            <option value="product_review">Product Review</option>
            <option value="client_call">Client Call</option>
          </select>
        </div>

        {/* Transcript Input */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold", color: "#374151", display: "block", marginBottom: "8px" }}>
            Paste Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            rows={8}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        {/* Analyse Button */}
        <button
          onClick={handleAnalyse}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", background: loading ? "#A5B4FC" : "#4F46E5",
            color: "white", border: "none", borderRadius: "8px", fontSize: "16px",
            fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Analysing Meeting..." : "Analyse Meeting"}
        </button>

        {/* Error Message */}
        {error && (
          <div style={{ marginTop: "12px", padding: "12px", background: "#FEE2E2", borderRadius: "8px", color: "#DC2626" }}>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div>

          {/* Health Score */}
          <div style={{ background: "#EEF2FF", borderRadius: "12px", padding: "16px", marginBottom: "16px", textAlign: "center" }}>
            <span style={{ color: "#4F46E5", fontWeight: "bold" }}>
              {result.health_score.tasks} tasks · {result.health_score.blockers} blockers · {result.health_score.decisions} decisions · {result.health_score.open_questions} open questions
            </span>
          </div>

          {/* Summary */}
          <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ color: "#4F46E5", marginTop: "0" }}>Summary</h2>
            <p style={{ color: "#374151", lineHeight: "1.6" }}>{result.summary}</p>
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              Participants: {result.participants.join(", ")}
            </p>
          </div>

          {/* Action Items */}
          {result.action_items.length > 0 && (
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <h2 style={{ color: "#4F46E5", marginTop: "0" }}>Action Items</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Task", "Assignee", "Due Date", "Priority"].map(h => (
                      <th key={h} style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #E5E7EB", color: "#374151" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.action_items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px", color: "#374151" }}>{item.task}</td>
                      <td style={{ padding: "10px", color: "#374151" }}>{item.assignee || "Unassigned"}</td>
                      <td style={{ padding: "10px", color: "#374151" }}>{item.due_date || "—"}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold",
                          background: item.priority === "High" ? "#FEE2E2" : item.priority === "Medium" ? "#FEF3C7" : "#D1FAE5",
                          color: item.priority === "High" ? "#DC2626" : item.priority === "Medium" ? "#D97706" : "#059669"
                        }}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Blockers */}
          {result.blockers.length > 0 && (
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <h2 style={{ color: "#DC2626", marginTop: "0" }}>Blockers</h2>
              {result.blockers.map((b, i) => (
                <div key={i} style={{ background: "#FEF2F2", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "bold", color: "#374151" }}>{b.blocker}</p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6B7280" }}>
                    Raised by {b.raised_by} · Owner: {b.owner} · Follow up: {b.follow_up_date || "TBD"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Decisions */}
          {result.decisions.length > 0 && (
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <h2 style={{ color: "#059669", marginTop: "0" }}>Decisions Made</h2>
              {result.decisions.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ color: "#059669", marginRight: "10px" }}>✓</span>
                  <span style={{ color: "#374151" }}>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Open Questions */}
          {result.open_questions.length > 0 && (
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <h2 style={{ color: "#D97706", marginTop: "0" }}>Open Questions</h2>
              {result.open_questions.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ color: "#D97706", marginRight: "10px" }}>?</span>
                  <span style={{ color: "#374151" }}>{q}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}