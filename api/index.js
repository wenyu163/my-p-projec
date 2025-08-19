import fetch from "node-fetch";

export default async function handler(req, res) {
  const targetBase = "http://dsm2.laihongguang.top:5245"; // 源站地址 + 端口
  const targetUrl = targetBase + req.url;

  // 处理 body
  let body = null;
  if (!["GET","HEAD"].includes(req.method)) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = Buffer.concat(chunks);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(
          ([key]) => !["host","content-length"].includes(key.toLowerCase())
        )
      ),
      body,
    });

    // 复制状态码
    res.status(response.status);

    // 复制响应头
    response.headers.forEach((value, key) => res.setHeader(key, value));

    // 复制响应体
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).send("Proxy Error: " + err.message);
  }
}
