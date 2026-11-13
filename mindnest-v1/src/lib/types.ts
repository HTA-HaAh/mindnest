export type Mood = "Happy"|"Calm"|"Anxious"|"Sad"|"Angry"|"Tired"|"Hopeful"|"Overwhelmed"|"Grateful"|"Lonely";
export type MoodEntry = {id:string; mood:Mood; intensity:number; energy:number; context:string[]; note:string; createdAt:string};
export type UntangleSession = {id:string; title:string; category:string; answers:string[]; action:string; status:"active"|"completed"; createdAt:string; updatedAt:string};
export type Reflection = {id:string; date:string; grateful:string; challenge:string; tomorrow:string; createdAt:string};
export type Milestone = {id:string; title:string; detail:string; date:string; createdAt:string};
export type ChatMessage = {role:"user"|"assistant";content:string;createdAt:string};
export type AppData = {moods:MoodEntry[];untangles:UntangleSession[];reflections:Reflection[];milestones:Milestone[];chat:ChatMessage[];displayName:string};
