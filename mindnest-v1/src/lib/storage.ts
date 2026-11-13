import type {AppData} from "./types";
const KEY="mindnest:data:v1";
export const emptyData:AppData={moods:[],untangles:[],reflections:[],milestones:[],chat:[],displayName:"Friend"};
export function loadData():AppData{if(typeof window==="undefined")return emptyData;try{const raw=localStorage.getItem(KEY);return raw?{...emptyData,...JSON.parse(raw)}:emptyData}catch{return emptyData}}
export function saveData(data:AppData){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(data))}
export function exportData(data:AppData){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="mindnest-personal-data.json";a.click();URL.revokeObjectURL(url)}
export function deleteData(){if(typeof window!=="undefined")localStorage.removeItem(KEY)}
