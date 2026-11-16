# Fintel for Gemini CLI

Connect [Gemini CLI](https://geminicli.com/) to [Fintel](https://fintel.io) for stock,
fund, public manager and macroeconomic research. This native Gemini extension
bundles the remote Fintel MCP connector and 28 on-demand Agent Skills, with the
same skill content and evaluation references as the Claude and OpenAI packages.

## Requirements

- Gemini CLI **0.68.0 or later** (the version used for validation).
- A Fintel account and browser access for OAuth sign-in. Available tools, data and
  API credits depend on that account's permissions and entitlements.
- Network access to `https://mcp.fintel.io` and `https://fintel.io`, and a local
  loopback callback for sign-in.

The extension uses the existing hosted MCP server. Installation requires no npm
build, local server, API key, Google Cloud service account or client secret.
Gemini CLI itself must be installed and authenticated separately.

## Install locally

From this repository:

```sh
gemini extensions install .
```

For development, link the working directory instead of installing a copy:

```sh
gemini extensions link .
```

Restart Gemini CLI after installing, linking or changing the extension. In an
interactive Gemini session, check discovery and sign in:

```text
/extensions list
/mcp auth fintel
/mcp list
/skills list
```

Gemini may initiate authentication automatically. Complete the Fintel login and
consent page in your browser. The consent label is **An app on this computer**:
loopback callbacks do not prove which native app is requesting access.

Gemini discovers Fintel's authorization server, dynamically registers a public
client, and uses authorization-code OAuth with S256 PKCE. The default callback is
`http://localhost:<random-port>/oauth/callback`, covered by Fintel's existing
loopback callback rules. Tokens are managed by Gemini CLI outside this repository.
Revoke Fintel authorization at https://fintel.io/oauth/connections.

## Install from GitHub

Once this repository is published at the URL below:

```sh
gemini extensions install https://github.com/FintelVentures/fintel-gemini
```

Update a GitHub installation, then restart Gemini CLI:

```sh
gemini extensions update fintel-gemini
```

To remove the extension:

```sh
gemini extensions uninstall fintel-gemini
```

## Try it

- "Use Fintel to find Apple's US-listed common stock and show its latest available price, currency and timestamp."
- "Prepare a Fintel earnings preview for US:NVDA, including consensus and the previous two reported quarters."
- "Assess US:GME's short-squeeze setup using Fintel short interest, borrowing conditions and price/volume evidence."
- "Compare US:MSFT with its Fintel curated peers using consistent valuation and growth measures."
- "Design, but do not execute or save, a screen for dividend-paying US common stocks with strong cash coverage."

Gemini activates the relevant skill on demand and may ask you to approve skill
activation or tool calls. The extension preserves those host controls.

## Bundled skills

Version **0.3.1** matches the portable Claude/OpenAI skill release, including all
ten R1 investment-question workflows. Each skill documents its evidence,
coverage limits and applicable evaluation cases.

### Established workflows

- [`fintel-research`](skills/fintel-research/SKILL.md): Answer focused stock, fund, financial-data or Fintel account questions using the live MCP tool catalog. Use for lookups and general research when no specialist workflow fits; prefer specialist skills for a full assessment.
- [`fintel-stock-discovery`](skills/fintel-stock-discovery/SKILL.md): Find research candidates from Fintel leaderboards and rankings, including squeeze candidates, yield leaders and market movers. Use for ranked shortlists; use screen-builder to design and execute custom screens and specialist assessments to investigate one returned stock.
- [`fintel-investment-thesis`](skills/fintel-investment-thesis/SKILL.md): Build a sourced investment thesis for one company with supporting and contradicting evidence, catalysts, risks, assumptions and invalidation conditions. Use for a deep dive or investment case rather than a narrow metric or specialist assessment.
- [`fintel-earnings-review`](skills/fintel-earnings-review/SKILL.md): Review reported earnings results, actual versus estimated figures, supported period comparisons and open questions. Use after results; use earnings-preview before an announcement and earnings-quality-review for profit-to-cash analysis.
- [`fintel-bull-bear`](skills/fintel-bull-bear/SKILL.md): Stress-test a stock thesis with the strongest supported bull and bear cases, shared assumptions, conflicting evidence and observations that would settle disagreements. Use when the user requests both sides or challenges an existing view.
- [`fintel-catalyst-calendar`](skills/fintel-catalyst-calendar/SKILL.md): Build a dated calendar of upcoming earnings, dividends and supported biotech events for one company, preserving estimated windows and coverage gaps. Use for timing; use earnings-preview or biotech-event-due-diligence for deeper event analysis.
- [`fintel-watchlist-triage`](skills/fintel-watchlist-triage/SKILL.md): Review a signed-in user's Fintel stock list using list-level filings, insider and ownership evidence to prioritize names for investigation or monitoring. Use for private watchlist triage; this does not edit lists or review a public manager portfolio.
- [`fintel-claim-audit`](skills/fintel-claim-audit/SKILL.md): Check financial claims in supplied text or a discussion against cited evidence and available Fintel observations. Identify unsupported, stale, conflicting or unverifiable claims and citation mismatches without manufacturing outside support.
- [`fintel-scenario-analysis`](skills/fintel-scenario-analysis/SKILL.md): Frame conditional upside, base and downside outcomes for a company or event with a common horizon, explicit assumptions, triggers and invalidation conditions. Use for what-if analysis; use valuation-expectations or dilution-and-runway for their dedicated calculations.

### Specialist assessments

- [`fintel-analyst-expectations-review`](skills/fintel-analyst-expectations-review/SKILL.md): Reconcile analyst price targets, rating distributions, fiscal-period forecasts and estimate dispersion for one stock. Use for consensus and disagreement analysis; this surface cannot establish historical earnings-estimate revisions without comparable snapshots.
- [`fintel-biotech-event-due-diligence`](skills/fintel-biotech-event-due-diligence/SKILL.md): Assess trial evidence, success conditions and risks for a published biotech catalyst. Use for event due diligence rather than a calendar lookup, an invented pipeline or individual medical advice.
- [`fintel-dilution-and-runway`](skills/fintel-dilution-and-runway/SKILL.md): Assess cash runway, funding needs and possible dilution before company milestones using dated financial statements and explicit burn scenarios. Use for liquidity research rather than a generic cash balance lookup.
- [`fintel-dividend-sustainability`](skills/fintel-dividend-sustainability/SKILL.md): Assess whether a company can support its dividend using payment history, payout coverage and leverage. Use for dividend safety or cut-risk research rather than yield rankings or ex-dividend dates.
- [`fintel-earnings-preview`](skills/fintel-earnings-preview/SKILL.md): Prepare for a company earnings announcement using its calendar, period-specific consensus, historical surprises and price reactions. Use before results; use earnings-review after results and earnings-quality-review for profit-to-cash analysis.
- [`fintel-earnings-quality-review`](skills/fintel-earnings-quality-review/SKILL.md): Assess whether a company's reported profits translate into operating cash and free cash flow using comparable financial statements and deterministic ratios. Use for earnings quality rather than a beat/miss recap or unsupported accounting allegations.
- [`fintel-fund-holdings-review`](skills/fintel-fund-holdings-review/SKILL.md): Review a resolved ETF or supported fund's disclosed NPORT holdings, concentrations, asset/country/currency allocations and reported flows. Use for public fund composition; bounded delayed holdings cannot establish full overlap or live exposure.
- [`fintel-insider-signal-review`](skills/fintel-insider-signal-review/SKILL.md): Assess the strength of reported insider activity for one company, including transaction types, clusters, timing and alternative explanations. Use to interpret insider signals rather than merely retrieve trades.
- [`fintel-institutional-positioning`](skills/fintel-institutional-positioning/SKILL.md): Assess disclosed institutional accumulation, distribution, concentration and reporting lag for one stock. Use to interpret positioning rather than just list holders or examine one manager's portfolio.
- [`fintel-manager-portfolio-review`](skills/fintel-manager-portfolio-review/SKILL.md): Compare one investment manager's latest two disclosed 13F portfolios using amendment-aware changes and concentration evidence. Use for a public manager portfolio; this does not read the user's private portfolio or establish current trades or performance.
- [`fintel-options-positioning-review`](skills/fintel-options-positioning-review/SKILL.md): Reconcile one stock's options flow, expiration positioning, implied volatility and gamma evidence. Use for options positioning around an event rather than one metric, a leaderboard or an execution strategy.
- [`fintel-screen-builder`](skills/fintel-screen-builder/SKILL.md): Design, validate and execute custom stock screens with Fintel Workbench. Use for compound filters, formulas, rankings, historical screening, backtests and user-requested saved screens; use stock-discovery for existing leaderboard shortlists.
- [`fintel-short-squeeze-assessment`](skills/fintel-short-squeeze-assessment/SKILL.md): Assess whether one named stock has a supported short-squeeze setup using short interest, borrowing conditions and price/volume evidence. Use for squeeze due diligence rather than a candidate leaderboard or a single short-interest lookup.
- [`fintel-valuation-expectations`](skills/fintel-valuation-expectations/SKILL.md): Calculate revenue growth implied by a stock's valuation under explicit terminal-multiple, horizon and discount assumptions. Use for reverse valuation rather than a price target or a full DCF.

- [`fintel-technical-analysis`](skills/fintel-technical-analysis/SKILL.md): Describe intraday OHLCV, session VWAP and compatible benchmark comparisons. IEX volume is sampled; historical signal testing is deferred.

### First packaged investment-question release

New portable workflows:

- [`fintel-company-briefing`](skills/fintel-company-briefing/SKILL.md): business, valuation, growth, financial strength, ownership and events with dated evidence.
- [`fintel-peer-comparison`](skills/fintel-peer-comparison/SKILL.md): curated peers with consistent growth, profitability and valuation measures.
- [`fintel-unusual-options-investigation`](skills/fintel-unusual-options-investigation/SKILL.md): flagged trades and same-window context with alternative explanations.
- [`fintel-watchlist-briefing`](skills/fintel-watchlist-briefing/SKILL.md): dated developments across a requested saved list or supplied universe, without unsolicited changes.

## Evidence and account boundaries

Use the connected tool catalog to discover capabilities; a package version does
not establish that matching server tools are deployed or included in an account.
Required tool failures, denied access, stale observations and empty datasets must
remain explicit gaps. Preserve citations, financial periods, currencies, units,
reporting lags and truncation metadata. Research does not authorize account edits
or brokerage trades. Saving lists, alerts, notebooks or screen definitions needs
explicit user intent; executing a requested screen creates a private expiring
receipt without saving a definition.

The shared skills use canonical `fintel.*` tool names. `GEMINI.md` explains how to
match these to Gemini's actual exposed tool names without changing portable
instructions. These skills guide Gemini's analysis; they do not enforce the
server-side Fintel agent's deterministic evidence gates.

## Extension layout and standards

- `gemini-extension.json`: root Gemini manifest, SemVer version and the `fintel`
  MCP server. Gemini CLI 0.68.0 uses `url` with `type: "http"` for Streamable HTTP;
  its validator deprecates the older `httpUrl` spelling still shown in some docs.
- `GEMINI.md`: concise startup context for tool discovery and research boundaries.
- `skills/<name>/SKILL.md`: Gemini-discovered Agent Skills with matching names and
  single-line YAML descriptions, plus contained `references/` resources.
- `scripts/validate.mjs`: distribution, reference and optional source parity checks.
- `.github/workflows/validate.yml`: pinned Gemini CLI manifest and skill validation.

OAuth uses server discovery. Do not embed tokens, client credentials or copied
personal Gemini settings, or enable automatic tool trust. This package needs no
hooks, shell commands, policy overrides or provider-specific wrapper manifests.

Official references:
[extension format](https://geminicli.com/docs/extensions/reference/),
[Agent Skills](https://geminicli.com/docs/cli/skills/),
[MCP and OAuth](https://geminicli.com/docs/tools/mcp-server/),
[release and gallery requirements](https://geminicli.com/docs/extensions/releasing/).

## Maintaining and validating

Run from this repository:

```sh
node scripts/validate.mjs
gemini extensions validate .
```

The portable skill source is currently
`../fintel-api/integrations/openai-plugin/skills`; keep Gemini and Claude skill
files byte-for-byte identical, including their evaluation references. Copy
reviewed updates into `skills/` and check both sources before release:

```sh
node scripts/validate.mjs --skills-source ../fintel-api/integrations/openai-plugin/skills
node scripts/validate.mjs --skills-source ../fintel-claude/skills
```

Run the native Gemini skill validator (also run by CI):

```sh
validator="$(npm root --global)/@google/gemini-cli/bundle/builtin/skill-creator/scripts/validate_skill.cjs"
for skill in skills/*; do
  node "$validator" "$PWD/$skill" || exit 1
done
```

Keep the manifest version in sync with the portable release when importing its
skills; bump it for Gemini-specific fixes too. The version currently starts at
0.3.1 to identify parity with the existing packages. Server behavior and OAuth
implementation belong in the application repositories, not this extension.
Deploying server changes requires the normal application rollout and restart;
updating this extension requires a Gemini session restart.

Packaging checks do not prove authenticated tool discovery or model behavior.
Before publishing, complete browser sign-in, confirm the `fintel` tools and all
28 extension skills are discovered, and run the first read-only example above.
Check citations, currency and the returned observation timestamp; distinguish
latest available from live data. Exercise the adjacent evaluation cases for
changed workflows. Never commit OAuth tokens or account output as test fixtures.

## Publishing

Keep `gemini-extension.json` at the repository root. After review and an explicitly
requested push, users can install directly from the GitHub URL. A public
repository with the GitHub topic **gemini-cli-extension** is eligible for automatic
Gemini gallery discovery. Publishing source does not establish a gallery listing
or a successful authenticated evaluation. If using a GitHub release, match its
`v0.3.1` tag to the manifest version; custom release archives must put the manifest
at the archive root. No platform-specific binaries are needed.

## Troubleshooting

If `fintel` does not appear, restart Gemini and inspect `/extensions list`. A
`fintel` MCP definition in personal or workspace `settings.json` takes precedence
over the extension; check it for an old endpoint or transport configuration.
If authentication is required, use `/mcp auth fintel`. Sign-in needs browser and
local callback access; an SSH session or container needs an appropriate browser
and callback route. If skills are missing, inspect `/skills list all`; user or
workspace skills with the same names override extension skills. An authenticated
connection can still have limited coverage or missing entitlements.

## Support and license

help@fintel.io · https://fintel.io · [Terms](https://fintel.io/terms) ·
[Privacy](https://fintel.io/privacy)

MIT; see [LICENSE](LICENSE).
