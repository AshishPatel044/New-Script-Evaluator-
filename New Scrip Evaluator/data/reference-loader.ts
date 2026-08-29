import fs from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';

export async function loadShowScoreReferences(show:string,codes:string[]){
  const inferred:Record<string,string[]>={'King of Dragon':['kod'],'The Warrior':['twar'],'My Mysterious Princess':['mmp','mmps'],'Billionaire Hidden Wife':['brhw','bhw','bhy'],'The Beast Guru':['tbg'],'Primordial God':['pg']};
  codes=codes.length?codes:(inferred[show]||[]);
  const root=process.cwd();
  const entries=await fs.readdir(root,{withFileTypes:true}).catch(()=>[]);
  const folders=entries.filter(e=>e.isDirectory()&&e.name.toLowerCase().includes('score')).map(e=>path.join(root,e.name));
  const files:string[]=[];
  for(const folder of folders){
    const names=await fs.readdir(folder).catch(()=>[]);
    for(const name of names){
      if(name.endsWith('.docx')&&codes.some(code=>name.toLowerCase().startsWith(code.toLowerCase()))) files.push(path.join(folder,name));
    }
  }
  const unique=[...new Set(files)].slice(0,30);
  const text=await Promise.all(unique.map(async file=>`REFERENCE FILE: ${path.basename(file)}\n${(await mammoth.extractRawText({buffer:await fs.readFile(file)})).value}`));
  return text.join('\n--- SHOW SCORE REFERENCE ---\n');
}
