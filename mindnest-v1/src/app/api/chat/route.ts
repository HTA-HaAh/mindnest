import {NextResponse} from "next/server";
import {z} from "zod";
const schema=z.object({messages:z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().min(1).max(5000)})).min(1).max(30)});
const system=`Bạn là Mindy, trợ lý phản tư thân thiện của MINDNEST. Trả lời bằng tiếng Việt, ấm áp, không phán xét, ngắn gọn và đặt tối đa một câu hỏi mở mỗi lượt. Không chẩn đoán bệnh, không khẳng định nguyên nhân cảm xúc khi thiếu dữ liệu, không thay thế chuyên gia. Hãy giúp người dùng tự suy nghĩ và chọn một bước nhỏ có thể kiểm soát. Không khuyến khích phụ thuộc vào AI. Nếu người dùng có nguy cơ tự làm hại bản thân hoặc người khác, hãy phản hồi nghiêm túc, khuyến khích họ đến cạnh người đáng tin cậy ngay, liên hệ dịch vụ khẩn cấp tại địa phương hoặc cơ sở y tế; hỏi xem họ có đang an toàn ngay lúc này không.`;
export async function POST(req:Request){
 const key=process.env.OPENAI_API_KEY;if(!key)return NextResponse.json({error:"AI chưa được cấu hình. Hãy thêm OPENAI_API_KEY vào file .env.local; chế độ phản hồi demo vẫn hoạt động."},{status:503});
 try{
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Dữ liệu hội thoại không hợp lệ."},{status:400});
  const base=(process.env.OPENAI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,"");
  const response=await fetch(`${base}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4o-mini",messages:[{role:"system",content:system},...parsed.data.messages],temperature:.65})});
  if(!response.ok)return NextResponse.json({error:"AI provider chưa phản hồi thành công. Vui lòng thử lại."},{status:502});
  const result=await response.json();return NextResponse.json({reply:result.choices?.[0]?.message?.content||"Mindy chưa tạo được phản hồi. Bạn thử diễn đạt theo cách khác nhé."});
 }catch{return NextResponse.json({error:"Không thể kết nối Mindy lúc này."},{status:500})}
}
