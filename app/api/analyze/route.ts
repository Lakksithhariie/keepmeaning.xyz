import Groq from "groq-sdk";

// The client looks for GROQ_API_KEY in your environment variables
const groq = new Groq();

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          // PM NOTE: This prompt controls the personality!
          content: `You are the 'Vibe Curator' for KeepMeaning.
          Analyze the text provided. Return ONLY a JSON object with this structure:
          {
            "vibe": "One word adjective (e.g., Passive, Electric, Cold, Warm)",
            "score": 1-10 (10 is most engaging),
            "summary": "A 1-sentence witty summary of how this sounds.",
            "suggestions": [
              { "original": "text segment", "better": "improvement", "reason": "Explain like I'm 5" }
            ]
          }`
        },
        { role: "user", content: text }
      ],
      // Using the 120b model for high intelligence + speed
      model: "openai/gpt-oss-120b",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    return Response.json(JSON.parse(completion.choices[0].message.content || "{}"));
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}