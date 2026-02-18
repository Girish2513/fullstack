# Release Process

## What is a Release
A release is a labeled snapshot of the project at a stable point.

## Why Releases Matter
- Track stable versions
- Share deployable builds
- Maintain project history
- Enable rollback if needed

## My Release Steps
1. Ensure working tree is clean
2. Confirm all changes committed
3. Create tag
   git tag v0.1.0
4. Push tag
   git push origin v0.1.0
5. Create release on GitHub with description

## Version Naming
Format:
vMAJOR.MINOR.PATCH

Example:
v0.1.0

## Rule
Only stable code should be released.
