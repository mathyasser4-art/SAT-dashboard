import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import saveAiQuestion from '../../api/saveAiQuestion.api'
import correctIcon from '../../correct-icon.png'
import '../../reusable.css'
import './AiGenerate.css'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp'

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
        const result = reader.result || ''
        const base64 = String(result).split(',')[1]
        if (!base64) {
            reject(new Error('Failed to convert the selected file.'))
            return
        }
        resolve(base64)
    }
    reader.onerror = () => reject(new Error('Failed to read the selected file.'))
    reader.readAsDataURL(file)
})

const buildPrompt = (topic, chapterName, attachmentContext) => {
    const mcqShape = `{
  "type": "MCQ",
  "question": "Question text here",
  "correctAnswer": "The one correct answer",
  "wrongAnswer": ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
  "questionPoints": 2
}`
    const essayShape = `{
  "type": "Essay",
  "question": "Question text here",
  "answer": ["Accepted answer 1"],
  "questionPoints": 2
}`

    return `You are an expert SAT math question extractor and creator.

${attachmentContext
        ? `Your PRIMARY task: read the attached file and extract ALL SAT math questions from it for the chapter "${chapterName}". Do NOT limit the number of questions — extract every single question you find in the file.`
        : `Generate SAT math practice questions for the chapter "${chapterName}".`
    }

${topic ? `Additional instructions / topic context: "${topic}"` : ''}

FILE HANDLING RULES:
- Extract every question from the attached file with no count restriction.
- Preserve the original question text and answer choices exactly as written.
- If a question has answer choices (A, B, C, D or 4 options), treat it as MCQ. Identify the correct answer from any answer key provided.
- If a question requires a typed/numeric answer with no choices, treat it as Essay.
- If the file contains images of questions, describe the math problem in text form as accurately as possible.
- If no file is attached, generate SAT-style math questions on the given topic.

STRICT RULES:
- Return ONLY a valid JSON object. No markdown, no code blocks, no explanation.
- Each question MUST include a "type" field: either "MCQ" or "Essay".
- For MCQ: provide exactly 3 wrong answers and 1 correct answer.
- For Essay: provide 1–3 accepted answer variations.
- questionPoints should be between 1 and 5.
- Use plain text for math expressions (e.g. "x^2 + 3x - 4 = 0", "sqrt(25)", "3/4").

ATTACHMENT CONTEXT:
${attachmentContext || 'No attachment was provided.'}

Return this exact JSON structure (mix MCQ and Essay as appropriate based on the file):
{
  "questions": [
    ${mcqShape},
    ${essayShape}
  ]
}`
}

const stripMarkdown = (text) => {
    return text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim()
}

const buildGeminiParts = async ({ prompt, attachmentFile }) => {
    const parts = [{ text: prompt }]

    if (!attachmentFile) {
        return parts
    }

    const normalizedMimeType = attachmentFile.type || (
        attachmentFile.name.toLowerCase().endsWith('.doc')
            ? 'application/msword'
            : attachmentFile.name.toLowerCase().endsWith('.docx')
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/octet-stream'
    )
    const base64Data = await fileToBase64(attachmentFile)

    parts.push({
        inlineData: {
            mimeType: normalizedMimeType,
            data: base64Data
        }
    })

    return parts
}

