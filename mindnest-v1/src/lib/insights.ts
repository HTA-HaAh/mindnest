import type {AppData} from "./types";
export function buildInsights(data:AppData){
 const recent=data.moods.filter(m=>Date.now()-new Date(m.createdAt).getTime()<=7*86400000);
 const counts=recent.reduce<Record<string,number>>((a,m)=>(a[m.mood]=(a[m.mood]||0)+1,a),{});
 const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
 const contexts=recent.flatMap(m=>m.context);
 const contextCounts=contexts.reduce<Record<string,number>>((a,c)=>(a[c]=(a[c]||0)+1,a),{});
 const topContext=Object.entries(contextCounts).sort((a,b)=>b[1]-a[1])[0];
 const avg=recent.length?recent.reduce((s,m)=>s+m.intensity,0)/recent.length:0;
 const insights:string[]=[];
 if(recent.length>=3&&top)insights.push(`Trong 7 ngày gần đây, cảm xúc được ghi nhận nhiều nhất là ${top[0]} (${top[1]} lần). Đây là xu hướng trong nhật ký, không phải kết luận về trạng thái của bạn.`);
 if(recent.length>=3&&topContext)insights.push(`Bối cảnh xuất hiện nhiều nhất là "${topContext[0]}". Bạn có thể thử ghi thêm điều gì xảy ra trước và sau những thời điểm này.`);
 if(recent.length>=3)insights.push(`Cường độ cảm xúc trung bình bạn tự ghi nhận là ${avg.toFixed(1)}/10. Hãy xem đây là dữ liệu tham khảo để quan sát thay đổi, không phải điểm số.`);
 if(data.untangles.length)insights.push(`Bạn đã bắt đầu ${data.untangles.length} phiên gỡ rối. Hãy xem lại các hành động nhỏ đã chọn để nhận ra điều gì thực sự hữu ích.`);
 if(!insights.length)insights.push("Hãy ghi nhận ít nhất 3 lần check-in để MINDNEST bắt đầu tổng hợp những xu hướng đầu tiên. Bạn không cần phải cảm thấy theo một cách nhất định.");
 return {recentCount:recent.length,avg,top:top?.[0]||"—",insights};
}
