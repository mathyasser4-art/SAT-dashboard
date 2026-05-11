from pathlib import Path
import re

api_dirs = [
    Path(r"c:\Users\hp\Desktop\SAT\SAT-dashboard-master\SAT-dashboard-master\dashboard-main\src\api"),
    Path(r"c:\Users\hp\Desktop\SAT\SAT-dashboard-master\SAT-dashboard-master\dashboard-main\dashboard-main\src\api")
]

for api_dir in api_dirs:
    if not api_dir.exists():
        print(f"Directory not found: {api_dir}")
        continue
    for file_path in api_dir.glob('*.js'):
        text = file_path.read_text(encoding='utf-8')
        new_text = text
        new_text = re.sub(r"const\s+(?:Token|token)\s*=\s*localStorage\.getItem\('O_authDB'\);?\s*\n", "", new_text)
        new_text = re.sub(r"(['\"]authorization['\"]\s*:\s*)`pracYas09\$\{[^}]+\}`\s*,?", r"\1", new_text)
        new_text = re.sub(r"headers\.authorization\s*=\s*`pracYas09\$\{[^}]+\}`\s*\n", "", new_text)
        new_text = re.sub(r"\.\.\.\(token\s*\?\s*\{\s*authorization\s*:\s*`pracYas09\$\{[^}]+\}`\s*\}\s*:\s*\{\s*\}\)", "", new_text)
        # clean up potential empty trailing commas after header object
        new_text = re.sub(r",\s*\n(\s*\})", r"\n\1", new_text)

        if new_text != text:
            file_path.write_text(new_text, encoding='utf-8')
            print(f"Updated {file_path}")
