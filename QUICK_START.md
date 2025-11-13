# Quick Start Guide for Claude Code

## For the Human User

### Step 1: Create GitHub Repository
1. Go to GitHub and create a new repository named `cosmic-clicker`
2. Initialize with a README (you'll replace it)
3. Clone the repository to your local machine

### Step 2: Add Project Files
Copy these files from this project plan into your repository:
- `README.md`
- `GAME_DESIGN.md`
- `TASKS.md`
- `CLAUDE_CODE_INSTRUCTIONS.md`
- `QUICK_START.md` (this file)

Commit and push to GitHub:
```bash
git add .
git commit -m "docs: add project plan and task breakdown"
git push origin main
```

### Step 3: Start Claude Code for Web
1. Navigate to the Claude Code interface
2. Connect your GitHub repository `[your-username]/cosmic-clicker`
3. Provide this initial prompt:

```
I want you to build the Cosmic Clicker incremental game following the comprehensive plan in this repository.

Read and understand these files first:
1. README.md - Project overview
2. GAME_DESIGN.md - Game mechanics and balancing
3. TASKS.md - All development tasks with acceptance criteria
4. CLAUDE_CODE_INSTRUCTIONS.md - Development guidelines

Then proceed to:
1. Complete Phase 1 tasks (project setup) first
2. Work through each phase systematically
3. Create sub-agents to parallelize work where appropriate
4. Ensure all tests pass before moving to next task
5. Maintain >80% code coverage throughout

Start with Task 1.1: Initialize Project. Let me know when you're ready to begin and confirm you understand the full scope.
```

### Step 4: Monitor Progress
Claude Code will:
- Break down tasks and create sub-agents as needed
- Execute tasks sequentially per phase
- Run tests after each implementation
- Commit changes with descriptive messages
- Report progress and any blockers

### Step 5: Review and Test
Once complete:
- Clone the repository locally
- Run `npm install`
- Run `npm run dev` to play the game
- Run `npm test` to verify all tests pass
- Run `npm run build` to verify production build works

## For Claude Code

### Initial Steps

1. **Read Documentation First**
   - Start by reading all markdown files in the repository
   - Understand the complete scope before starting
   - Ask clarifying questions if anything is ambiguous

2. **Create Work Plan**
   - Review all 44 tasks in TASKS.md
   - Identify tasks that can be parallelized
   - Estimate realistic timeline
   - Plan sub-agent delegation strategy

3. **Begin Implementation**
   - Start with Task 1.1 (Initialize Project)
   - Follow CLAUDE_CODE_INSTRUCTIONS.md guidelines
   - Complete each task's acceptance criteria before moving on
   - Commit after each completed task

### Task Execution Template

For each task, follow this workflow:

```
1. Read task description and acceptance criteria
2. Plan implementation approach
3. Write code following guidelines
4. Write tests (aim for >80% coverage)
5. Run tests - verify all pass
6. Run linter - fix any issues
7. Write/update documentation
8. Commit with conventional commit message
9. Mark task complete in TASKS.md (add ✅)
10. Move to next task
```

### Parallelization Strategy

Suggested sub-agent assignments:

**Agent 1 - Infrastructure Lead**
- Phase 1: Project setup, testing config
- Phase 8: Build optimization, CI/CD

**Agent 2 - Core Logic Specialist**
- Phase 2: All game logic and calculations
- Heavy testing focus

**Agent 3 - State Management**
- Phase 3: Context, reducer, game loop
- Critical for project success

**Agent 4 - UI Foundation**
- Phase 4: Base components, layout

**Agent 5 - Game Components**
- Phase 5: Game-specific UI (clicker, buildings, upgrades)

**Agent 6 - Polish & Effects**
- Phase 6: Integration, animations, visual effects

**Agent 7 - Documentation**
- Continuous: Maintain docs throughout
- Phase 7: Testing, final documentation

### Critical Success Factors

1. **Don't skip tests** - They catch issues early
2. **Follow TypeScript strictly** - No `any` types
3. **Test game balance** - Ensure it's fun to play
4. **Performance matters** - Maintain 60 FPS
5. **Accessibility counts** - Make it usable for everyone

### Reporting Template

After completing each phase, report:

```markdown
## Phase [X] Complete

### Completed Tasks
- [✅] Task X.1: Description
- [✅] Task X.2: Description
- [✅] Task X.3: Description

### Test Coverage
- Unit Tests: XX%
- Integration Tests: X tests passing
- E2E Tests: X scenarios covered

### Issues/Notes
- [Any challenges faced]
- [Decisions made]
- [Items needing human review]

### Next Steps
- Moving to Phase [X+1]
- Focus: [Brief description]
```

### When Things Go Wrong

If you encounter issues:

1. **Test Failures**
   - Review error messages carefully
   - Check type definitions
   - Verify mock data structure
   - Isolate the failing unit

2. **Build Errors**
   - Check import paths
   - Verify all dependencies installed
   - Check TypeScript configuration
   - Clear cache and rebuild

3. **Performance Issues**
   - Profile with React DevTools
   - Check for infinite loops
   - Verify game loop efficiency
   - Add memoization

4. **Design Ambiguities**
   - Note in comments
   - Make reasonable decision
   - Flag for human review
   - Document reasoning

### Quality Gates

Before marking any task complete:

- [ ] Code compiles with no TypeScript errors
- [ ] All tests pass
- [ ] Code coverage >80% for new code
- [ ] ESLint shows no errors
- [ ] Code is formatted
- [ ] JSDoc comments added
- [ ] Acceptance criteria met
- [ ] Changes committed

### Completion Criteria

Project is complete when:

- [ ] All 44 tasks marked complete (✅)
- [ ] All tests passing (unit + integration + E2E)
- [ ] Code coverage >80%
- [ ] Game is playable end-to-end
- [ ] Production build succeeds
- [ ] Documentation is complete
- [ ] No console errors
- [ ] Performance targets met (60 FPS, <200KB)
- [ ] Accessibility audit passes
- [ ] Deployed and accessible

### Resource Files

You'll need to create:
- **Icons**: Use SVGs for buildings, upgrades, achievements (can use heroicons or lucide)
- **Images**: Background, clickable object (can use CSS gradients or simple SVGs)
- **Sounds** (optional): Click sounds, purchase sounds, achievement sounds

Keep assets minimal and use CSS/SVG for most visuals.

## Estimated Timeline

- **Phase 1 (Setup)**: 1-2 hours
- **Phase 2 (Core Logic)**: 2-3 hours
- **Phase 3 (State)**: 2 hours
- **Phase 4 (UI Base)**: 2-3 hours
- **Phase 5 (Game UI)**: 4-5 hours
- **Phase 6 (Integration)**: 3-4 hours
- **Phase 7 (Testing)**: 4-5 hours
- **Phase 8 (Deployment)**: 1-2 hours
- **Phase 9 (Polish)**: 3-4 hours

**Total**: ~25-30 hours with proper parallelization

## Tips for Success

1. **Read everything first** - Don't jump straight into coding
2. **Test as you go** - Don't leave testing until the end
3. **Commit frequently** - Small, atomic commits
4. **Document decisions** - Future you (or humans) will appreciate it
5. **Ask questions** - Better to clarify than assume
6. **Play the game** - Test it yourself periodically
7. **Stay organized** - Keep track of what's done
8. **Performance matters** - Profile early and often

## Need Help?

If stuck for more than 30 minutes on a task:
1. Create a detailed issue describing the problem
2. Include error messages, attempted solutions
3. Tag for human review
4. Move to another task if possible (return later)

## Final Note

This is a complex, real-world project. Take your time, follow best practices, and build something you're proud of. The detailed planning is there to help you succeed - use it!

When complete, you'll have built a polished, tested, documented incremental game from scratch. That's impressive! 🚀

**Remember**: Quality > Speed. A well-tested, maintainable codebase is worth more than rushing to "done."

Good luck! You've got this! 💪
