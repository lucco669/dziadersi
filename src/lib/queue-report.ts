type Report = { title: string; heading: string; outcome: string; stamp: string; code: string; score: number; scoreLabel: string; rows: string[][]; footer: string; url: string; serif: string; sans: string };

/** A local, downloadable portrait document; fonts come from the already loaded page. */
export async function createQueueReport(report: Report) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const ink = "#161513", red = "#c4362c";
  ctx.fillStyle = "#f4f0e7"; ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = red; ctx.fillRect(55, 55, 970, 10);
  ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.strokeRect(55, 65, 970, 1230);
  function text(value: string, x: number, y: number, size: number, sans = false, color = ink) {
    ctx!.font = `${sans ? 500 : 700} ${size}px ${sans ? report.sans : report.serif}`;
    ctx!.fillStyle = color; ctx!.fillText(value, x, y);
  }
  function wrap(value: string, y: number, size: number, maxWidth: number, sans = false) {
    ctx!.font = `${sans ? 500 : 700} ${size}px ${sans ? report.sans : report.serif}`;
    let line = "";
    for (const word of value.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx!.measureText(next).width > maxWidth && line) { text(line, 105, y, size, sans); y += size * 1.18; line = word; } else line = next;
    }
    if (line) text(line, 105, y, size, sans);
    return y + size * 1.18;
  }
  text("DZIADER.SI", 105, 139, 42);
  text(`IBD-K1 / ${report.code}`, 105, 190, 23, true);
  text(report.heading, 105, 274, 26, true);
  const y = wrap(report.outcome, 351, 69, 870);
  ctx.strokeStyle = red; ctx.lineWidth = 3; ctx.strokeRect(105, y + 18, 355, 62); ctx.strokeRect(110, y + 23, 345, 52);
  text(report.stamp, 127, y + 59, 28, true, red);
  text(report.scoreLabel, 105, 625, 26, true);
  text(String(report.score), 105, 765, 150, false, red);
  report.rows.forEach(([label, value], i) => {
    const rowY = 840 + i * 66;
    ctx.strokeStyle = "#d8d0c0"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(105, rowY + 17); ctx.lineTo(975, rowY + 17); ctx.stroke();
    text(label, 105, rowY, 27, true);
    ctx.textAlign = "right"; text(value, 975, rowY, 29, true); ctx.textAlign = "left";
  });
  wrap(report.title, 1170, 30, 870);
  text(report.url, 105, 1221, 22, true);
  text(report.footer, 105, 1260, 17, true);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Export failed")), "image/png"));
  return URL.createObjectURL(blob);
}
