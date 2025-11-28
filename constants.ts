import { Dimension } from './types';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'd1',
    title: '维度一：气质 & 人格匹配度',
    description: '评估双方的大五人格特质、依恋类型及情绪处理模式。',
    items: [
      { id: 'd1_1', label: '情绪稳定性', subLabel: '是否容易焦虑/怒火 (5=非常稳定)' },
      { id: 'd1_2', label: '外向程度', subLabel: '社交需求与能量来源 (5=非常外向)' },
      { id: 'd1_3', label: '开放性', subLabel: '思想开放、好奇心 (5=非常开放)' },
      { id: 'd1_4', label: '尽责性', subLabel: '责任感、靠谱程度 (5=非常尽责)' },
      { id: 'd1_5', label: '宜人性', subLabel: '温和合作 vs 固执 (5=非常宜人)' },
      { id: 'd1_6', label: '安全型依恋程度', subLabel: '在关系中感到安全舒适 (5=非常安全)' },
      { id: 'd1_7', label: '焦虑/回避倾向', subLabel: '患得患失或逃避亲密 (5=严重焦虑/回避)', reverse: true },
      { id: 'd1_8', label: '情绪觉察与负责', subLabel: '能觉察并为自己情绪负责 (5=做得很好)' },
      { id: 'd1_9', label: '冲突处理：理性沟通', subLabel: '能否理性沟通并修复 (5=非常理性)' },
    ]
  },
  {
    id: 'd2',
    title: '维度二：亲密需求 & 情感连接',
    description: '评估陪伴需求、情绪价值给予能力及性生活匹配度。',
    items: [
      { id: 'd2_1', label: '陪伴需求', subLabel: '对共同时间的需求 (5=需求很高)' },
      { id: 'd2_2', label: '独立性需求', subLabel: '对独处空间的需求 (5=需求很高)' },
      { id: 'd2_3', label: '情绪价值提供能力', subLabel: '能否给予对方支持 (5=非常强)' },
      { id: 'd2_4', label: '沟通风格：表达与倾听', subLabel: '善于表达且愿意倾听 (5=做得很好)' },
      { id: 'd2_5', label: '性需求频率', subLabel: '对性生活的渴望程度 (5=频率高)' },
      { id: 'd2_6', label: '性价值观开放度', subLabel: '对性的开放/保守程度 (5=非常开放)' },
    ]
  },
  {
    id: 'd3',
    title: '维度三：价值观 & 长期愿景',
    description: '评估生活消费观、家庭观及对未来的规划一致性。',
    items: [
      { id: 'd3_1', label: '消费观：享受型', subLabel: '偏向享受 vs 节约 (5=非常享受型)' },
      { id: 'd3_2', label: '事业抱负', subLabel: '对工作的投入与野心 (5=非常有野心)' },
      { id: 'd3_3', label: '原生家庭界限', subLabel: '与父母关系的独立性 (5=界限清晰)' },
      { id: 'd3_4', label: '生育意愿', subLabel: '想要孩子的强烈程度 (5=非常想要)' },
      { id: 'd3_5', label: '婚姻意愿', subLabel: '对步入婚姻的渴望 (5=非常渴望)' },
      { id: 'd3_6', label: '未来发展城市/方向', subLabel: '对未来定居规划的清晰度 (5=非常清晰)' },
    ]
  },
  {
    id: 'd4',
    title: '维度四：生活方式匹配性',
    description: '评估作息、社交习惯及整洁度等日常细节。',
    items: [
      { id: 'd4_1', label: '作息规律度', subLabel: '早睡早起 vs 熬夜 (5=非常规律)' },
      { id: 'd4_2', label: '生活节奏', subLabel: '快节奏 vs 慢生活 (5=非常快)' },
      { id: 'd4_3', label: '社交活跃度', subLabel: '朋友聚会频率 (5=非常活跃)' },
      { id: 'd4_4', label: '整洁度要求', subLabel: '对环境卫生的要求 (5=洁癖级)' },
    ]
  },
  {
    id: 'd5',
    title: '维度五：关系运作能力',
    description: '评估经营关系、修复冲突及相互妥协的能力。',
    items: [
      { id: 'd5_1', label: '主动沟通意愿', subLabel: '出现问题时主动沟通 (5=非常主动)' },
      { id: 'd5_2', label: '妥协与调整能力', subLabel: '愿意为关系改变自己 (5=非常愿意)' },
      { id: 'd5_3', label: '信任程度', subLabel: '对伴侣的信任感 (5=完全信任)' },
      { id: 'd5_4', label: '内在安全感', subLabel: '不完全依赖对方提供安全感 (5=内在强大)' },
    ]
  },
  {
    id: 'd6',
    title: '维度六：风险指标 (关键)',
    description: '评估关系中的“红线”风险。分数越高代表风险越高。',
    items: [
      { id: 'd6_1', label: '情绪失控/爆发', subLabel: '容易情绪崩溃或暴怒 (5=经常发生)', reverse: true },
      { id: 'd6_2', label: '冷暴力倾向', subLabel: '拒绝沟通、逃避问题 (5=经常冷战)', reverse: true },
      { id: 'd6_3', label: '结构性不可调和差异', subLabel: '存在无法解决的根本矛盾 (5=非常严重)', reverse: true },
      { id: 'd6_4', label: '缺乏投入/成长不一致', subLabel: '一方掉队或不想付出 (5=非常明显)', reverse: true },
      { id: 'd6_5', label: '控制欲/边界侵犯', subLabel: '试图控制对方或不尊重隐私 (5=非常严重)', reverse: true },
    ]
  }
];
