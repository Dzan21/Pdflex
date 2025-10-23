#!/usr/bin/env bash
set -euo pipefail

git checkout -B audit/initial

mkdir -p audit-report

npx -y depcheck > audit-report/depcheck.txt || true

node <<'JS'
const fs=require('fs'),p='src/app';
function walk(d){return fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(d+'/'+x.name):[[d,x.name].join('/')]):[];}
const files=walk(p).filter(f=>/page\.(tsx|jsx)$/.test(f));
fs.writeFileSync('audit-report/pages.txt',files.join('\n')||'');
JS

node <<'JS'
const fs=require('fs');const d='src/components';
function walk(p){return fs.existsSync(p)?fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[[p,e.name].join('/')]):[];}
const all=walk(d).filter(f=>/\.(tsx|jsx)$/.test(f));
fs.writeFileSync('audit-report/components-all.txt',all.join('\n')||'');
JS

npx -y ripgrep -n --glob '!node_modules' --glob '!audit-report' "from ['\"][^'\"]+['\"]" src > audit-report/imports-rg.txt || true

node <<'JS'
const fs=require('fs');
const rg=fs.existsSync('audit-report/imports-rg.txt')?fs.readFileSync('audit-report/imports-rg.txt','utf8'):'';
const comps=fs.existsSync('audit-report/components-all.txt')?fs.readFileSync('audit-report/components-all.txt','utf8').split('\n').filter(Boolean):[];
const used=new Set();
rg.split('\n').forEach(l=>{const m=l.match(/from ['"]([^'"]+)['"]/); if(m) used.add(m[1]);});
const maybe=comps.filter(p=>{const name=p.replace(/^src\//,'').replace(/\.(tsx|jsx)$/,''); return ![...used].some(u=>u.endsWith(name)||u.includes(name));});
fs.writeFileSync('audit-report/components-maybe-unused.txt',maybe.join('\n')||'');
JS

du -hd 2 | sort -hr > audit-report/size-tree.txt 2>/dev/null || true

npx -y ripgrep -n --glob '!node_modules' --glob '!audit-report' --iglob '*.css' ':[ ]?root|--[a-zA-Z0-9\-]+' src public > audit-report/css-vars.txt || true

printf "# PDFlex Audit Artifacts\nGenerated: %s\n" "$(date -u +'%Y-%m-%d %H:%M:%S UTC')" > audit-report/README.md

git add audit-report
git commit -m "chore(audit): initial artifacts"
git push -u origin audit/initial
