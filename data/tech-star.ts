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
    id: "embedded",
    name: "电控组",
    nameEn: "Embedded Control",
    icon: "⚡",
    description: "机器人的「神经系统」——底层控制、电机驱动、通信与姿态解算",
    color: "text-yellow-400",
    glowColor: "shadow-yellow-500/30",
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-500/5",
    tree: [
      {
        id: "lang",
        label: "基础语言",
        children: [
          {
            id: "c-lang",
            label: "C语言",
            items: ["数据类型", "指针", "结构体", "位运算", "内存管理", "模块化编程", "Makefile"],
            desc: "应用: STM32驱动开发、电机控制、传感器读取",
          },
          {
            id: "cpp-lang",
            label: "C++",
            items: ["面向对象", "类设计", "STL", "模板基础"],
            desc: "应用: 上位机、ROS节点、算法模块",
          },
        ],
      },
      {
        id: "mcu",
        label: "嵌入式平台 · STM32",
        children: [
          {
            id: "mcu-core",
            label: "MCU基础",
            items: ["Cortex-M内核", "启动流程", "中断系统 NVIC", "SysTick", "Flash / SRAM"],
          },
          {
            id: "mcu-periph",
            label: "外设开发",
            items: [
              "GPIO 输入输出",
              "UART 串口通信 + DMA",
              "SPI (OLED / Flash / IMU)",
              "I2C (MPU6050 / EEPROM)",
              "CAN 电机通信",
              "PWM 电机驱动",
              "ADC 电压采集",
              "Timer 定时捕获",
            ],
          },
        ],
      },
      {
        id: "rtos",
        label: "嵌入式系统",
        children: [
          {
            id: "bare-metal",
            label: "裸机开发",
            items: ["寄存器编程", "启动文件", "链接脚本", "中断向量表", "Bootloader"],
          },
          {
            id: "freertos",
            label: "FreeRTOS",
            items: ["Task", "Queue", "Semaphore", "Mutex", "Software Timer", "内存管理"],
          },
        ],
      },
      {
        id: "motor",
        label: "电机控制",
        children: [
          {
            id: "motor-type",
            label: "电机类型",
            items: ["GM6020", "M3508", "M2006", "C620/C610 ESC"],
            desc: "学习: 电机模型、编码器、电流控制",
          },
          {
            id: "motor-pid",
            label: "PID 控制",
            items: ["P 比例", "I 积分", "D 微分", "前馈控制", "限幅", "积分抗饱和", "参数整定"],
          },
          {
            id: "gimbal",
            label: "云台双环PID",
            items: ["目标角度 → 角度环PID → 目标速度 → 速度环PID → 电机输出"],
            desc: "双环串级控制，实现云台精准指向",
          },
        ],
      },
      {
        id: "imu",
        label: "姿态解算",
        items: ["BMI088", "MPU6050", "ICM42688", "陀螺仪积分", "加速度融合", "卡尔曼滤波", "Mahony", "Madgwick"],
        desc: "传感器融合算法，让机器人知道自己朝向",
      },
      {
        id: "comm",
        label: "通信技术",
        items: ["CAN", "UART", "SPI", "I2C", "USB", "Ethernet", "CAN分析仪", "示波器", "逻辑分析仪"],
        desc: "机器人内部通信网络",
      },
    ],
  },
  {
    id: "vision",
    name: "视觉组",
    nameEn: "AI Vision",
    icon: "👁️",
    description: "机器人的「眼睛」——图像处理、目标检测与AI部署",
    color: "text-green-400",
    glowColor: "shadow-green-500/30",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/5",
    tree: [
      {
        id: "vis-lang",
        label: "编程语言",
        children: [
          {
            id: "python",
            label: "Python",
            items: ["NumPy", "Matplotlib", "OpenCV", "PyTorch"],
          },
          {
            id: "vis-cpp",
            label: "C++",
            items: ["OpenCV C++", "CUDA", "高性能部署"],
          },
        ],
      },
      {
        id: "opencv",
        label: "图像处理 · OpenCV",
        children: [
          {
            id: "cv-basic",
            label: "基础",
            items: ["图像读取", "色彩空间 HSV/RGB", "灰度处理"],
          },
          {
            id: "cv-process",
            label: "处理",
            items: ["滤波", "边缘检测", "二值化", "形态学"],
          },
          {
            id: "cv-geom",
            label: "几何",
            items: ["轮廓检测", "特征提取", "透视变换"],
          },
        ],
      },
      {
        id: "dl",
        label: "深度学习",
        children: [
          {
            id: "dl-frame",
            label: "框架",
            items: ["PyTorch", "TensorFlow"],
          },
          {
            id: "dl-model",
            label: "目标检测",
            items: ["YOLOv5", "YOLOv8", "YOLO11", "CNN", "Backbone", "Loss", "Training", "Dataset"],
          },
        ],
      },
      {
        id: "ai-deploy",
        label: "AI 部署",
        items: ["NVIDIA GPU", "Jetson Nano", "Jetson Orin", "CUDA", "TensorRT", "ONNX"],
        desc: "把模型部署到边缘设备，实时推理",
      },
      {
        id: "robot-vision",
        label: "机器人视觉应用",
        children: [
          {
            id: "armor",
            label: "装甲板识别",
            items: ["Camera → OpenCV → YOLO → 目标位置 → 控制系统"],
            desc: "自动检测敌方装甲板并计算位置",
          },
          {
            id: "autoaim",
            label: "自动瞄准",
            items: ["坐标转换", "PnP 解算", "弹道预测"],
            desc: "从像素坐标到云台角度，实现自瞄",
          },
        ],
      },
    ],
  },
  {
    id: "algorithm",
    name: "算法组",
    nameEn: "Algorithm",
    icon: "🧠",
    description: "机器人的「大脑」——控制算法、路径规划与定位导航",
    color: "text-purple-400",
    glowColor: "shadow-purple-500/30",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/5",
    tree: [
      {
        id: "math",
        label: "数学基础",
        items: ["线性代数", "矩阵运算", "概率统计", "微积分"],
        desc: "所有算法的基础",
      },
      {
        id: "ctrl",
        label: "控制算法",
        children: [
          {
            id: "classic-ctrl",
            label: "经典控制",
            items: ["PID", "LQR", "MPC"],
          },
          {
            id: "filter",
            label: "滤波",
            items: ["卡尔曼滤波", "EKF 扩展卡尔曼"],
          },
        ],
      },
      {
        id: "slam",
        label: "定位 · SLAM",
        children: [
          {
            id: "laser-slam",
            label: "激光 SLAM",
            items: ["Cartographer"],
          },
          {
            id: "visual-slam",
            label: "视觉 SLAM",
            items: ["ORB-SLAM"],
          },
        ],
      },
      {
        id: "path-plan",
        label: "路径规划",
        children: [
          {
            id: "graph-search",
            label: "图搜索",
            items: ["BFS", "DFS", "A*", "Dijkstra"],
          },
          {
            id: "advanced-plan",
            label: "高级规划",
            items: ["RRT", "MPC 轨迹规划"],
          },
        ],
      },
      {
        id: "kinematics",
        label: "运动学",
        items: ["坐标变换", "欧拉角", "四元数", "正逆运动学"],
        desc: "理解机器人如何运动",
      },
    ],
  },
  {
    id: "mechanical",
    name: "机械组",
    nameEn: "Mechanical",
    icon: "🔧",
    description: "机器人的「身体」——结构设计、加工制造与装配调试",
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
            label: "CAD",
            items: ["SolidWorks", "Creo", "Fusion 360"],
          },
          {
            id: "cad-skills",
            label: "技能",
            items: ["三维建模", "装配体", "工程图"],
          },
        ],
      },
      {
        id: "mech-struct",
        label: "机械结构",
        items: ["材料选择", "强度分析", "公差配合", "轴承设计"],
        desc: "让机器人既坚固又轻巧",
      },
      {
        id: "manufacture",
        label: "加工技术",
        children: [
          {
            id: "equipment",
            label: "设备",
            items: ["CNC 数控", "激光切割", "3D 打印"],
          },
          {
            id: "materials",
            label: "材料",
            items: ["铝合金", "碳纤维", "亚克力"],
          },
        ],
      },
      {
        id: "robot-struct",
        label: "机器人结构设计",
        items: ["底盘", "云台", "发射机构", "装甲结构"],
        desc: "从图纸到实物的完整流程",
      },
    ],
  },
  {
    id: "software",
    name: "软件组",
    nameEn: "Software",
    icon: "🖥️",
    description: "机器人控制平台——上位机开发、调试工具与数据分析",
    color: "text-cyan-400",
    glowColor: "shadow-cyan-500/30",
    borderColor: "border-cyan-500/40",
    bgColor: "bg-cyan-500/5",
    tree: [
      {
        id: "qt",
        label: "C++ Qt 上位机",
        items: ["QWidget", "Qt Designer", "信号槽", "多线程"],
        desc: "应用: 调参软件、数据可视化",
      },
      {
        id: "py-tools",
        label: "Python 工具开发",
        items: ["自动测试脚本", "数据分析", "日志系统"],
        desc: "提升开发效率的辅助工具",
      },
      {
        id: "comm-tools",
        label: "通信实现",
        items: ["串口工具", "CAN 工具", "TCP/UDP"],
        desc: "与机器人实时通信",
      },
    ],
  },
  {
    id: "media",
    name: "宣传运营组",
    nameEn: "Media & Operations",
    icon: "🎨",
    description: "战队形象——设计、视频、摄影与新媒体的全栈运营",
    color: "text-pink-400",
    glowColor: "shadow-pink-500/30",
    borderColor: "border-pink-500/40",
    bgColor: "bg-pink-500/5",
    tree: [
      {
        id: "design",
        label: "设计",
        items: ["Photoshop", "Illustrator", "Figma"],
        desc: "海报、LOGO、视觉设计",
      },
      {
        id: "video",
        label: "视频制作",
        items: ["Premiere", "After Effects", "DaVinci Resolve"],
        desc: "比赛记录、宣传片、Vlog",
      },
      {
        id: "photo",
        label: "摄影",
        items: ["相机参数", "构图", "灯光"],
        desc: "记录战队每一个高光时刻",
      },
      {
        id: "new-media",
        label: "新媒体运营",
        items: ["B站运营", "微信公众号", "招新宣传", "比赛记录"],
        desc: "让更多人看到我们的故事",
      },
    ],
  },
];

export const trainingLevels = [
  {
    level: "Level 0",
    title: "入门 · 所有成员",
    color: "border-rm-blue/40 bg-rm-blue/5",
    items: ["Linux 基础", "Git 版本控制", "Markdown", "工具链配置", "团队协作"],
  },
  {
    level: "Level 1",
    title: "基础训练",
    color: "border-green-500/40 bg-green-500/5",
    items: [
      "电控: 点亮LED → 串口通信 → PWM → 电机控制",
      "视觉: Python → OpenCV → 目标检测",
      "机械: CAD → 建模 → 加工",
    ],
  },
  {
    level: "Level 2",
    title: "项目实战",
    color: "border-yellow-500/40 bg-yellow-500/5",
    items: ["小车底盘", "云台系统", "视觉跟随", "自动瞄准", "调参系统"],
  },
  {
    level: "Level 3",
    title: "比赛研发",
    color: "border-rm-red/40 bg-rm-red/5",
    items: ["RoboMaster 参赛", "全国机器人比赛", "科创项目"],
  },
];