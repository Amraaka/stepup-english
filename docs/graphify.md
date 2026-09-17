# Code graph (Graphify)

[Graphify](https://github.com/Graphify-Labs/graphify) maps the app code, ADRs and plans into a knowledge graph. Code is parsed locally with tree-sitter; no LLM or API key is used.

- Output: `graphify-out/` (git-ignored): `graph.json`, `graph.html`, `GRAPH_REPORT.md`.
- Scope: `.graphifyignore` leaves out `.claude/`, `video/`, `post/`, `scripts/` and `public/`.
- Obsidian: exported to the vault's `english-platform/70-Code-Graph/` (see the vault note "Graphify - code graph").

Refresh after code changes (Graphify is installed from a local clone at `~/SideProjects/others/graphify`):

```bash
G=~/SideProjects/others/graphify/.venv/bin/graphify
$G update .
$G export obsidian --dir "$HOME/Documents/Obsidian Vault/english-platform/70-Code-Graph"
```

Query without reading files: `$G query "…"`, `$G path A B`, `$G explain X`.
