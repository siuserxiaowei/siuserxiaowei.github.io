#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
github_blob="https://github.com/siuserxiaowei/spark-meetup-deep-dive/blob/main"

# render_page <report.md> <template.html> <output.html>
render_page() {
  local report="$1" template="$2" output="$3"
  local page_body
  page_body="$(mktemp)"

  sed '1,2d' "$report" | pandoc \
    --from=gfm \
    --to=html5 \
    --wrap=none > "$page_body"

  {
    sed -n '1,/<!-- REPORT_CONTENT -->/p' "$template"
    sed \
      -e "s#href=\"modules/entity_factcheck.md\"#href=\"${github_blob}/modules/entity_factcheck.md\"#g" \
      -e "s#href=\"modules/timeline.md\"#href=\"${github_blob}/modules/timeline.md\"#g" \
      -e "s#href=\"modules/strategy_research.md\"#href=\"${github_blob}/modules/strategy_research.md\"#g" \
      -e "s#href=\"modules/dao-fa-shu-qi-shi.md\"#href=\"${github_blob}/modules/dao-fa-shu-qi-shi.md\"#g" \
      -e "s#href=\"research/source_gap_backlog.md\"#href=\"${github_blob}/research/source_gap_backlog.md\"#g" \
      -e "s#href=\"research/evidence_cards.tsv\"#href=\"${github_blob}/research/evidence_cards.tsv\"#g" \
      "$page_body"
    sed -n '/<!-- REPORT_CONTENT -->/,$p' "$template" | tail -n +2
  } > "$output"

  rm -f "$page_body"
  printf 'Built %s\n' "$output"
}

render_page "$project_root/REPORT.md" "$project_root/site/template.html" "$project_root/index.html"

mkdir -p "$project_root/en"
render_page "$project_root/REPORT.en.md" "$project_root/site/template.en.html" "$project_root/en/index.html"
