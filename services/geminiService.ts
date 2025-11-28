import { GoogleGenAI } from "@google/genai";
import { DIMENSIONS } from '../constants';
import { Scores } from '../types';

export const generateAnalysis = async (scores: Scores): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure the API Key to get the AI analysis.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare data summary for the prompt
  let dataSummary = "以下是用户填写的《亲密关系专业评估表》得分数据（1-5分制）：\n\n";

  DIMENSIONS.forEach(dim => {
    dataSummary += `### ${dim.title}\n`;
    dim.items.forEach(item => {
      const s = scores[item.id];
      const selfScore = s?.self || 0;
      const partnerScore = s?.partner || 0;
      dataSummary += `- ${item.label} (${item.subLabel || ''}): 自己 ${selfScore}分, 对方 ${partnerScore}分. (注: ${item.reverse ? '此项分数越高风险越高' : '此项为一般特质'}) \n`;
    });
    dataSummary += "\n";
  });

  const prompt = `
    你是一位世界顶级的婚恋情感咨询师。请根据以下提供的评估数据，为这对伴侣生成一份深度的《亲密关系诊断报告》。

    ${dataSummary}

    请输出一份Markdown格式的报告，语气专业、客观但富有同理心。报告结构必须严格包含以下部分：

    1.  **📊 核心匹配度概览**：简要评价双方的整体契合度（不要给总分，给一个定性评价，如“高潜力伴侣”、“需磨合伴侣”等）。
    2.  **🌟 高匹配项（优势资源）**：列出双方得分接近且积极的维度（或互补得很好的维度），解释为什么这是他们关系的基石。
    3.  **⚠️ 潜在风险与矛盾点**：指出双方分差较大，或者风险指标（维度六）得分较高的区域。
    4.  **💣 结构性冲突预警**：如果有核心价值观或维度六的高风险项，请直言不讳地指出这些是否为“不可调和”的差异。
    5.  **💡 专业建议与行动指南**：针对上述问题，给出3-4条具体、可执行的改善建议（Actionable Advice）。

    请注意：
    - 对于“维度六：风险指标”，如果分数高（接近4或5），必须发出严重警告。
    - 对于性格（维度一），重点分析“互补”还是“冲突”。
    - 对于价值观（维度三），重点分析“长期愿景”的一致性。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "无法生成分析报告，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析服务暂时不可用，请检查网络或API Key配置。";
  }
};
