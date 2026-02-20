# Copilot Instructions Update Summary

**Date:** December 12, 2025  
**File Updated:** `.github/copilot-instructions.md`  
**Lines Added:** ~500 lines (from 121 to 619 lines)

## Summary

Analyzed the DEVELOPMENT_PLAN.md and all prompt documents (P14-P68) to identify additional rules needed for the Space Invaders project. Added comprehensive project-specific guidelines to the `.github/copilot-instructions.md` file without removing any existing rules.

## Sections Added

### 1. Code Quality Requirements

**ZERO TOLERANCE FOR CODE DUPLICATION - Hard Rule**
- Mandatory, non-negotiable requirement
- Code duplication is a review blocker
- 7 anti-duplication strategies with code examples:
  1. Extract Utility Functions
  2. Create Shared Services
  3. Use Composition
  4. Leverage Inheritance
  5. Constants for Repeated Values
  6. Generic Functions
  7. Higher-Order Functions

### 2. Space Invaders Project Rules

#### Architecture Patterns
- Service-Based Architecture
- Separation of Concerns (Services, Components, Models, Utils)
- File Organization (Backend and Frontend structure)

#### Naming Conventions
- Files: `<name>.service.ts`, `<name>.component.ts`, `<name>.model.ts`, etc.
- Classes/Interfaces: PascalCase
- Functions/Methods: camelCase with verb-first naming
- Constants: UPPER_SNAKE_CASE

#### Angular-Specific Rules
- Component Lifecycle (unsubscribe, cleanup)
- State Management (RxJS BehaviorSubjects, observables)
- Performance (OnPush, trackBy, debouncing)

#### Game Development Best Practices
- Frame-Independent Movement (deltaTime usage)
- Entity Management (object pooling, inactive entities)
- Collision Detection (spatial partitioning, AABB)
- Game Loop (update/render separation, requestAnimationFrame)

### 3. Error Handling
- Backend (Node.js): try-catch, meaningful errors, status codes
- Frontend (Angular): catchError, user-friendly messages, retry logic
- Validation: client and server validation, sanitization

### 4. Testing Requirements
- Unit Tests: isolation, mocking, coverage
- Integration Tests: service interactions, API endpoints
- E2E Tests: critical user journeys
- Test Naming: descriptive names, describe blocks

### 5. Performance Standards

**Mandatory Targets:**
- 60 FPS during gameplay
- Memory usage < 200MB
- Page load time < 3 seconds
- Input latency < 50ms
- No memory leaks

**Optimization Strategies:**
- Profile before optimizing
- Object pooling for projectiles
- Spatial partitioning for collision detection
- Batch canvas draw calls
- Minimize DOM manipulation

### 6. Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**
- ARIA labels on all interactive elements
- Keyboard navigation
- Logical tab order
- Visible focus indicators
- Color contrast ratio ≥ 4.5:1
- Screen reader announcements

**Implementation:**
- Semantic HTML
- Keyboard shortcuts (P for pause, Escape for menu)
- Screen reader testing

### 7. Security Requirements

**Input Validation:**
- Validate player names (1-20 chars, alphanumeric)
- Sanitize user input (prevent XSS)
- Validate scores (no impossible scores)
- Rate limit API endpoints

**Backend Security:**
- Helmet.js for security headers
- CORS configuration
- express-rate-limit
- Never trust client-side data
- Anti-cheat validation (duration/score relationships)

**Frontend Security:**
- Sanitize HTML rendering
- Angular's XSS protection
- No sensitive data in localStorage
- HTTPS in production

### 8. Documentation Standards

**Code Documentation:**
- JSDoc/TSDoc for all public methods
- Parameter and return types
- Document complex algorithms
- Explain non-obvious decisions

**API Documentation:**
- Swagger/OpenAPI for REST APIs
- Document endpoints, parameters, responses
- Include example requests/responses
- Document error codes

