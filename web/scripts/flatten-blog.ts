// 빌드 뒤: dist/blog/{id}.html → dist/{id}.html
// 티스토리 때와 같은 주소(/196)로 글이 열리게 합니다. Cloudflare Pages는 /196 요청에 196.html을 보여 줍니다.
import { existsSync, readdirSync, renameSync } from 'node:fs';

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
console.log('blog posts moved to site root:', n);
