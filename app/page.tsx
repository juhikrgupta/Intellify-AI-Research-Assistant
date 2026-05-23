"use client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");
  const [displayedReport, setDisplayedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [sources, setSources] = useState<any[]>([]);
const [showSources, setShowSources] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleResearch = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      setReport(data.report);
      setHistory((prev) => [query, ...prev]);
      setSources(data.sources || []);
setDisplayedReport("");

let index = 0;

const interval = setInterval(() => {
  if (index < data.report.length) {

    setDisplayedReport(
      (prev) => prev + data.report.charAt(index)
    );

    index++;

  } else {
    clearInterval(interval);
  }
}, 10);
    } catch (error) {
      console.error(error);
      setReport("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleFollowUp = async () => {
  try {
    setLoading(true);

    const response = await fetch("/api/research", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    query: `
Previous Research Report:
${report}

Follow-up Question:
${followUp}

Answer the follow-up question based ONLY on the previous report.
`,
  }),
});

    const data = await response.json();

    setChatResponse(data.report || "No response received.");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-10">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]">
  AI Research Assistant
</h1>

        <p className="text-gray-400 mb-10">
          Search, analyze and generate AI-powered research reports.
        </p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter research topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 outline-none"
          />

          <button
            onClick={handleResearch}
            className="bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-105 px-6 py-4 rounded-xl font-medium"
          >
            {loading ? (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    Generating...
  </div>
) : (
  "Research"
)}
          </button>
        </div>

        {report && (
  <div className="mt-8 bg-white/5 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition duration-300 hover:-translate-y-1">

    <button
      onClick={() => navigator.clipboard.writeText(report)}
    className="bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-105 px-6 py-4 rounded-xl font-medium"
    >
      Copy Report
    </button>

    <div>
  <ReactMarkdown>{displayedReport}</ReactMarkdown>

  {loading && (
    <span className="animate-pulse text-blue-400 text-xl">
      ▋
    </span>
  )}
</div>

  </div>
)}
{report && (
  <div className="mt-8 border border-gray-700 rounded-xl p-6 bg-gray-900">

    <h2 className="text-2xl font-bold mb-4">
      Follow-up Chat
    </h2>

    <div className="flex gap-4 mb-4">

      <input
        type="text"
        placeholder="Ask follow-up question..."
        value={followUp}
        onChange={(e) => setFollowUp(e.target.value)}
        className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 outline-none"
      />

      <button
        onClick={handleFollowUp}
      className="bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-105 px-6 py-4 rounded-xl font-medium"
      >
        Ask
      </button>

    </div>

    {chatResponse && (
      <div className="bg-black p-4 rounded-lg whitespace-pre-wrap">
        <ReactMarkdown>{chatResponse}</ReactMarkdown>
      </div>
    )}

  </div>
)}
      {/* Sources Section */}

{sources.length > 0 && (
  <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition duration-300 hover:-translate-y-1">

    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Sources</h2>

      <button
        onClick={() => setShowSources(!showSources)}
        className="bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-105 px-6 py-4 rounded-xl font-medium"
      >
        {showSources ? "Hide" : "Show"}
      </button>
    </div>

    {showSources && (
      <div className="space-y-4">
        {sources.map((source: any, index: number) => (
          <div
            key={index}
            className="bg-black border border-gray-800 rounded-lg p-4"
          >
            <h3 className="font-semibold text-lg mb-2">
              {index + 1}. {source.title}
            </h3>

            <p className="text-gray-400 text-sm mb-3">
              {source.content?.slice(0, 200)}...
            </p>

            <a
              href={source.url}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Visit Source
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
)}
{history.length > 0 && (
  <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition duration-300 hover:-translate-y-1">
    
    <h2 className="text-2xl font-bold mb-4">
      Research History
    </h2>

    <div className="space-y-3">
      {history.map((item, index) => (
        <button
          key={index}
          onClick={() => setQuery(item)}
          className="bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-105 px-6 py-4 rounded-xl font-medium"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
)}
      </div>
    </main>
  );
}