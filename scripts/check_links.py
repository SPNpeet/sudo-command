"""Validate local references in the generated site; never request external services."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import sys

BASE = "https://spnpeet.github.io/sudo-command/"
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.refs, self.ids = [], set()
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        for key in ("src", "href"):
            if key in attributes and tag in ("a", "img", "script", "link"):
                self.refs.append((tag, attributes[key] or ""))

def validate(root):
    root = Path(root).resolve()
    pages = {p: Page(p.read_text(encoding="utf-8")) for p in root.rglob("*.html")}
    failures, count = [], 0
    for page, document in pages.items():
        current = BASE + page.relative_to(root).as_posix()
        for tag, ref in document.refs:
            label = str(page.relative_to(root)) + ": " + ref
            if not ref.strip() or ref == "#":
                failures.append(label + " (empty destination)")
                continue
            parsed = urlparse(urljoin(current, ref))
            if parsed.scheme not in ("https", "mailto", "tel", "data"):
                failures.append(label + " (unsupported/insecure scheme)")
                continue
            if parsed.scheme in ("mailto", "tel") and not parsed.path:
                failures.append(label + " (missing contact destination)")
            if parsed.netloc != "spnpeet.github.io" or not parsed.path.startswith("/sudo-command/"):
                continue
            count += 1
            target = (root / unquote(parsed.path[len("/sudo-command/"):])).resolve()
            if not target.is_relative_to(root):
                failures.append(label + " (outside site root)")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                failures.append(label + " (missing file)")
            # Homepage fragment targets are mounted by React and tested in the browser.
            elif parsed.fragment and target in pages and target != root / "index.html" and unquote(parsed.fragment) not in pages[target].ids:
                failures.append(label + " (missing fragment)")
    return count, failures

if __name__ == "__main__":
    count, failures = validate(sys.argv[1] if len(sys.argv) > 1 else "dist")
    for failure in failures:
        print(failure, file=sys.stderr)
    print(f"Checked {count} local references; {len(failures)} failures.")
    raise SystemExit(bool(failures))
