export default async function handler(req, res) {
  const targetBase = "http://dsm2.laihongguang.top:5245"; // 源站地址 + 端口

  // 拼接目标 URL，保留路径和查询参数
  const targetUrl = targetBase + req.url;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: undefined }, // 去掉 host 避免冲突
      body: req.method === "GET" || req.method === "HEAD" ? null : req,
    });

    // 复制状态码
    res.status(response.status);

    // 复制响应头
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // 复制响应体
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).send("Proxy Error: " + err.message);
  }
}
