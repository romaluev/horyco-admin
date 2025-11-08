You are implementing a new feature based on provided documentation. Follow this systematic approach:f

**1. DOCUMENTATION ANALYSIS**
Read the feature docs thoroughly. What's the core functionality? What are the edge cases? Note any specific requirements, constraints, or dependencies mentioned.

**2. CODEBASE RECONNAISSANCE**
Before writing anything new:
- Search for similar existing features or patterns
- Identify reusable components, utilities, and functions
- Check current project structure and naming conventions
- Look for related tests to understand expected behavior
- Find where this feature logically fits in the architecture

**3. DEPENDENCY MAPPING**
What already exists that you can leverage?
- Existing UI components
- Shared utilities or helpers
- State management patterns
- API integrations or data fetching logic
- Validation schemas
- Similar feature implementations

**4. IMPLEMENTATION PLANNING**
Create a clear plan:
- Break down into logical steps
- Identify files to create vs. modify
- Note any potential conflicts or breaking changes
- Consider backwards compatibility
- Plan for error handling and loading states

**5. CODE CONSISTENCY**
Match existing patterns:
- Follow established coding style
- Use same naming conventions
- Replicate folder structure logic
- Maintain consistent error handling
- Follow existing testing patterns

**6. IMPLEMENTATION**
Write the code incrementally:
- Start with core functionality
- Reuse existing components aggressively
- Add proper error handling
- Include relevant comments for complex logic
- Consider performance implications

**7. VALIDATION**
After implementation:
- Does it fulfill all documentation requirements?
- Are you reusing code effectively?
- Does it follow project conventions?
- Are edge cases handled?
- Would tests cover the main scenarios?

Ask clarifying questions if documentation is ambiguous, it's always better to implement the func correct in the first go rather then fixing it after finishing. Flag potential issues early. Always prioritize code reuse over reinvention.

Now here is the users input: $ARGUMENTS
