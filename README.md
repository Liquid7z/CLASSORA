# CLASSORA v0.8.1 — Academic Distribution

This release removes the native `better-sqlite3` dependency from the demo so it works with Node 24 and Next.js 15 without native SQLite module resolution/crash issues.

## Important

If you previously had a CLASSORA folder that contained `lib/db.ts` with:

```ts
import Database from "better-sqlite3";
```

replace that project with this release or replace the old `lib/db.ts` with the compatibility layer included here. Also remove the old build cache before starting:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
npm run dev
```

The current demo stores academic distribution metadata through `lib/academic.ts` and JSON-backed local storage, not SQLite.
