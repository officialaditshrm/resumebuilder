

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const aiRouter = express.Router();



// (aiRouter already declared above)

// Route to generate a new resume JSON using the LLM, based on a job description
aiRouter.post('/generate-resume', async (req, res) => {
  const { jobDescription } = req.body;
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const prompt = [
    'You are an expert resume generator. Given the following job description, generate a resume JSON object that matches this Mongoose schema (all fields except name, username, and user_id should be filled with realistic, relevant data):',
    '',
    'SCHEMA:',
    '{',
    '  name: string, // leave blank',
    '  user_id: string, // leave blank',
    '  private: boolean,',
    '  phonenum: string,',
    '  resumesummary: string,',
    '  username: string, // leave blank',
    '  city: string,',
    '  email: string,',
    '  email2: string,',
    '  state: string,',
    '  country: string,',
    '  pincode: string,',
    '  header_urls: [ { name: string, url: string } ],',
    '  education: [ {',
    '    institution: string,',
    '    qualifications: [ {',
    '      name: string,',
    '      grades: string,',
    '      start: string (ISO date),',
    '      end: string (ISO date),',
    '      ongoing: boolean,',
    '      description: string,',
    '      extras: [string],',
    '      urls: [ { name: string, url: string } ]',
    '    } ]',
    '  } ],',
    '  projects: [ {',
    '    projectname: string,',
    '    projectsummary: string,',
    '    start: string (ISO date),',
    '    end: string (ISO date),',
    '    ongoing: boolean,',
    '    points: [string],',
    '    extras: [string],',
    '    urls: [ { name: string, url: string } ],',
    '    stack: { head: string, content: string }',
    '  } ],',
    '  views: number,',
    '  experience: [ {',
    '    organization: string,',
    '    roles: [ {',
    '      rolename: string,',
    '      rolesummary: string,',
    '      start: string (ISO date),',
    '      end: string (ISO date),',
    '      ongoing: boolean,',
    '      points: [string],',
    '      extras: [string],',
    '      urls: [ { name: string, url: string } ]',
    '    } ],',
    '    extras: [string],',
    '    urls: [ { name: string, url: string } ]',
    '  } ],',
    '  skills: [ { head: string, content: string } ],',
    '  extraSections: [ {',
    '    sectionName: string,',
    '    subsections: [ {',
    '      title: string,',
    '      summary: string,',
    '      start: string (ISO date),',
    '      end: string (ISO date),',
    '      ongoing: boolean,',
    '      points: [string],',
    '      extras: [string],',
    '      urls: [ { name: string, url: string } ]',
    '    } ]',
    '  } ],',
    '  feedback: []',
    '}',
    '',
    `Job Description: ${jobDescription}`,
    '',
    'Respond with ONLY valid JSON (no commentary, no markdown, no explanations).',
    'Also, when filling extras, keep them short, and try to keep them as less as possible.'
  ].join('\n');

  const payload = {
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
    messages: [
      { role: "system", content: "You are an expert resume generator." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2048
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${err}`);
    }

    const data = await response.json();
    let text = '';
    if (data.choices && data.choices[0]?.message?.content) {
      text = data.choices[0].message.content;
    } else {
      throw new Error('No content in OpenRouter response');
    }

    // Extract JSON safely
    let jsonStart = text.indexOf('{');
    let jsonEnd = text.lastIndexOf('}');
    let parsed = null;

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } catch (e) {
        parsed = { raw: text };
      }
    } else {
      parsed = { raw: text };
    }

    res.json(parsed);
  } catch (error) {
    console.error('error:', error.message);
    res.status(500).json({ error: 'API call failed', message: error.message });
  }
});

aiRouter.post('/', async (req, res) => {
  const { resumeData, jobDescription } = req.body;


  // Use OpenRouter.ai endpoint
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const prompt = `
Given a resume in JSON format and a job description (as plain text), do the following:

Analyze the resume and score it out of 100 for how well it matches the job description.
Be strict and detailed. Do not give high scores just because the resume contains matching words. The score must reflect the amount, depth, and relevance of the candidate's content.

Break down the score across these five components:
Keyword and skill match (30 points)
 - Check how many important skills, tools, and terms from the job description are present.
 - Evaluate whether they appear in the right context (e.g. work experience, not just in the skills list).
 - Reward repeated and contextual usage, not just mentions.

Relevant experience and titles (15 points)
 - Check if the candidate's past roles match or relate to the target job title.
 - Consider how recent and how long the relevant experience is.

Penalize unrelated or outdated experience.
Skill usage depth and frequency (15 points)
 - Assess how deeply the candidate worked with each important skill.
 - Look for multiple appearances of a skill across roles or projects.
 - Reward hands-on usage and clear application.

Quantified achievements (10 points)
 - Check if the resume includes measurable outcomes (e.g. “increased performance by 30%”).
 - Favor bullet points that show results or impact, not just responsibilities.
 - Deduct points if the resume lacks outcomes or metrics.

Resume completeness (30 points)
 - Confirm that all major sections are present: experience, education, skills, projects.
 - Deduct points if the number of words is too short.
 - Example: It's good to have around 15 words per 'point'. Lesser should deduct it.
 - Also check the length of the content overall. Ideally there should be atleast around 5-6 big subsections such as a job-role or a project or a special extrasection etc.
 - Things should be well described.

Look for missing or empty fields.
Check for lack of detail in sections.
At the end, return:
 - The total score out of 100.
 - The individual scores for each category.
 - A short explanation (1-2 lines) for each category describing how the score was determined.

The scoring should be very tough, do not be linient in any case!
Resume JSON:
<resume>
${JSON.stringify(resumeData, null, 2)}
</resume>

Job Title: ${jobDescription}

Respond with ONLY valid JSON in this format (no commentary, no markdown):

{
  "score": 0-100
  "individual_category_score": [{"category": "...", score : int, short_explanation : string}]
  "missingKeywords": [string],
  "rewrites": [{"old": "...", "new": "..."}],
  "suggestions": [string]
}
`;

  const payload = {
    model: "mistralai/mistral-small-3.2-24b-instruct:free", // or another model available on OpenRouter
    messages: [
      { role: "system", content: "You are an expert ATS evaluator and resume advisor." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 1024
  };

  try {

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${err}`);
    }

    const data = await response.json();
    let text = '';
    if (data.choices && data.choices[0]?.message?.content) {
      text = data.choices[0].message.content;
    } else {
      throw new Error('No content in OpenRouter response');
    }

    // Extract JSON safely
    let jsonStart = text.indexOf('{');
    let jsonEnd = text.lastIndexOf('}');
    let parsed = null;

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } catch (e) {
        parsed = { raw: text };
      }
    } else {
      parsed = { raw: text };
    }

    res.json(parsed);
  } catch (error) {
    console.error('error:', error.message);
    res.status(500).json({ error: 'API call failed', message: error.message });
  }
});

export default aiRouter;
