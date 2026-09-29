import tempfile
import unittest
from pathlib import Path
from check_links import validate

class LinkTests(unittest.TestCase):
    def check(self, home, detail='<h1 id="section">Detail</h1>'):
        with tempfile.TemporaryDirectory(prefix="sudo-link-test-") as folder:
            root = Path(folder)
            (root / 'index.html').write_text(home, encoding='utf-8')
            (root / 'detail.html').write_text(detail, encoding='utf-8')
            return validate(root)[1]
    def test_existing_destination_and_fragment(self):
        self.assertEqual(self.check('<a href="detail.html#section">Open</a>'), [])
    def test_missing_file(self):
        self.assertTrue(self.check('<a href="absent.html">Open</a>'))
    def test_missing_fragment(self):
        self.assertTrue(self.check('<a href="detail.html#absent">Open</a>'))
    def test_empty_and_unsafe_destinations(self):
        for href in ['', '#', 'javascript:alert(1)', 'mailto:', 'tel:']:
            self.assertTrue(self.check(f'<a href="{href}">Open</a>'))
    def test_external_links_are_not_sent_requests(self):
        self.assertEqual(self.check('<a href="https://example.invalid/">External</a>'), [])

if __name__ == '__main__':
    unittest.main()
