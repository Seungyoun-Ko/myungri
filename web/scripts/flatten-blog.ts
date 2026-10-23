// 빌드 뒤 정리
// 1) dist/blog/{id}.html → dist/{id}.html : 티스토리 때와 같은 주소(/196)로 글이 열리게 합니다.
//    Cloudflare Pages는 /196 요청에 196.html을 보여 줍니다.
// 2) dist/_redirects : 합쳐진 글의 옛 주소와 티스토리 모바일 주소(/m/196)를 새 주소로 넘깁니다.
import { existsSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';

const dir = 'dist/blog';
let n = 0;
if (existsSync(dir)) {
  for (const f of readdirSync(dir)) {
    if (/^\d+\.html$/.test(f)) {
      renameSync(`${dir}/${f}`, `dist/${f}`);
      n++;
    }
  }
}
const lines = [
  '# 블로그 주소 넘기기 (scripts/flatten-blog.ts가 만듦)',
  ...(existsSync('blog/redirects.txt') ? readFileSync('blog/redirects.txt', 'utf8').split('\n').filter(Boolean) : []),
  '/m/:id /:id 301',
];
const prev = existsSync('dist/_redirects') ? readFileSync('dist/_redirects', 'utf8') + '\n' : '';
writeFileSync('dist/_redirects', prev + lines.join('\n') + '\n');
console.log('blog posts moved to site root:', n, '· redirects:', lines.length - 2);
