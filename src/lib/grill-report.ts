type GrillReport = { title: string; heading: string; rank: string; stamp: string; score: number; scoreLabel: string; rows: string[][]; footer: string; url: string; serif: string; sans: string };

/** A locally rendered Institute result card, using the same bilingual, text-free artwork. */
export async function createGrillReport(report: GrillReport) {
  await document.fonts.ready;
  const art = new Image(); art.src = "/illustrations/grill/hero-600.webp";
  await art.decode();
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#f4f0e7"; ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = "#161513"; ctx.lineWidth = 2; ctx.strokeRect(55, 65, 970, 1225);
  ctx.fillStyle = "#c4362c"; ctx.fillRect(55, 55, 970, 10);
  function text(value: string, x: number, y: number, size: number, sans = false, red = false) {
    ctx!.font = `${sans ? 500 : 700} ${size}px ${sans ? report.sans : report.serif}`;
    ctx!.fillStyle = red ? "#c4362c" : "#161513"; ctx!.fillText(value, x, y);
  }
  text("DZIADER.SI", 105, 135, 42); text(`IBD-G1 / ${report.heading}`, 105, 186, 23, true);
  text(report.title, 105, 287, 79);
  ctx.font = `700 39px ${report.serif}`;
  const words = report.rank.split(" "); let line = "", y = 350;
  for (const word of words) {
    if (ctx.measureText(`${line} ${word}`).width > 840 && line) { text(line, 105, y, 39); line = word; y += 44; }
    else line = line ? `${line} ${word}` : word;
  }
  text(line, 105, y, 39);
  ctx.drawImage(art, 445, 395, 525, 350);
  text(report.scoreLabel, 105, 465, 25, true); text(String(report.score), 105, 600, 130, false, true);
  ctx.save(); ctx.translate(105, 690); ctx.rotate(-0.055); ctx.strokeStyle = "#c4362c"; ctx.lineWidth = 3;
  ctx.font = `500 22px ${report.sans}`; const stampWidth = Math.min(820, ctx.measureText(report.stamp.toUpperCase()).width + 44);
  ctx.strokeRect(0, 0, stampWidth, 60); ctx.strokeRect(5, 5, stampWidth - 10, 50); text(report.stamp.toUpperCase(), 22, 38, 22, true, true); ctx.restore();
  report.rows.forEach(([label, value], i) => {
    const rowY = 830 + i * 68;
    text(label, 105, rowY, 29, true); ctx.textAlign = "right"; text(value, 970, rowY, 33, true); ctx.textAlign = "left";
    ctx.strokeStyle = "#d8d0c0"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(105, rowY + 18); ctx.lineTo(975, rowY + 18); ctx.stroke();
  });
  text(report.url, 105, 1198, 29, true); text(report.footer, 105, 1245, 20, true);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("PNG export failed")), "image/png"));
  return URL.createObjectURL(blob);
}
