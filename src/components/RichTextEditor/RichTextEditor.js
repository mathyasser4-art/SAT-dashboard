import React, { useRef, useEffect } from 'react';
import { Quill } from 'react-quill';
import ReactQuill from 'react-quill';
import katex from 'katex';

// CSS imports – order matters for specificity
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import 'mathquill/build/mathquill.css';

import mathquill4quill from '../../mathquill4quill.vendor';

// Must import AFTER jquery setup (sets window.jQuery + window.MathQuill)
import '../../mathquillSetup';

import './RichTextEditor.css';

// Make katex available globally for Quill's formula blot
window.katex = katex;

// Build the enableMathQuill function once at module level
const enableMathQuill = mathquill4quill({ Quill, katex });

// Operator buttons shown in the MathQuill toolbar
const MQ_OPERATORS = [
    ['\\frac{x}{y}',    '\\frac'],
    ['\\sqrt{x}',       '\\sqrt'],
    ['\\sqrt[n]{x}',    '\\nthroot'],
    ['x^{n}',           '^'],
    ['x_{n}',           '_'],
    ['\\pm',            '\\pm'],
    ['\\times',         '\\times'],
    ['\\div',           '\\div'],
    ['\\leq',           '\\leq'],
    ['\\geq',           '\\geq'],
    ['\\neq',           '\\neq'],
    ['x^\\circ',        '^{\\circ}'],
    ['\\pi',            '\\pi'],
    ['\\infty',         '\\infty'],
];

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['formula'],
        ['clean'],
    ],
};

const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'formula'];

// Helper to normalize corrupted degree LaTeX before Quill reads data-value
const sanitizeFormulaValues = (html) => {
    if (!html || typeof html !== 'string') return html;
    return html.replace(/data-value="([^"]*)"/g, (_, formula) => {
        const cleaned = formula.replace(/\^c\s*irc\b/g, '^{\\circ}').replace(/\^circ\b/g, '^{\\circ}');
        return `data-value="${cleaned}"`;
    });
};

/**
 * RichTextEditor
 * A Quill-based rich text editor with MathQuill visual formula input.
 *
 * Props:
 *   value       – controlled HTML string
 *   onChange    – (html) => void
 *   placeholder – optional placeholder text
 */
const RichTextEditor = ({ value, onChange, placeholder }) => {
    const quillRef = useRef(null);
    const mqEnabled = useRef(false);

    useEffect(() => {
        if (quillRef.current && !mqEnabled.current) {
            const quill = quillRef.current.getEditor();
            enableMathQuill(quill, {
                operators: MQ_OPERATORS,
                displayHistory: true,
            });
            mqEnabled.current = true;
        }
    }, []);

    const safeValue = sanitizeFormulaValues(value);

    return (
        <div className="rich-text-editor">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={safeValue}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Type your question here. Click Σ to insert a math formula visually.'}
            />
        </div>
    );
};

export default RichTextEditor;
