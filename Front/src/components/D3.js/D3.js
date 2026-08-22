// D3.js 通用知识图谱渲染工具
import * as d3 from 'd3';

// 初始化提示框（全局单例）
let tooltip = null;
function initTooltip() {
  if (!tooltip) {
    tooltip = d3.select("body").append("div")
      .attr("class", "graph-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("max-width", "300px");
  }
  return tooltip;
}

/**
 * 处理平行边：给每条连线分配索引和总数
 * @param {Array} links - 连线数据数组
 */
function processParallelEdges(links) {
  const counts = {};
  // 1. 统计每两个节点间有几条线
  links.forEach(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    const key = `${s}-${t}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  // 2. 给每条线发个“号码牌”（linkIndex 和 linkTotal）
  const indexMap = {};
  links.forEach(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    const key = `${s}-${t}`;
    
    if (!indexMap[key]) indexMap[key] = 0;
    link.linkIndex = indexMap[key]; // 当前是第几条
    link.linkTotal = counts[key];   // 总共几条
    indexMap[key]++;
  });
}

/**
 * 通用知识图谱渲染函数
 * @param {String} containerId - 容器DOM ID
 * @param {Object} graphData - 图谱数据
 * @param {Object} options - 配置项
 */
export function renderKnowledgeGraph(containerId, graphData, options = {}) {
  const config = {
    width: 1400,
    height: 900,
    linkDistance: 180,
    chargeStrength: -600,
    collideRadius: 60,
    ...options
  };

  const container = d3.select(`#${containerId}`);
  if (!container.node()) return;
  container.selectAll("*").remove();

  // 【关键步骤】在渲染前处理平行边数据
  processParallelEdges(graphData.links);

  // 开启缩放 + 平移
  const zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  const svg = container.append("svg")
    .attr("width", config.width)
    .attr("height", config.height)
    .style("width", "100%")
    .style("height", "100%")
    .call(zoom);

  const g = svg.append("g");

  // 力导向仿真器
  const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(config.linkDistance))
    .force("charge", d3.forceManyBody().strength(config.chargeStrength))
    .force("center", d3.forceCenter(config.width / 2, config.height / 2))
    .force("collision", d3.forceCollide().radius(config.collideRadius));

  // 连线：改用 path 标签以支持曲线/偏移绘制
  const link = g.append("g")
    .selectAll("path")
    .data(graphData.links)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#040404")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6)
    .attr("class", "graph-link");

  // 关系标签
  const linkLabel = g.append("g")
    .selectAll("text")
    .data(graphData.links)
    .enter().append("text")
    .attr("font-size", "10px")
    .attr("fill", "#040404")
    .attr("text-anchor", "middle")
    .text(d => d.type)
    .attr("class", "graph-link-label");

  // 节点组
  const node = g.append("g")
    .selectAll(".node")
    .data(graphData.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded));

  // 纹样实例显示图片，其他节点显示圆形
  node.each(function (d) {
    const n = d3.select(this);
    if (d.type === "纹样实例") {
      const imgUrl = `http://localhost:8000/images/${d.name}`;
      n.append("image")
        .attr("xlink:href", imgUrl)
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", -25)
        .attr("y", -25)
        .attr("class", "node-image")
        .style("filter", "grayscale(100%)"); // 默认置灰
    } else {
      n.append("circle")
        .attr("r", 15)
        .attr("fill", d.color || "#040404")
        .attr("stroke", "#040404")
        .attr("stroke-width", 2)
        .attr("class", "node-circle")
        .style("filter", "grayscale(100%)"); // 默认置灰
    }
  });

  // 节点文字
  node.append("text")
    .attr("dy", 30)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text(d => {
      const name = d.name || "未命名";
      return name.length > 8 ? `${name.substring(0, 8)}...` : name;
    })
    .attr("class", "node-text")
    .style("fill", "#040404");

  // 提示框
  const tooltip = initTooltip();

  // ===================== 核心高亮逻辑 =====================
  node.on("mouseover", (event, d) => {
    // 1. 显示提示框
    tooltip.transition().duration(200).style("opacity", .9);
    let content = `<strong>${d.name}</strong><br/>类型：${d.type}<br/>`;
    if (d.properties) {
      Object.entries(d.properties).forEach(([k, v]) => {
        if (k !== "color" && k !== "名称") content += `${k}：${v}<br/>`;
      });
    }
    tooltip.html(content)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 20}px`);

    // 2. 筛选相关节点ID
    const relatedNodeIds = new Set([d.id]);
    graphData.links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === d.id) relatedNodeIds.add(t);
      if (t === d.id) relatedNodeIds.add(s);
    });

    // 3. 高亮相关链接和标签
    link.filter(l => relatedNodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) && 
                     relatedNodeIds.has(typeof l.target === 'object' ? l.target.id : l.target))
      .attr("stroke", d => d.color || "#2196f3")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 2.5);

    linkLabel.filter(l => relatedNodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) && 
                          relatedNodeIds.has(typeof l.target === 'object' ? l.target.id : l.target))
      .attr("fill", "#2196f3")
      .style("font-weight", "bold");

    // 4. 高亮相关节点
    node.filter(n => relatedNodeIds.has(n.id))
      .select(".node-circle")
      .style("filter", "grayscale(0%)")
      .attr("stroke-width", 3);

    node.filter(n => relatedNodeIds.has(n.id))
      .select(".node-image")
      .style("filter", "grayscale(0%)");

    node.filter(n => relatedNodeIds.has(n.id))
      .select(".node-text")
      .style("fill", "#040404")
      .style("font-weight", "bold");

    // 5. 置灰非相关元素
    link.filter(l => !(relatedNodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) && 
                       relatedNodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)))
      .attr("stroke-opacity", 0.1);

    linkLabel.filter(l => !(relatedNodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) && 
                            relatedNodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)))
      .attr("fill", "#040404");

    node.filter(n => !relatedNodeIds.has(n.id))
      .select(".node-circle")
      .style("filter", "grayscale(100%)")
      .attr("stroke-width", 1);

    node.filter(n => !relatedNodeIds.has(n.id))
      .select(".node-image")
      .style("filter", "grayscale(100%)");

    node.filter(n => !relatedNodeIds.has(n.id))
      .select(".node-text")
      .style("fill", "#040404")
      .style("font-weight", "normal");

  }).on("mouseout", () => {
    // 恢复所有样式
    tooltip.transition().duration(500).style("opacity", 0);
    link.attr("stroke", "#040404").attr("stroke-opacity", 0.6).attr("stroke-width", 1.5);
    linkLabel.attr("fill", "#040404").style("font-weight", "normal");
    node.select(".node-circle").style("filter", "grayscale(100%)").attr("stroke-width", 2);
    node.select(".node-image").style("filter", "grayscale(100%)");
    node.select(".node-text").style("fill", "#040404").style("font-weight", "normal");
  });

  // ===================== Tick 更新（加入平行边偏移计算） =====================
  simulation.on("tick", () => {
    // 1. 更新连线坐标
    link.attr("d", d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1; // 防止除以0
      
      // 计算偏移量：间距设为 15px
      const offset = (d.linkIndex - (d.linkTotal - 1) / 2) * 15;
      
      // 计算垂直方向的单位向量（法向量）
      const nx = -dy / dist;
      const ny = dx / dist;

      // 如果有多条线，则进行偏移；否则画直线
      if (d.linkTotal > 1) {
        return `M${d.source.x + nx * offset},${d.source.y + ny * offset}L${d.target.x + nx * offset},${d.target.y + ny * offset}`;
      } else {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
      }
    });

    // 2. 更新标签坐标（跟随连线偏移）
    linkLabel
      .attr("x", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const offset = (d.linkIndex - (d.linkTotal - 1) / 2) * 15;
        return (d.source.x + d.target.x) / 2 + (-dy / dist) * offset;
      })
      .attr("y", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const offset = (d.linkIndex - (d.linkTotal - 1) / 2) * 15;
        return (d.source.y + d.target.y) / 2 + (dx / dist) * offset - 5;
      });

    // 3. 更新节点位置
    node.attr("transform", d => `translate(${d.x}, ${d.y})`);
  });

  // 拖拽事件处理
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }

  return simulation;
}

// 加载数据
export async function loadGraphData(apiUrl) {
  try {
    const res = await fetch(apiUrl);
    return await res.json();
  } catch (e) {
    console.error(e);
    return { nodes: [], links: [] };
  }
}

export { d3 };
