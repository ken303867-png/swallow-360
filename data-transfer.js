(()=>{
'use strict';
const FORMAT='swallow-study-transfer-v1';
const p=location.pathname.toLowerCase();
let APP_ID='';
let APP_LABEL='';
if(p.includes('swallow-cloze-614')){APP_ID='swallow-cloze-614';APP_LABEL='正文化穴抜き614版';}
else if(p.includes('swallow-scale')||p.includes('/scale/')){APP_ID='swallow-scale';APP_LABEL='評価尺度50問版';}
else if(p.includes('swallow-360')||p.includes('/360/')){APP_ID='swallow-360';APP_LABEL='360問版';}
if(!APP_ID)return;
const RESTORE_KEY='__oai_transfer_restore__'+APP_ID;
const snapshot=()=>{const entries=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!=null)entries.push([k,localStorage.getItem(k)]);}return entries;};
const packageData=()=>({format:FORMAT,appId:APP_ID,appLabel:APP_LABEL,exportedAt:new Date().toISOString(),source:{origin:location.origin,path:location.pathname,standalone:matchMedia('(display-mode: standalone)').matches||navigator.standalone===true},entries:snapshot()});
const stamp=()=>new Date().toISOString().replace(/[:.]/g,'-');
async function exportData(){
 const data=packageData();
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const file=new File([blob],`${APP_ID}-learning-data-${stamp()}.json`,{type:'application/json'});
 try{
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({title:`${APP_LABEL} 学習データ`,files:[file]});return;}
 }catch(e){if(e&&e.name==='AbortError')return;console.warn(e);}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
 alert(`学習データを書き出しました。\n保存件数: ${data.entries.length}`);
}
function saveRestorePoint(){try{sessionStorage.setItem(RESTORE_KEY,JSON.stringify({savedAt:new Date().toISOString(),entries:snapshot()}));}catch(e){console.warn(e);}}
function restorePrevious(){
 const raw=sessionStorage.getItem(RESTORE_KEY);if(!raw){alert('このセッションに復元できる直前データはありません。');return;}
 if(!confirm('インポート直前の状態へ戻しますか？'))return;
 try{const b=JSON.parse(raw);localStorage.clear();for(const [k,v] of b.entries||[])localStorage.setItem(k,v);sessionStorage.removeItem(RESTORE_KEY);alert('直前の状態へ戻しました。再読み込みします。');location.reload();}catch(e){alert('復元に失敗しました: '+(e.message||e));}
}
async function importFile(file){
 try{
  const data=JSON.parse(await file.text());
  if(!data||data.format!==FORMAT)throw new Error('対応する学習データファイルではありません。');
  if(data.appId!==APP_ID)throw new Error(`別アプリのデータです（${data.appId||'不明'}）。${APP_LABEL}には読み込めません。`);
  if(!Array.isArray(data.entries))throw new Error('学習データの形式が不正です。');
  const msg=`${APP_LABEL}の学習データ ${data.entries.length}件を読み込みます。\n現在の同名データは上書きされますが、直前の状態へ戻せるバックアップをこのセッション内に保持します。`;
  if(!confirm(msg))return;
  saveRestorePoint();
  for(const pair of data.entries){if(!Array.isArray(pair)||pair.length<2)continue;localStorage.setItem(String(pair[0]),pair[1]==null?'':String(pair[1]));}
  alert('学習データを引き継ぎました。再読み込みします。');location.reload();
 }catch(e){alert('読み込みに失敗しました: '+(e.message||e));}
}
function mount(){
 if(document.getElementById('oai-data-transfer-host'))return;
 const host=document.createElement('div');host.id='oai-data-transfer-host';document.body.appendChild(host);
 const sh=host.attachShadow({mode:'open'});
 sh.innerHTML=`<style>
 :host{all:initial}.fab{position:fixed;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:2147483646;border:0;border-radius:999px;background:#123a5a;color:#fff;font:700 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:11px 15px;box-shadow:0 6px 22px rgba(0,0,0,.22);cursor:pointer}.backdrop{display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(10,25,35,.48);align-items:flex-end;justify-content:center;padding:16px}.backdrop.open{display:flex}.panel{width:min(520px,100%);background:#fff;color:#17313f;border-radius:20px;padding:20px;box-shadow:0 18px 60px rgba(0,0,0,.28);font:14px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.panel h2{font-size:18px;margin:0 0 5px;color:#123a5a}.panel p{margin:0 0 14px;color:#607383}.row{display:grid;gap:9px}.btn{border:1px solid #d3dfe5;border-radius:12px;background:#f7fafb;color:#17313f;padding:11px 12px;font:700 14px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;cursor:pointer}.btn.primary{background:#087c78;color:#fff;border-color:#087c78}.btn.warn{color:#9a4a18;background:#fff7ed;border-color:#fed7aa}.close{margin-top:12px;width:100%;border:0;background:transparent;color:#607383;padding:8px;font:700 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}.note{font-size:12px!important;color:#718390!important;margin-top:12px!important}input{display:none}</style>
 <button class="fab" type="button">学習データ</button>
 <div class="backdrop"><div class="panel" role="dialog" aria-modal="true" aria-label="学習データ移行"><h2>${APP_LABEL}｜学習データ</h2><p>旧アプリから新アプリへ、解答履歴・進捗など端末内の保存データを移行できます。</p><div class="row"><button class="btn primary export" type="button">学習データを書き出す</button><label class="btn importLabel">以前の学習データを読み込む<input class="file" type="file" accept="application/json,.json"></label><button class="btn warn restore" type="button">インポート直前の状態に戻す</button></div><p class="note">同じアプリIDのJSONだけ読み込みます。問題データそのものは変更しません。</p><button class="close" type="button">閉じる</button></div></div>`;
 const bd=sh.querySelector('.backdrop');sh.querySelector('.fab').onclick=()=>bd.classList.add('open');sh.querySelector('.close').onclick=()=>bd.classList.remove('open');bd.addEventListener('click',e=>{if(e.target===bd)bd.classList.remove('open');});sh.querySelector('.export').onclick=exportData;sh.querySelector('.restore').onclick=restorePrevious;sh.querySelector('.file').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(f)importFile(f);e.target.value='';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,250));else setTimeout(mount,250);
})();
