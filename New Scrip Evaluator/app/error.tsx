'use client';

export default function Error({reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <main style={{padding:'48px',fontFamily:'sans-serif'}}><h1>Report could not be displayed</h1><p>The evaluation response was incomplete. Please try again.</p><button onClick={reset}>Try again</button></main>;
}
