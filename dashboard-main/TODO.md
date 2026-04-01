# Restore Login Functionality Task

## Status: In Progress

### Approved Plan Steps:
1. [x] Create this TODO.md with breakdown
2. [x] Update src/App.js: remove bypass, add isAuth from localStorage, add /login route, protect other routes with auth guards
3. [x] Update src/components/navbar/Navbar.js: conditional logout button based on token
4. [x] Update TODO.md mark steps 2-3 complete
5. [] Test: execute 'npm start' (or instruct manual), verify login required, works with real credentials
6. [] Git: checkout -b blackboxai/restore-login, add ., git commit -m "Restore login: add auth guards, login route, remove bypass"
7. [] Check gh CLI: if not, install; gh pr create --title "Restore login functionality" --body "Brings back username/password login"
8. [] attempt_completion

## Previous Task (Fix APIs/Console): From old TODO, assume complete

