export interface TechNode {
  id: string;
  label: string;
  children?: TechNode[];
  items?: string[];
  desc?: string;
}

export interface StarField {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
  glowColor: string;
  borderColor: string;
  bgColor: string;
  tree: TechNode[];
}

export const starFields: StarField[] = [
  {
    id: "electrical",
    name: "电控组",
    nameEn: "Electrical Control",
    icon: "⚡",
    description:
      "机器人的神经与感知系统——嵌入式控制、电机驱动、通信、视觉自瞄与控制算法都归入电控方向。",
    color: "text-yellow-400",
    glowColor: "shadow-yellow-500/30",
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-500/5",
    tree: [
      {
        id: "electrical-language",
        label: "开发基础",
        children: [
          {
            id: "electrical-cpp",
            label: "C / C++",
            items: ["数据结构", "指针", "模块化编程", "调试", "Makefile"],
            desc: "用于 MCU 固件、上位机和控制模块开发。",
          },
          {
            id: "electrical-python",
            label: "Python",
            items: ["NumPy", "OpenCV", "PyTorch", "自动化调试脚本"],
            desc: "用于视觉模块、数据分析和工具开发。",
          },
        ],
      },
      {
        id: "embedded-control",
        label: "嵌入式控制",
        children: [
          {
            id: "stm32",
            label: "STM32 平台",
            items: ["Cortex-M", "NVIC", "GPIO", "UART + DMA", "SPI", "I2C", "ADC", "Timer"],
          },
          {
            id: "rtos",
            label: "实时系统",
            items: ["FreeRTOS", "Task", "Queue", "Semaphore", "Mutex", "Software Timer"],
          },
          {
            id: "communication",
            label: "通信与调试",
            items: ["CAN", "UART", "USB", "示波器", "逻辑分析仪", "CAN 分析仪"],
          },
        ],
      },
      {
        id: "motion-control",
        label: "运动与姿态控制",
        children: [
          {
            id: "motor-control",
            label: "电机控制",
            items: ["M3508", "M2006", "GM6020", "C620/C610", "PWM", "电流环"],
          },
          {
            id: "control-algorithms",
            label: "控制算法",
            items: ["PID", "前馈", "限幅", "积分抗饱和", "参数整定", "串级控制"],
          },
          {
            id: "state-estimation",
            label: "传感器融合",
            items: ["BMI088", "ICM42688", "陀螺仪积分", "EKF", "Mahony", "Madgwick"],
          },
        ],
      },
      {
        id: "vision-autoaim",
        label: "视觉自瞄（电控模块）",
        children: [
          {
            id: "image-processing",
            label: "图像处理",
            items: ["OpenCV", "相机标定", "色彩空间", "滤波", "特征提取", "PnP"],
          },
          {
            id: "target-detection",
            label: "目标检测与部署",
            items: ["YOLO", "TensorRT", "ONNX", "Jetson", "串口协议", "延迟分析"],
          },
          {
            id: "auto-aim",
            label: "自瞄链路",
            items: ["装甲板识别", "坐标转换", "弹道补偿", "云台联动"],
          },
        ],
      },
    ],
  },
  {
    id: "mechanical",
    name: "机械组",
    nameEn: "Mechanical",
    icon: "🔧",
    description: "机器人的身体——结构设计、加工制造、装配调试与可靠性优化。",
    color: "text-orange-400",
    glowColor: "shadow-orange-500/30",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/5",
    tree: [
      {
        id: "cad",
        label: "设计软件",
        children: [
          {
            id: "cad-software",
            label: "CAD 建模",
            items: ["SolidWorks", "Creo", "Fusion 360", "三维建模", "装配体", "工程图"],
          },
          {
            id: "simulation",
            label: "分析与出图",
            items: ["公差配合", "干涉检查", "质量估算", "强度分析", "BOM"],
          },
        ],
      },
      {
        id: "mechanical-structure",
        label: "结构设计",
        children: [
          {
            id: "chassis-gimbal",
            label: "机器人机构",
            items: ["底盘", "云台", "发射机构", "装甲结构", "线束布局"],
          },
          {
            id: "materials",
            label: "材料与连接",
            items: ["铝合金", "碳纤维", "轴承", "紧固件", "螺纹胶", "防松"],
          },
        ],
      },
      {
        id: "manufacturing",
        label: "加工与装配",
        children: [
          {
            id: "manufacturing-tools",
            label: "加工工艺",
            items: ["CNC", "激光切割", "3D 打印", "手工加工", "后处理"],
          },
          {
            id: "reliability",
            label: "可靠性",
            items: ["装配记录", "赛前巡检", "快速换件", "故障复盘", "维护规范"],
          },
        ],
      },
    ],
  },
];

