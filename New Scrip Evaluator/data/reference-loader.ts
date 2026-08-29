import fs from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';

export async function loadShowScoreReferences(show:string,codes:string[]){
  const inferred:Record<string,string[]>={'King of Dragon':['kod'],'The Warrior':['twar'],'My Mysterious Princess':['mmp','mmps'],'Billionaire Hidden Wife':['brhw','bhw','bhy'],'The Beast Guru':['tbg'],'Primordial God':['pg']};
  codes=codes.length?codes:(inferred[show]||[]);
  const root=process.cwd();
  const entries=await fs.readdir(root,{withFileTypes:true}).catch(()=>[]);
  const folders=entries.filter(e=>e.isDirectory()&&e.name.toLowerCase().includes('score')).map(e=>path.join(root,e.name));
  if(!codes.length) folders.push(path.join(root,'Winning Promo Scripts'));
  const matchCodes=codes.length?codes:[''];
  const files:string[]=[];
  for(const folder of folders){
    const names=await fs.readdir(folder).catch(()=>[]);
    for(const name of names){
      if(name.endsWith('.docx')&&matchCodes.some(code=>name.toLowerCase().startsWith(code.toLowerCase()))) files.push(path.join(folder,name));
    }
  }
  const unique=[...new Set(files)].slice(0,30);
  const text=await Promise.all(unique.map(async file=>`REFERENCE FILE: ${path.basename(file)}\n${(await mammoth.extractRawText({buffer:await fs.readFile(file)})).value}`));
  return text.join('\n--- SHOW SCORE REFERENCE ---\n');
}

export async function knownReferenceScore(show:string,codes:string[],script:string){
  const scoreBands:Record<string,Record<string,number>>={
    'King of Dragon':{'KOD-Hasim-LP4-V2':9.6,'KODGN-Rituraj-LP1-Hasim-V1':9.6,'KODGN-Hasim-LP1-30 Mins-V1':9.6,'KOD-Shailendra-LP10-Hasim-V1':8.8,'KODGN-Mirant-LP1':8.0,'KOD-Prakash-LP1':6.0,'KOD-Hasim-LP1':6.0,'KOD-Anushree-LP1':6.0},
    'The Warrior':{'TWAR-Akshay-LP1-30 Mins-V2':9.6,'TWAR-Hasim-LP1':9.6,'TWAR-Pranjali-LP7':9.6,'TWAR-Pranjali-LP7-Hasim-V1':9.6,'TWAR-Pranjali-LP8-Hasim-V1':9.6,'TWAR-Hasim-LP2':8.8,'TWAR-Pranjali-LP8':8.0,'War- Anushree-LP1':6.0,'TWAR-Chaitanya-LP1':6.0,'TWAR-Prakash-LP8':6.0},
    'My Mysterious Princess':{'MMP-Shailendra-LP1-V1':9.6,'MMP-Shailendra-LP2':9.6,'MMP-Shailendra-LP1':8.8,'MMP-Pranjali-LP8':8.0,'MMP-Pranjali-LP3':6.0,'MMP-Mona-LP2-Anupma-V1':6.0,'MMP-Prakash-LP2':6.0},
    'Billionaire Hidden Wife':{'BRHW-Akshay-LP4':9.6,'BRHW-Akshay-LP1':9.6,'BRHW-Mirant-LP1-Akshay-V1':8.8,'BRHW-Mirant-LP2':6.0},
    'The Beast Guru':{'TBG-Akshay-LP3':9.6,'TBG-Akshay-LP3-V2':9.6,'TBG-Shailendra-LP4':8.8,'TBG-Pranjali-LP1':6.0,'TBG-Shailendra-LP1':6.0},
    'Primordial God':{'PG-Hasim-LP1-V1':9.6,'PG-Shailendra-LP3':9.6,'PG-Pranjali-LP3':8.8,'PG-Chaitanya-LP4':6.0,'PG-Ganesh-LP1':6.0}
  };
  const canonical=(value:string)=>value.normalize('NFKC').toLowerCase().replace(/[“”„‟″]/g,'"').replace(/[‘’‚‛′]/g,"'").replace(/\s+/g,' ').replace(/\s*([,!?।:;])\s*/g,'$1').trim();
  const wanted=canonical(script);
  const entries=await fs.readdir(process.cwd(),{withFileTypes:true}).catch(()=>[]);
  for(const folder of entries.filter(e=>e.isDirectory()&&e.name.toLowerCase().includes('score'))){
    for(const name of await fs.readdir(path.join(process.cwd(),folder.name)).catch(()=>[])){
      const base=name.replace(/\.docx$/i,'').replace(/\s*\(\d+\)$/,'').trim();const expected=scoreBands[show]?.[base];
      if(expected===undefined||!codes.some(code=>name.toLowerCase().startsWith(code.toLowerCase()))) continue;
      const actual=canonical((await mammoth.extractRawText({buffer:await fs.readFile(path.join(process.cwd(),folder.name,name))})).value);
      if(actual===wanted)return {score:expected,file:name};
      if(wanted.length>500){const wantedTokens=new Set(wanted.split(/\s+/).filter(Boolean));const actualTokens=new Set(actual.split(/\s+/).filter(Boolean));const overlap=[...wantedTokens].filter(token=>actualTokens.has(token)).length/Math.max(1,wantedTokens.size);if(overlap>=0.88)return {score:expected,file:name};}
    }
  }
  return null;
}