**Project Documentation:**
- README with setup instructions
- CHANGELOG for version history
- CONTRIBUTING guide
- Architecture diagrams
- User guide for gameplay

### 9. Git Workflow

**Commit Messages:**
- Conventional commits format
- Format: `type(scope): description`
- Types: feat, fix, test, refactor, docs, style, chore

**Branch Strategy:**
- `main` - production-ready code
- `develop` - integration branch
- `feature/<name>` - new features
- `fix/<name>` - bug fixes
- `test/<name>` - test additions

**Pull Requests:**
- Link to related issue/prompt number
- Include test coverage report
- Verify all tests pass
- Request code review
- Squash commits before merging

### 10. Prompt-Driven Development

**Following Prompts:**
- Complete prompts sequentially (P14 → P15 → P16...)
- Don't skip ahead
- Each prompt 100% complete before moving on
- Mark complete only when all acceptance criteria met

**Acceptance Criteria Checklist:**
- All tests pass (100% pass rate)
- Test coverage meets target (aim for 100%)
- Code follows all style/architecture guidelines
- No code duplication
- Documentation complete
- Performance targets met
- Accessibility requirements satisfied
- Security validation passes
- Code review approved

**Verification Steps:**
- Run full test suite: `npm test`
- Check coverage: `npm run test:coverage`
- Verify no linting errors: `npm run lint`
- Manual testing
- Performance profiling (Chrome DevTools)
- Accessibility audit (aXe or Lighthouse)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

### 11. Common Pitfalls to Avoid

**Memory Leaks:**
- Forgetting to unsubscribe from observables
- Not cleaning up event listeners
- Accumulating inactive entities
- Creating new objects every frame

**Performance Issues:**
- Complex calculations every frame
- Not using deltaTime for movement
- Inefficient collision detection (N² complexity)
- Excessive DOM manipulation
- Not using object pooling

**State Management:**
- Mutating state directly
- Exposing BehaviorSubjects instead of observables
- Not handling race conditions
- Sharing mutable state

**Testing Mistakes:**
- Testing implementation details instead of behavior
- Not mocking dependencies properly
- Incomplete test coverage
- Tests that depend on execution order
- Not cleaning up after tests

**Angular-Specific:**
- Using `subscribe()` without unsubscribing
- Mutating `@Input()` properties
- Heavy logic in templates/getters
- Not using `OnPush` change detection
- Circular dependencies between services

### 12. TypeScript Best Practices

**Type Safety:**
- Avoid `any` type - use `unknown` or proper types
- Define interfaces for all data structures
- Use union types for finite sets
- Enable strict mode in tsconfig.json
- Use type guards for narrowing types

**Modern TypeScript Features:**
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Utility types (`Partial`, `Pick`, `Omit`, `Record`)
- `const` assertions for literal types
- Proper generics for reusable code
- `readonly` for immutable properties

**Enums and Constants:**
- Use `const enum` for compile-time constants
- Prefer string enums over numeric
- Group related constants in const objects
- Export constants from dedicated file

### 13. Code Review Checklist

Comprehensive checklist covering:
- **Correctness:** Tests pass, coverage, acceptance criteria, edge cases, **ZERO duplication**
- **Architecture:** Business logic in services, SRP, proper DI, no circular deps, **no duplicated code**
- **Code Quality:** No linting errors, strict mode, meaningful names, **no copy-pasted code**
- **Testing:** TDD approach, all paths tested, edge cases, proper mocks
- **Performance:** No leaks, 60 FPS, efficient algorithms, object pooling
- **Accessibility:** ARIA labels, keyboard nav, focus indicators, contrast, screen reader
- **Security:** Input validation, XSS protection, rate limiting, CORS
- **Documentation:** JSDoc comments, README, API docs, explanations
- **Git:** Conventional commits, branch naming, no conflicts, atomic commits

### 14. Final Reminders

