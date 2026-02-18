## When Do Conflicts Happen?
Merge conflicts occur when two branches change the same part of a file and Git isn’t sure which version should be kept. Since it can’t decide automatically, it asks you to step in and resolve it.

## How I Usually Resolve Them
1. When I run into a conflict, I follow this approach:
2. Run the merge command.
3. Check which files have conflicts using git status.
4. Open those files and look for the highlighted conflict markers.
5. Read both versions carefully to understand the differences.
6. Decide what the final content should be (sometimes combining both).
7. Remove the conflict markers.
8. Stage the fixed file.
9. Commit the resolution.
