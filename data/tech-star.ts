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

export const trainingLevels = [
  {
    level: "Level 0",
    title: "入门 · 全体成员",
    color: "border-rm-blue/40 bg-rm-blue/5",
    items: ["Linux 基础", "Git 版本控制", "工具链配置", "安全规范", "团队协作"],
  },
  {
    level: "Level 1",
    title: "基础训练",
    color: "border-green-500/40 bg-green-500/5",
    items: [
      "电控：C/C++ → STM32 → CAN / PID",
      "机械：CAD → 建模 → 加工装配",
      "电控视觉：Python → OpenCV → 目标检测",
    ],
  },
  {
    level: "Level 2",
    title: "项目实战",
    color: "border-yellow-500/40 bg-yellow-500/5",
    items: ["底盘与云台模块", "电机控制与姿态解算", "视觉自瞄上车", "机构调试与可靠性优化"],
  },
  {
    level: "Level 3",
    title: "比赛研发",
    color: "border-rm-red/40 bg-rm-red/5",
    items: ["RoboMaster 参赛", "整车联调", "赛场故障响应", "技术复盘与传承"],
  },
];
