"use client";
import {useEffect,useMemo,useState} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase";
import type {AppData} from "@/lib/types";
import {Cloud,LogIn,LogOut,ShieldCheck,UserPlus,X} from "lucide-react";

type Props={data:AppData;onLoad:(data:AppData)=>void;onStatus?:(status:string)=>void};
export default function CloudAccount({data,onLoad,onStatus}:Props){
 const supabase=useMemo(()=>createSupabaseBrowserClient(),[]);
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");
 const [open,setOpen]=useState(false);const [busy,setBusy]=useState(false);
 const [user,setUser]=useState<string|null>(null);const [message,setMessage]=useState("");
 const [ready,setReady]=useState(false);
 async function loadUserData(userId:string){
  if(!supabase)return;
  setReady(false);
  const {data:row,error}=await supabase.from("user_data").select("data").eq("user_id",userId).maybeSingle();
  if(error){setMessage("Không đọc được dữ liệu đám mây. Hãy kiểm tra bảng user_data và chính sách RLS.");return;}
  if(row?.data)onLoad(row.data as AppData);
  setUser(userId);setReady(true);onStatus?.("Đã kết nối và đồng bộ");
 }
 useEffect(()=>{
  if(!supabase){onStatus?.("Chưa cấu hình Supabase");return;}
  let alive=true;
  supabase.auth.getSession().then(({data:{session}})=>{if(alive&&session?.user)void loadUserData(session.user.id)});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   if(!alive)return;
   if(event==="SIGNED_OUT"){setUser(null);setReady(false);onStatus?.("Đã đăng xuất");}
   else if(session?.user)void loadUserData(session.user.id);
  });
  return()=>{alive=false;subscription.unsubscribe()};
 },[supabase]);
 useEffect(()=>{
  if(!supabase||!user||!ready)return;
  const timer=window.setTimeout(async()=>{
   const {error}=await supabase.from("user_data").upsert({user_id:user,data,updated_at:new Date().toISOString()},{onConflict:"user_id"});
   if(error){setMessage("Đồng bộ chưa thành công. Vui lòng thử lại sau.");onStatus?.("Lỗi đồng bộ");}
   else onStatus?.("Đã lưu trên đám mây");
  },700);
  return()=>window.clearTimeout(timer);
 },[data,user,ready,supabase]);
 async function submit(mode:"signin"|"signup"){
  if(!supabase){setMessage("Chưa có cấu hình Supabase. Hãy thêm URL và anon key trong Vercel.");return;}
  if(!email.trim()||password.length<8){setMessage("Nhập email hợp lệ và mật khẩu ít nhất 8 ký tự.");return;}
  setBusy(true);setMessage("");
  try{
   const result=mode==="signup"
    ?await supabase.auth.signUp({email:email.trim(),password})
    :await supabase.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;
   if(mode==="signup"&&!result.data.session)setMessage("Tài khoản đã được tạo. Hãy kiểm tra email để xác nhận, sau đó đăng nhập.");
   else if(result.data.user){await loadUserData(result.data.user.id);setMessage("Đăng nhập thành công. Dữ liệu đã được đồng bộ.");}
  }catch(e){setMessage(e instanceof Error?e.message:"Không thể xác thực tài khoản.");}
  finally{setBusy(false);}
 }
 async function signOut(){if(!supabase)return;await supabase.auth.signOut();setOpen(false);}
 return <div className="relative">
  <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 rounded-full border border-[#e8e3f5] bg-white px-3 py-2 text-xs font-bold text-[#695bb6]"><Cloud size={15}/>{user?"Cloud synced":"Account"}</button>
  {open&&<div className="absolute right-0 top-12 z-[60] w-[min(340px,calc(100vw-32px))] rounded-2xl border border-[#ebe7f4] bg-white p-5 shadow-2xl">
   <div className="mb-3 flex items-center justify-between"><b className="text-sm">{user?"Tài khoản MINDNEST":"Tạo tài khoản / Đăng nhập"}</b><button onClick={()=>setOpen(false)} aria-label="Đóng"><X size={17}/></button></div>
   {!supabase?<div className="rounded-xl bg-[#fff7e9] p-3 text-xs leading-relaxed text-[#8a6427]">Cần cấu hình Supabase trước khi bật tài khoản. Dữ liệu hiện vẫn nằm trên trình duyệt này.</div>:user?<><div className="rounded-xl bg-[#eff8f2] p-3 text-xs text-[#34734c]"><ShieldCheck size={15} className="mb-1"/>Tài khoản đã đăng nhập. Dữ liệu riêng của bạn được lưu trong cloud.</div><button onClick={signOut} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f3fa] px-4 py-3 text-xs font-bold"><LogOut size={15}/> Đăng xuất</button></>:<>
    <label className="mb-1 block text-xs font-semibold">Email</label><input className="field mb-3" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
    <label className="mb-1 block text-xs font-semibold">Mật khẩu (ít nhất 8 ký tự)</label><input className="field mb-3" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
    <div className="grid grid-cols-2 gap-2"><button disabled={busy} onClick={()=>void submit("signin")} className="btn justify-center"><LogIn size={14}/> Đăng nhập</button><button disabled={busy} onClick={()=>void submit("signup")} className="btn btn-soft justify-center"><UserPlus size={14}/> Đăng ký</button></div>
   </>}
   {message&&<p role="status" className="mt-3 rounded-lg bg-[#f5f3fa] p-3 text-xs leading-relaxed text-muted">{message}</p>}
   <p className="mt-3 text-[10px] leading-relaxed text-muted">Không dùng chung tài khoản. Dữ liệu cảm xúc và nhật ký là riêng tư; mỗi tài khoản chỉ truy cập dữ liệu của chính mình. Hãy dùng mật khẩu riêng, không tái sử dụng mật khẩu ở dịch vụ khác.</p>
  </div>}
 </div>;
}
