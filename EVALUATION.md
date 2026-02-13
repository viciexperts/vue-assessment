# Evaluation Guide

This document outlines how we evaluate assessment submissions.

## Evaluation Criteria

### 1. Code Quality (30%)

**What we look for:**
- Clean, readable, and maintainable code
- Consistent coding style and formatting
- Proper component organization and structure
- Meaningful variable and function names
- Appropriate use of comments (not over-commented)
- Following Vue 3 Composition API best practices

**Red flags:**
- Inconsistent formatting
- Magic numbers or strings
- Deeply nested conditionals
- Copy-paste code without refactoring
- Large, monolithic components

### 2. Functionality (25%)

**What we look for:**
- All required features working correctly
- Proper error handling (network errors, validation, etc.)
- Edge cases handled (empty states, loading states, errors)
- Form validation working as expected
- Navigation flows smoothly

**Red flags:**
- Missing error handling
- Crashes on edge cases
- Forms accepting invalid data
- Broken navigation or routing

### 3. UI/UX (20%)

**What we look for:**
- Responsive design (mobile, tablet, desktop)
- Intuitive user experience
- Proper loading states (skeletons, spinners, etc.)
- Clear error messages
- Smooth transitions and interactions
- Visual polish and attention to detail

**Red flags:**
- Not responsive or broken on mobile
- Poor loading state handling
- Confusing navigation
- Unclear error messages

### 4. Accessibility (15%)

**What we look for:**
- Semantic HTML elements
- Proper ARIA attributes where needed
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Sufficient color contrast

**Red flags:**
- Missing labels on form inputs
- No keyboard navigation
- Poor focus indicators
- Using divs instead of semantic elements

### 5. Performance (10%)

**What we look for:**
- Fast load times
- Efficient rendering (no unnecessary re-renders)
- Proper use of Vue's reactivity system
- Lazy loading where appropriate
- Optimized API calls (caching, debouncing, etc.)

**Red flags:**
- Unnecessary API calls
- Performance issues with large lists
- No code splitting
- Memory leaks

## Scoring Scale

- **Excellent (90-100%)**: Production-ready code, exceeds requirements, shows senior-level thinking
- **Good (70-89%)**: Solid implementation, meets all requirements, minor improvements possible
- **Acceptable (50-69%)**: Functional but needs refactoring, missing some requirements
- **Needs Work (<50%)**: Missing critical features, major issues with code quality

## Bonus Points

Candidates who complete bonus tasks or demonstrate:
- Advanced Vue 3 patterns (provide/reject, composables)
- Excellent testing coverage
- Creative solutions to complex problems
- Attention to detail beyond requirements
- Clear documentation

## Review Process

1. **Initial Review**: We check if all required tasks are completed
2. **Code Review**: We examine code structure, patterns, and quality
3. **Functionality Test**: We test all features manually
4. **Accessibility Audit**: We check for accessibility issues
5. **Performance Check**: We assess performance considerations

## Feedback Provided

Candidates receive feedback on:
- Strengths of their submission
- Areas for improvement
- Specific code suggestions
- Overall assessment score

## Questions?

If you have questions about the evaluation process, feel free to ask during or after the assessment.
