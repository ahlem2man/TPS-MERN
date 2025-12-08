 const { GoogleGenerativeAI }= require("@google/generative-ai");
 
 const genAI =newGoogleGenerativeAI(process.env.GEMINI_API_KEY);

 const getModel = () =>{
return genAI.getGenerativeModel({
 model: "gemini-1.5-flash"
 });
 };

module.exports ={ getModel };