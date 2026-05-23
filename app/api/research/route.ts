import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
  
    
    const { query } = await req.json();

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        max_results: 5,
      }),
    });

    // CONVERT RESPONSE TO JSON
    const data = await response.json();

    // FORMAT SOURCES
const sources = data.results
  ? data.results
      .map((item: any, index: number) => `
${index + 1}. ${item.title}

${item.content?.slice(0, 300)}...

Source:
${item.url}
`)
      .join("\n\n====================\n\n")
  : query;


const finalPrompt = `
You are an AI Research Assistant.

Create a clean, professional research report on:

"${query}"

IMPORTANT RULES:
- Use proper markdown formatting
- Use headings and subheadings
- Add inline citations like [1], [2], [3]
- Every factual statement must contain citations
- ONLY use the provided sources
- Do NOT invent information
- Keep language human readable
- Add a proper conclusion
- At the end add a References section

Research Sources:

${sources}

Report Format:

# Title

## Introduction

## Key Findings

## Analysis

## Challenges

## Future Scope

## Conclusion

## References
`;
const aiResponse = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "AI Research Assistant",
    },

    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    }),
  }
);

    const aiData = await aiResponse.json();

    console.log("OPENROUTER RESPONSE:", aiData)

 
    const aiText =
      aiData?.choices?.[0]?.message?.content ||
      "No AI response generated.";
      console.log(aiText)

   
   return NextResponse.json({
  report: aiText,
  sources: data.results || [],
});
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json({
      report: "Something went wrong.",
    });
  }
}