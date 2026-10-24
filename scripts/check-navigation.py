"""Check generated document links and assets at root and GitHub Pages paths."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


ROUTES = {
    "index.html": {"languages/index.html"},
    "languages/index.html": {"fr/library/index.html", "es/library/index.html", "index.html"},
    "fr/library/index.html": {"languages/index.html", "index.html"},
    "es/library/index.html": {"languages/index.html", "index.html"},
}


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {"src", "href"} and value:
                self.references.append((tag, key, value))


def check(directory):
    root = Path(directory).resolve()
    checked = 0
    for page, expected_links in ROUTES.items():
        source = root / page
        if not source.is_file():
            raise ValueError(f"Missing document: {page}")
        parser = References()
        parser.feed(source.read_text(encoding="utf-8"))
        for prefix in ("/", "/Polylit/"):
            links = set()
            for tag, key, reference in parser.references:
                url = urlsplit(reference)
                if url.scheme or url.netloc:
                    continue  # External links are outside this offline check.
                resolved = urlsplit(urljoin(f"https://navigation.test{prefix}{page}", reference))
                path = unquote(resolved.path)
                if not path.startswith(prefix):
                    raise ValueError(f"{page}: link escapes deployment prefix: {reference}")
                target = (root / path[len(prefix):]).resolve()
                if target.is_dir():
                    target /= "index.html"
                if not target.is_relative_to(root) or not target.is_file():
                    raise ValueError(f"{page}: missing or unsafe target: {reference}")
                if tag == "a" and key == "href":
                    links.add(target.relative_to(root).as_posix())
                checked += 1
            missing = expected_links - links
            if missing:
                raise ValueError(f"{page}: missing navigation links: {sorted(missing)}")
    return {"status": "passed", "directory": str(directory), "documents": len(ROUTES),
            "prefixes": ["/", "/Polylit/"], "referencesChecked": checked}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", default="build")
    args = parser.parse_args()
    try:
        print(json.dumps(check(args.directory)))
    except (ValueError, OSError) as error:
        raise SystemExit(f"Navigation check failed: {error}")
