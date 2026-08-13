(()=>{
'use strict';
const LABEL='360問版';
async function exportData(){
 try{
  if(typeof exportBackup!=='function')throw new Error('本体のバックアップ機能を読み込めませんでした。');
  await exportBackup();
 }catch(e){alert('バックアップに失敗しました: '+(e.message||e));}
}
async function importData(file){
 try{
  if(typeof importBackup!=='function')throw new Error('本体の復元機能を読み込めませんでした。');
  await importBackup({target:{files:[file]}});
 }catch(e){alert('バックアップの読み込みに失敗しました: '+(e.message||e));}
}
function mount(){
 if(document.getElementById('backup-tools'))return;
 const host=document.createElement('div');host.id='backup-tools';document.body.appendChild(host);const s=host.attachShadow({mode:'open'});
 s.innerHTML=`<style>:host{all:initial}.fab{position:fixed;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:2147483646;border:0;border-radius:999px;background:#123a5a;color:#fff;padding:11px 15px;font:700 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 6px 22px #0003}.bd{display:none;position:fixed;inset:0;z-index:2147483647;background:#0a192378;align-items:flex-end;justify-content:center;padding:16px}.bd.open{display:flex}.p{width:min(520px,100%);background:#fff;color:#17313f;border-radius:20px;padding:20px;font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.p h2{margin:0 0 6px;font-size:18px}.p p{margin:0 0 14px;color:#607383}.row{display:grid;gap:9px}.btn{border:1px solid #d3dfe5;border-radius:12px;background:#f7fafb;padding:11px;font-weight:700;text-align:center;color:#17313f}.primary{background:#087c78;color:#fff}.close{margin-top:10px;width:100%;border:0;background:transparent;padding:9px;color:#607383;font-weight:700}input{display:none}</style><button class="fab">バックアップ</button><div class="bd"><div class="p"><h2>${LABEL}｜バックアップ</h2><p>360問版本体のIndexedDB対応バックアップ機能を使用します。</p><div class="row"><button class="btn primary ex">JSONを書き出す</button><label class="btn">JSONを読み込む<input class="fi" type="file" accept="application/json,.json"></label></div><button class="close">閉じる</button></div></div>`;
 const b=s.querySelector('.bd');s.querySelector('.fab').onclick=()=>b.classList.add('open');s.querySelector('.close').onclick=()=>b.classList.remove('open');b.onclick=e=>{if(e.target===b)b.classList.remove('open')};s.querySelector('.ex').onclick=exportData;s.querySelector('.fi').onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)importData(f);e.target.value='';};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,250));else setTimeout(mount,250);
})();