export interface TrainingStage {
  level: string;
  period: string;
  title: string;
  items: string[];
}

export interface TrainingTrack {
  id: "mechanical" | "electrical";
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
  stages: TrainingStage[];
}

export const trainingTracks: TrainingTrack[] = [
  {
    id: "mechanical",
    name: "机械组培养路线",
    nameEn: "Mechanical Path",
    icon: "🔧",
    description: "从识图建模、加工装配到独立负责整车机构与赛场保障。",
    color: "text-orange-400",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/5",
    dotColor: "bg-orange-400",
    stages: [
      {
        level: "Level 0",
        period: "大一上",
        title: "入门 · 认识结构与工具",
        items: [
          "机械制图与读图",
          "SolidWorks 基础建模",
          "游标卡尺与常用工具",
          "装配安全与紧固规范",
          "机器人拆装训练",
        ],
      },
      {
        level: "Level 1",
        period: "大一下",
        title: "基础 · 完成第一个机构",
        items: [
          "零件与装配体建模",
          "工程图与公差配合",
          "3D 打印与激光切割",
          "底盘与云台结构认知",
          "独立完成小型机构",
        ],
      },
      {
        level: "Level 2",
        period: "大二上",
        title: "实战 · 独立负责模块",
        items: [
          "需求拆解与方案评审",
          "机构设计与干涉检查",
          "材料、工艺与 BOM",
          "加工跟进与装配调试",
          "可靠性与轻量化优化",
        ],
      },
      {
        level: "Level 3",
        period: "大二下",
        title: "领航 · 带队与带新人",
        items: [
          "负责整车机械系统",
          "赛前巡检与快速维修",
          "跨组联调与问题闭环",
          "指导新人完成项目",
          "设计复盘与规范沉淀",
        ],
      },
    ],
  },
  {
    id: "electrical",
    name: "电控组培养路线",
    nameEn: "Electrical Path",
    icon: "⚡",
    description: "从嵌入式基础到运动控制、视觉自瞄与整车电控联调。",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-500/5",
    dotColor: "bg-yellow-400",
    stages: [
      {
        level: "Level 0",
        period: "大一上",
        title: "入门 · 点亮第一个 LED",
        items: [
          "C 语言基础",
          "STM32 GPIO 控制",
          "串口通信 UART",
          "点亮 LED 与蜂鸣器",
          "搭建开发环境",
        ],
      },
      {
        level: "Level 1",
        period: "大一下",
        title: "基础 · 让电机转起来",
        items: [
          "CAN 总线通信",
          "PID 控制算法",
          "FreeRTOS 入门",
          "电机驱动与控制",
          "机器人模块拆解",
        ],
      },
      {
        level: "Level 2",
        period: "大二上",
        title: "实战 · 独立负责模块",
        items: [
          "自主开发子系统",
          "IMU 姿态解算",
          "OpenCV 图像处理",
          "YOLO 目标检测",
          "视觉自瞄上车",
        ],
      },
      {
        level: "Level 3",
        period: "大二下",
        title: "领航 · 带队与带新人",
        items: [
          "担任技术负责人",
          "指导新人培训",
          "系统架构设计",
          "整车联调与故障复盘",
          "赛季技术传承",
        ],
      },
    ],
  },
];