10 core principles summarizing the entire rule set:
1. TDD is mandatory
2. Zero duplication
3. Services for logic
4. Test everything
5. Profile performance
6. Accessibility matters
7. Security first
8. Document as you go
9. Follow prompts sequentially
10. Code review yourself

## Key Improvements

### Enforced Best Practices
- **Zero tolerance for code duplication** - Now a hard rule with review blocker status
- **Strict TDD workflow** - Tests first, always, no exceptions
- **Service-based architecture** - Clear separation of concerns
- **Performance targets** - 60 FPS, < 200MB memory, < 3s load time
- **Accessibility compliance** - WCAG 2.1 AA mandatory
- **Security requirements** - Input validation, XSS prevention, rate limiting

### Space Invaders Specific
- **Game development best practices** - deltaTime, object pooling, spatial partitioning
- **Angular-specific rules** - Lifecycle management, state management, performance
- **Prompt-driven development** - Sequential completion, acceptance criteria, verification steps
- **Testing requirements** - Unit, integration, E2E with specific coverage targets
- **File organization** - Clear structure for frontend/backend

### Developer Support
- **Anti-duplication strategies** - 7 concrete strategies with code examples
- **Common pitfalls** - Memory leaks, performance issues, state management, testing mistakes
- **TypeScript best practices** - Type safety, modern features, enums/constants
- **Code review checklist** - Comprehensive checklist covering all aspects
- **Verification steps** - Concrete commands to run for validation

## Files Updated

1. **`.github/copilot-instructions.md`** - Main instructions file
   - Original: 121 lines
   - Updated: 619 lines
   - Added: ~500 lines of comprehensive rules

## Benefits

1. **Consistency:** All developers follow same standards
2. **Quality:** High code quality enforced through rules
3. **Security:** Security best practices mandatory
4. **Performance:** Performance targets enforced
5. **Accessibility:** WCAG 2.1 AA compliance enforced
6. **Maintainability:** No code duplication, clear architecture
7. **Documentation:** Complete documentation standards
8. **Testing:** Comprehensive testing requirements
9. **Process:** Clear prompt-driven development workflow
10. **Review:** Objective code review checklist

## Next Steps

1. ✅ Copilot instructions updated with comprehensive rules
2. ✅ All existing rules preserved
3. ✅ Project-specific guidelines added
4. ✅ Zero duplication policy enforced
5. ✅ TDD workflow reinforced
6. ✅ Performance, accessibility, and security requirements added
7. ✅ Code review checklist provided
8. ✅ Anti-duplication strategies documented

## Verification

The copilot-instructions.md file has been verified to contain:
- ✓ All original TDD rules (preserved)
- ✓ All original documentation structure rules (preserved)
- ✓ All original review philosophy rules (preserved)
- ✓ New code duplication policy (hard rule)
- ✓ New Space Invaders project rules
- ✓ New game development best practices
- ✓ New Angular-specific rules
- ✓ New performance standards
- ✓ New accessibility requirements
- ✓ New security requirements
- ✓ New testing requirements
- ✓ New documentation standards
- ✓ New Git workflow
- ✓ New prompt-driven development process
- ✓ New common pitfalls section
- ✓ New TypeScript best practices
- ✓ New code review checklist
- ✓ New final reminders

## Conclusion

The `.github/copilot-instructions.md` file now contains a comprehensive set of rules that will guide all future development on the Space Invaders project. These rules ensure:

- **High quality code** through TDD and zero duplication
- **Consistent architecture** through service-based design
- **Excellent performance** through mandatory targets and optimization strategies
- **Full accessibility** through WCAG 2.1 AA compliance
- **Strong security** through validation and sanitization
- **Complete testing** through unit, integration, and E2E tests
- **Clear documentation** through JSDoc and comprehensive guides
- **Smooth workflow** through prompt-driven development and Git best practices

All rules are enforced as requirements, not suggestions, to maintain the highest standards throughout the project.