const AiGenerate = () => {
    const { chapterID, chapterName, questionTypeID, unitID, questionTypeName, subjectID } = useParams()

    const [apiKey, setApiKey] = useState('')
    const [topic, setTopic] = useState('')
    const [attachmentFile, setAttachmentFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle | generating | saving | done | error
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const [savedCount, setSavedCount] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key')
        if (savedKey) setApiKey(savedKey)
    }, [])

    const validate = () => {
        if (!apiKey.trim()) { setErrorMessage('API key is required'); return false }
        if (!topic.trim() && !attachmentFile) { setErrorMessage('Add a topic or attach a file'); return false }
        if (attachmentFile && attachmentFile.size > 20 * 1024 * 1024) {
            setErrorMessage('Attached files must be smaller than 20 MB')
            return false
        }
        return true
    }

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0] || null
        setErrorMessage('')

        if (!file) {
            setAttachmentFile(null)
            return
        }

        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp'
        ]

        const hasSupportedExtension = /\.(pdf|doc|docx|png|jpe?g|webp)$/i.test(file.name)

        if (!allowedMimeTypes.includes(file.type) && !hasSupportedExtension) {
            event.target.value = ''
            setAttachmentFile(null)
            setErrorMessage('Please attach a PDF, Word, or image file.')
            return
        }

        try {
            if (file.name.toLowerCase().endsWith('.doc') && file.type !== 'application/msword') {
                const arrayBuffer = await file.arrayBuffer()
                const repairedFile = new File(
                    [arrayBuffer],
                    file.name,
                    { type: 'application/msword' }
                )
                setAttachmentFile(repairedFile)
                return
            }
            setAttachmentFile(file)
        } catch (error) {
            event.target.value = ''
            setAttachmentFile(null)
            setErrorMessage('Failed to prepare the selected file.')
        }
    }

    const handleGenerate = async () => {
        if (!validate()) return
        setErrorMessage('')

        localStorage.setItem('gemini_api_key', apiKey.trim())
        setStatus('generating')

        let questions = []
        try {
            const prompt = buildPrompt(
                topic,
                decodeURIComponent(chapterName),
                attachmentFile
                    ? `A file named "${attachmentFile.name}" is attached. Read it and extract ALL questions from it.`
                    : ''
            )

            const parts = await buildGeminiParts({ prompt, attachmentFile })

            const response = await fetch(`${GEMINI_URL}?key=${apiKey.trim()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: 16384 }
                })
            })

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}))
                const errMsg = errJson?.error?.message || `Gemini API error (${response.status})`
                throw new Error(errMsg)
            }

            const geminiData = await response.json()
            const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            const cleanedText = stripMarkdown(rawText)
            const parsed = JSON.parse(cleanedText)
            questions = parsed.questions || []

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('AI returned no questions. Try a more specific topic or a clearer file.')
            }

            // Preserve the AI-determined type per question; default to MCQ
            questions = questions.map(q => ({
                ...q,
                type: q.type === 'Essay' ? 'Essay' : 'MCQ'
            }))
        } catch (err) {
            setStatus('error')
            setErrorMessage(err.message || 'Failed to generate questions. Check your API key and try again.')
            return
        }

        setStatus('saving')
        setProgress({ current: 0, total: questions.length })

        let saved = 0
        for (let i = 0; i < questions.length; i++) {
            setProgress({ current: i + 1, total: questions.length })
            try {
                await saveAiQuestion(questions[i], chapterID)
                saved++
            } catch (e) {
                console.error(`Failed to save question ${i + 1}:`, e)
            }
            await new Promise(r => setTimeout(r, 300))
        }

        setSavedCount(saved)
        setStatus('done')
    }

    const handleGenerateMore = () => {
        setStatus('idle')
        setProgress({ current: 0, total: 0 })
        setSavedCount(0)
        setErrorMessage('')
    }

    const progressPercent = progress.total > 0
        ? Math.round((progress.current / progress.total) * 100)
        : 0

    if (status === 'done') {
        return (
            <div className="ai-generate-page d-flex justify-content-center align-items-center">
                <div className="ai-success-card d-flex flex-direction-column align-items-center">
                    <img src={correctIcon} className="ai-success-icon" alt="success" />
                    <p className="ai-success-title text-color">{savedCount} questions saved successfully!</p>
                    <p className="ai-success-sub text-color">
                        Go to the chapter to review them. You can delete any question you don't like.
                    </p>
                    <div className="d-flex ai-success-buttons">
                        <Link to={`/chapter/${questionTypeName}/${chapterID}/${questionTypeID}/${unitID}/${subjectID}`}>
                            <button className="button">Go to Chapter to Review</button>
                        </Link>
                        <button className="button ai-more-btn" onClick={handleGenerateMore}>Generate More</button>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'generating' || status === 'saving') {
        return (
            <div className="ai-generate-page d-flex justify-content-center align-items-center">
                <div className="ai-progress-card d-flex flex-direction-column align-items-center">
                    <div className="ai-spinner"></div>
                    {status === 'generating' && (
                        <>
                            <p className="ai-progress-title text-color">Reading file & generating questions with AI...</p>
                            <p className="ai-progress-sub">This may take a few seconds</p>
                        </>
                    )}
                    {status === 'saving' && (
                        <>
                            <p className="ai-progress-title text-color">Saving questions to database...</p>
                            <p className="ai-progress-sub">
                                Saving question {progress.current} of {progress.total}
                            </p>
                            <div className="ai-progress-bar-track">
                                <div className="ai-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <p className="ai-progress-percent">{progressPercent}%</p>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="ai-generate-page">
            <div className="ai-form-container">
                <div className="ai-header">
                    <div className="ai-header-icon">🤖</div>
                    <div>
                        <p className="ai-page-title text-color">AI Question Generator</p>
                        <p className="ai-page-subtitle">
                            Chapter: <span className="ai-chapter-name">{decodeURIComponent(chapterName)}</span>
                        </p>
                    </div>
                </div>

                {errorMessage && <p className="text-error ai-error">{errorMessage}</p>}

                <div className="ai-field">
                    <label className="ai-label">
                        Gemini API Key
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="ai-key-link"
                        >
                            Get a free key at ai.google.dev →
                        </a>
                    </label>
                    <input
                        type="password"
                        className="ai-input"
                        placeholder="AIzaSy..."
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                    />
                    {apiKey && (
                        <p className="ai-key-saved">✓ Your API key is saved locally in your browser</p>
                    )}
                </div>

                <div className="ai-field">
                    <label className="ai-label">Topic / Extra Instructions (optional)</label>
                    <textarea
                        className="ai-textarea"
                        placeholder="Describe the SAT math topic or add any extra notes for the AI. Leave empty if attaching a file."
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        rows={3}
                    />
                    <p className="ai-field-help">
                        You can write instructions here, attach a file below, or use both together.
                    </p>
                </div>

                <div className="ai-field">
                    <label className="ai-label">Attach questions file</label>
                    <label className="ai-upload-box">
                        <input
                            type="file"
                            className="ai-file-input"
                            accept={ACCEPTED_FILE_TYPES}
                            onChange={handleFileChange}
                        />
                        <span className="ai-upload-title">📎 Upload PDF, Word, or image</span>
                        <span className="ai-upload-subtitle">
                            All questions in the file will be extracted with no limit — Supported: PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP
                        </span>
                    </label>
                    {attachmentFile && (
                        <div className="ai-file-pill">
                            <span className="ai-file-name">{attachmentFile.name}</span>
                            <button
                                type="button"
                                className="ai-file-remove"
                                onClick={() => setAttachmentFile(null)}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div className="ai-actions d-flex">
                    <button className="button ai-generate-btn" onClick={handleGenerate}>
                        🤖 Generate & Save All Questions
                    </button>
                    <Link to={`/chapter/${questionTypeName}/${chapterID}/${questionTypeID}/${unitID}/${subjectID}`}>
                        <button className="button cancel-button">Cancel</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AiGenerate
