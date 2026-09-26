async function getPinImage() {
  try {
    const res = await fetch("https://www.pinterest.com/pin/471752129741630645/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:image"/);
    console.log("OG IMAGE:", ogImageMatch ? ogImageMatch[1] : "not found");
    const regex736 = /https:\/\/i\.pinimg\.com\/(?:originals|736x)\/[a-z0-9/._-]+/gi;
    const matches = html.match(regex736) || [];
    console.log("MATCHES:", [...new Set(matches)]);
  } catch (e) {
    console.error(e);
  }
}
getPinImage();
