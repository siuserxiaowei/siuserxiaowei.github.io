from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
out=root/"_pages_output"
assert not out.exists(), "Use a clean output directory"
out.mkdir()
skip={".git",".github","projects","public-media","site-tools","_pages_output"}
for p in root.iterdir():
 if p.name in skip or p.name.startswith(".") and p.name!=".nojekyll":continue
 if p.is_dir():shutil.copytree(p,out/p.name)
 else:shutil.copy2(p,out/p.name)
size=sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
assert size<950_000_000, f"Published site exceeds the size budget: {size}"
print(f"Staged {size:,} bytes of public pages")
