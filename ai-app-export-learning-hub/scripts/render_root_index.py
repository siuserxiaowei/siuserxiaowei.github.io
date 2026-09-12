#!/usr/bin/env python3
"""Render the root homepage from site/index.html.

The public root URL must be a real homepage, not a visible redirect shim. This
script keeps the root page mechanically synced with the compatibility page in
site/index.html while rewriting relative paths for the repository root.
"""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE_INDEX = ROOT / "site/index.html"
ROOT_INDEX = ROOT / "index.html"


REPLACEMENTS = [
    ('href="styles.css"', 'href="site/styles.css"'),
    ('href="../docs/', 'href="docs/'),
    ('href="../data/', 'href="data/'),
    ('href="../LICENSE.html"', 'href="LICENSE.html"'),
    ('href="privacy.html"', 'href="site/privacy.html"'),
    ('href="terms.html"', 'href="site/terms.html"'),
    ('src="content.js"', 'src="site/content.js"'),
    ('src="content-advanced-cards.js"', 'src="site/content-advanced-cards.js"'),
    ('src="content-web-extra.js"', 'src="site/content-web-extra.js"'),
    ('src="content-toolkits.js"', 'src="site/content-toolkits.js"'),
    ('src="app.js"', 'src="site/app.js"'),
    ('src="google-ads-config.js"', 'src="site/google-ads-config.js"'),
    ('src="tracking.js"', 'src="site/tracking.js"'),
]


def render_root_index() -> None:
    html = SITE_INDEX.read_text(encoding="utf-8")
    for source, target in REPLACEMENTS:
        html = html.replace(source, target)

    html = html.replace(
        '<script src="site/app.js"></script>',
        '<script src="site/root-paths.js"></script>\n  <script src="site/app.js"></script>',
    )

    forbidden = [
        'http-equiv="refresh"',
        "正在打开",
        'href="../docs/',
        'href="../data/',
        'src="content.js"',
        'src="app.js"',
        'href="privacy.html"',
        'href="terms.html"',
    ]
    leftovers = [item for item in forbidden if item in html]
    if leftovers:
        raise SystemExit(f"Root index still contains invalid redirect/path fragments: {leftovers}")

    ROOT_INDEX.write_text(html, encoding="utf-8")
    print("Rendered root index.html from site/index.html")


if __name__ == "__main__":
    render_root_index()
