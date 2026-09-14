#!/usr/bin/env python3
"""Rebuild post/index.html — a contact sheet of every rendered post with its caption."""
import pathlib, re, html
root = pathlib.Path(__file__).resolve().parent.parent
days = sorted(d for d in root.iterdir() if d.is_dir() and re.match(r'20\d\d-', d.name))
sec = []
for d in days:
    caps = (d/'captions.md').read_text() if (d/'captions.md').exists() else ''
    parts = re.split(r'\n## ', caps)
    cards = []
    for png in sorted(d.glob('*.png')):
        slug = png.stem; cap = ''
        for p in parts:
            if slug in p or slug.split('-', 2)[-1] in p:
                m = re.search(r'\*\*Caption\*\*\s*(.*?)\n\*\*Hashtags\*\*\s*(.*?)\n\*\*Story idea\*\*\s*(.*?)(?:\n---|\Z)', p, re.S)
                if m: cap = f"<p>{html.escape(m.group(1).strip()).replace(chr(10),'<br>')}</p><p class=h>{html.escape(m.group(2).strip())}</p><p class=s><b>Story:</b> {html.escape(m.group(3).strip())}</p>"
                break
        t = re.match(r'(\d)-(\d{2})(\d{2})-(.*)', slug)
        label = f"{t.group(2)}:{t.group(3)} · {t.group(4)}" if t else slug
        cards.append(f'<figure><img src="{d.name}/{png.name}" loading=lazy><figcaption><b>{label}</b>{cap}</figcaption></figure>')
    sec.append(f'<section><h2>{d.name}</h2><div class=row>{"".join(cards)}</div></section>')
page = f'''<!doctype html><html lang="mn"><head><meta charset="utf-8"><title>StepUp — 10 хоногийн постууд</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap">
<style>body{{margin:0;padding:32px 40px 80px;background:#ececf0;font-family:Manrope,system-ui;color:#1a1a1f}}h1{{font-size:1.8rem;letter-spacing:-.02em;margin:0 0 4px}}.lead{{color:#62626c;margin:0 0 28px}}
h2{{font-size:1.1rem;margin:36px 0 12px;letter-spacing:.04em}}.row{{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:24px}}
figure{{margin:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.1)}}img{{width:100%;display:block}}
figcaption{{padding:14px 16px 18px;font-size:.85rem;line-height:1.5}}figcaption b{{display:block;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:#c8361b;margin-bottom:6px}}
figcaption p{{margin:8px 0;white-space:pre-wrap}}.h{{color:#62626c;font-size:.78rem}}.s{{color:#62626c;font-size:.8rem;border-top:1px solid #eee;padding-top:8px}}</style></head><body>
<h1>StepUp English — 10 хоног, 30 пост</h1><p class=lead>2026-09-15 → 09-24 · 08:00 хадгалах · 12:30 оролцох · 20:30 хуваалцах. Пост бүрийн доор caption, hashtag, Story санаа.</p>
{"".join(sec)}</body></html>'''
(root/'index.html').write_text(page)
print('index:', sum(len(list(d.glob('*.png'))) for d in days), 'posts')
