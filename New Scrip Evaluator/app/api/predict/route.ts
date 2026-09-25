import {NextResponse} from 'next/server';
import OpenAI from 'openai';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime='nodejs';
export const dynamic='force-dynamic';

function number(v:unknown,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback}
function list(v:unknown){return Array.isArray(v)?v.filter(x=>typeof x==='string').slice(0,8):[]}

export async function POST(req:Request){
  try{
    const b=await req.json();
    if(typeof b.show!=='string'||typeof b.script!=='string'||!b.script.trim())return NextResponse.json({error:'Show and promo script are required.'},{status:400});
    const key=process.env.OPENROUTER_API_KEY?.trim()||process.env.OPENAI_API_KEY?.trim();
    if(!key)return NextResponse.json({error:'No API key found in server variables.'},{status:500});
    const training=await fs.readFile(path.join(process.cwd(),'data','performance-training.json'),'utf8');
    const model=(process.env.OPENROUTER_MODEL||process.env.OPENAI_MODEL||'gpt-4o-mini').trim();
    const baseURL=(process.env.OPENROUTER_API_KEY?process.env.OPENROUTER_BASE_URL:process.env.OPENAI_BASE_URL)?.trim();
    const client=new OpenAI({apiKey:key,...(baseURL?{baseURL}:{})});
    const prompt=`Predict Meta performance for this PocketFM promo. CPI is cost per install in INR; lower is better. Activation % is the percentage of installs that enter the app and listen to this show for at least 53 minutes; higher is better. Use the historical anchors for the same show first. Use the supplied evaluator scores, source fidelity and actual script content. Do not claim certainty: creative performance also depends on media buying, audience, placement, bid, spend, fatigue and measurement windows. Return JSON only in this exact shape: {"estimatedCpi":number,"cpiRange":[number,number],"estimatedActivation":number,"activationRange":[number,number],"confidence":"High|Medium|Low","drivers":[string],"methodology":string}. Ranges must be realistic and contain the estimate.\n\nSHOW: ${b.show}\n\nHISTORICAL META ANCHORS:\n${training}\n\nEVALUATOR OUTPUT:\n${JSON.stringify(b.evaluation||{})}\n\nPROMO SCRIPT:\n${b.script}${b.second?`\n\nSECOND PROMO:\n${b.second}`:''}`;
    const out=await client.chat.completions.create({model,messages:[{role:'system',content:'You are a conservative performance analyst. Historical KPI anchors are empirical observations, not deterministic rules.'},{role:'user',content:prompt}],temperature:0,seed:42,max_tokens:2500,response_format:{type:'json_object'}});
    const raw=JSON.parse(out.choices[0].message.content||'{}');
    const cpi=number(raw.estimatedCpi??raw.predictedCpi??raw.cpi);
    const activation=Math.max(0,Math.min(100,number(raw.estimatedActivation??raw.predictedActivation??raw.activation)));
    const range=(v:unknown,estimate:number)=>Array.isArray(v)&&v.length>=2?v.slice(0,2).map(Number).sort((a,b)=>a-b):[estimate*.8,estimate*1.2];
    return NextResponse.json({estimatedCpi:Number(cpi.toFixed(2)),cpiRange:range(raw.cpiRange,cpi),estimatedActivation:Number(activation.toFixed(2)),activationRange:range(raw.activationRange,activation).map((x:number)=>Math.max(0,Math.min(100,x))),confidence:['High','Medium','Low'].includes(raw.confidence)?raw.confidence:'Low',drivers:list(raw.drivers),methodology:typeof raw.methodology==='string'?raw.methodology:'Historical same-show KPI anchors plus script content and evaluator scores.'});
  }catch(e){console.error('prediction_error',e instanceof Error?e.message:'unknown');return NextResponse.json({error:'Performance prediction is unavailable.'},{status:500})}
}
