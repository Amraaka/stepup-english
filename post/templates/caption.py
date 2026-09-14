#!/usr/bin/env python3
"""Print caption + hashtags for a post slug: caption.py 2026-09-15 1-0800-zugeer"""
import re,sys,pathlib
d,slug=sys.argv[1],sys.argv[2]
caps=pathlib.Path(f'post/{d}/captions.md').read_text()
for p in re.split(r'\n## ',caps):
    if slug in p:
        m=re.search(r'\*\*Caption\*\*\s*(.*?)\n\*\*Hashtags\*\*\s*(.*?)\n\*\*Story',p,re.S)
        print(m.group(1).strip()+"\n\n"+m.group(2).strip()); break
