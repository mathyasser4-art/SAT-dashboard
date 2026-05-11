# Fix "old text editor" issue - TipTap not rendering (missing deps/runtime)

## Approved Plan Breakdown:
**Goal:** Install deps, verify TipTap renders modern editor with toolbar.

1. [ ] Install TipTap dependencies in nested project (cd SAT-dashboard-master/dashboard-main/dashboard-main && npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder)
2. [ ] Minor improvement: Add fallback/loading message to TipTapEditor if !editor
3. [ ] Update TODO.md after installs
4. [ ] Test: npm start, navigate to AddQuestion, confirm toolbar visible (Bold/Italic/Σ buttons)
5. [ ] Hard refresh browser (Ctrl+Shift+R), check console for errors

**Active project:** SAT-dashboard-master/dashboard-main/dashboard-main (nested)

Next: Execute install command.

