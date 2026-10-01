## Summary

<!-- What does this PR change, and why? -->

## Test plan

<!-- How did you verify it? -->

## Checklist

- [ ] `npm run lint`, `npm run typecheck` and `npm test` pass locally
- [ ] New database changes are a migration (`npm run db:migration <name>`) with RLS policies
- [ ] `types/database.ts` regenerated (`npm run db:types`) if the schema changed
- [ ] Migrations are backwards-compatible with the currently deployed code
