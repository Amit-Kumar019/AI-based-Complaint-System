const axios = require('axios');

exports.analyzeComplaint = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const prompt = `
      Analyze the following complaint:
      Title: ${title}
      Description: ${description}
      Category: ${category}
      
      Please provide a JSON response with the following keys:
      - priority: "High", "Medium", or "Low"
      - department: The suggested responsible department (e.g., Water Department, Sanitation Department, Electricity Board).
      - summary: A brief 1-2 sentence summary of the complaint.
      - autoResponse: A polite, automated response message to the user acknowledging the complaint and mentioning the priority and department.

      Output ONLY valid JSON.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000', // optional
          'X-Title': 'Smart Complaint System', // optional
        },
      }
    );

    const aiText = response.data.choices[0].message.content;
    
    // Extract JSON from response (handling potential markdown formatting like ```json ... ```)
    let aiData;
    try {
      const jsonMatch = aiText.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiText;
      aiData = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    res.json(aiData);
  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ message: 'Error analyzing complaint with AI' });
  }
};
