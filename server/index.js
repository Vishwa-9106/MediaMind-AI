import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
// Sanitize model: avoid using the '-latest' suffix which may not exist for v1 endpoints
const MODEL_SAN = MODEL.endsWith('-latest') ? MODEL.slice(0, -7) : MODEL;
const baseUrlV1 = 'https://generativelanguage.googleapis.com/v1/models';
const baseUrlV1b = 'https://generativelanguage.googleapis.com/v1beta/models';
const makeUrl = (base, model) => `${base}/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY || '')}`;
console.log('Gemini model configured:', MODEL, '-> using:', MODEL_SAN);

// Simple health check
app.get('/api/health', (_req, res) => {
  return res.json({ ok: true, model: MODEL_SAN });
});

// List models helper (v1 and v1beta)
app.get('/api/models', async (_req, res) => {
  try {
    const [v1, v1b] = await Promise.all([
      fetch(`https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(GEMINI_API_KEY || '')}`)
        .then(r => r.ok ? r.json() : r.text().then(t => ({ error: t, status: r.status }))).catch(e => ({ error: String(e) })),
      fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY || '')}`)
        .then(r => r.ok ? r.json() : r.text().then(t => ({ error: t, status: r.status }))).catch(e => ({ error: String(e) })),
    ]);
    res.json({ v1, v1beta: v1b });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list models', details: String(e) });
  }
});

app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server' });
    }

    const parts = [];

    if (req.file) {
      // Validate supported mime types for inline analysis
      const mime = req.file.mimetype || '';
      const isImage = mime.startsWith('image/');
      const isPdf = mime === 'application/pdf';
      const isText = mime.startsWith('text/');
      if (!(isImage || isPdf || isText)) {
        return res.status(415).json({
          error: 'Unsupported file type',
          details: `Received ${mime}. Supported: image/*, application/pdf, text/*`,
        });
      }
      const b64 = req.file.buffer.toString('base64');
      parts.push({
        inlineData: {
          data: b64,
          mimeType: mime || 'application/octet-stream',
        },
      });
      parts.push({ text: 'Analyze this file. Provide factual content, a clear description, and key insights based only on the file. Do not invent content.' });
    } else if (req.body && req.body.url) {
      const { url } = req.body;
      parts.push({ text: `Analyze the content at this URL: ${url}. Summarize and provide insights. If inaccessible, state that explicitly.` });
    } else {
      return res.status(400).json({ error: 'Provide a file or a url' });
    }

    // Ask for structured JSON for all categories with strong guidance to avoid overlap
    parts.push({
      text:
        'You MUST return ONLY strict JSON with exactly these fields and NO extra keys: ' +
        '{"simpleSummary": string, "detailedExplanation": string, "childFriendly": string, "storytelling": string}. ' +
        'Rules per field:\n' +
        '- simpleSummary: give a short, clear, high-level summary of the topic in 2–4 sentences. It must be concise, objective, and directly express the main idea without examples or deep explanation.\n' +
        '- detailedExplanation: markdown with multiple headings, sub-headings, bullet points, step-by-step details, examples, technical notes, edge cases, and best practices. The tone must be professional and instructional. Use proper markdown formatting.\n' +
        '- childFriendly: explained for an 8–12 year old using short sentences and simple words. Friendly tone, may include a few emojis. No jargon, no complex explanations, no markdown headings or bullets. It should feel like a teacher talking to a child.\n' +
        '- storytelling: creative narrative style with sensory details, characters, feelings, and atmosphere. It must NOT summarize the topic directly. No bullets, no headings. It should feel like a small story inspired by the theme.\n' +
        'Make each field truly different in tone and structure, with no repeated sentences or paraphrased phrasing between fields. ' +
        'Output ONLY the JSON object, no code fences, no surrounding text.'
    });

    const payload = {
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 64,
      },
    };

    // Try a sequence of endpoints until one works
    const attempts = [];
    const m = MODEL_SAN;
    // Try stable IDs only; avoid '-latest' which can 404 on certain API versions
    attempts.push({ desc: 'v1 direct', url: makeUrl(baseUrlV1, m) });
    attempts.push({ desc: 'v1beta direct', url: makeUrl(baseUrlV1b, m) });

    let resp;
    let lastErr;
    for (const a of attempts) {
      try {
        console.log('Trying Gemini endpoint:', a.desc, a.url);
        const r = await fetch(a.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (r.ok) { resp = r; break; }
        let details;
        try { details = await r.json(); } catch { details = await r.text(); }
        console.warn('Attempt failed:', a.desc, r.status, details);
        lastErr = { status: r.status, details };
      } catch (e) {
        console.error('Attempt error:', a.desc, e);
        lastErr = { error: String(e) };
      }
    }

    if (!resp) {
      return res.status(502).json({ error: 'Gemini request failed after attempts', ...lastErr });
    }

    if (!resp.ok) {
      let details;
      try {
        details = await resp.json();
      } catch {
        details = await resp.text();
      }
      console.error('Gemini non-OK response:', resp.status, details);
      return res.status(502).json({ error: 'Gemini request failed', status: resp.status, details });
    }

    const data = await resp.json();
    // Log truncated success for debugging
    try {
      const preview = JSON.stringify(data).slice(0, 500);
      console.log('Gemini success response (preview):', preview);
    } catch {}
    // Extract text safely from candidates[0].content.parts[*].text
    const fullText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join('\n') || '';

    // Try to parse strict JSON for the four categories
    let results = null;
    if (fullText) {
      try {
        let parsed;
        try {
          parsed = JSON.parse(fullText);
        } catch {
          // Attempt to extract a JSON object substring
          const start = fullText.indexOf('{');
          const end = fullText.lastIndexOf('}');
          if (start !== -1 && end !== -1 && end > start) {
            const jsonSlice = fullText.slice(start, end + 1);
            parsed = JSON.parse(jsonSlice);
          } else {
            throw new Error('No JSON found');
          }
        }
        if (parsed && typeof parsed === 'object') {
          const { simpleSummary = '', detailedExplanation = '', childFriendly = '', storytelling = '' } = parsed;
          results = { simpleSummary, detailedExplanation, childFriendly, storytelling };
        }
      } catch {}
    }
    if (!results) {
      // Fallback: populate all tabs with the same text
      results = {
        simpleSummary: fullText,
        detailedExplanation: fullText,
        childFriendly: fullText,
        storytelling: fullText,
      };
    }

    return res.json({ status: 'completed', results, raw: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Analysis failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
