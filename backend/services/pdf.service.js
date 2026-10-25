// backend/services/pdf.service.js
// Generates a world-class, high-contrast, premium sports documentary PDF.
// Crisp dark typography on clean white canvas with cricket green and gold accents.

import PDFDocument from 'pdfkit';

// ── Premium High-Contrast Color Palette for PDF Printing/Viewing ───────────
const THEME = {
  primary:     '#064E3B', // Deep Cricket Turf Green (Lord's / MCG Heritage)
  primaryDark: '#022C22', // Deep forest night
  accent:      '#B45309', // Deep Cricket Leather Amber / Gold
  textMain:    '#0F172A', // Ultra-crisp slate-900 (100% readable)
  textBody:    '#334155', // Crisp slate-700 for paragraphs
  textMuted:   '#64748B', // Slate-500 for captions and metadata
  cardBg:      '#F8FAFC', // Very soft slate-50 for callout cards
  cardBorder:  '#E2E8F0', // Slate-200 border
  divider:     '#CBD5E1', // Slate-300 divider lines
  quoteBg:     '#F1F5F9', // Slate-100 for quotes
};

export const streamDossierAsPDF = (dossier, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 48,
    bufferPages: true, // Enables dynamic multi-page numbering
    info: {
      Title: dossier.topic || 'CricScript Research Dossier',
      Author: 'CricScript AI - Documentary Studio',
      Subject: 'Cricket Investigative Research Brief',
      Keywords: 'cricket, documentary, analysis, stats, research',
    },
  });

  doc.pipe(res);

  const report = dossier.synthesizedReport || {};

  // ── 1. HEADER BANNER ────────────────────────────────────────────────────
  const pageWidth = doc.page.width;
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  // Turf Green Header Block
  doc
    .rect(0, 0, pageWidth, 95)
    .fill(THEME.primary);

  // Gold accent strip at bottom of banner
  doc
    .rect(0, 92, pageWidth, 3)
    .fill(THEME.accent);

  // Brand Tagline
  doc
    .fillColor('#FFFFFF')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('CRICSCRIPT AI', margin, 24, { characterSpacing: 1.5 });

  doc
    .fillColor('#A7F3D0') // Soft mint green
    .fontSize(9)
    .font('Helvetica')
    .text('INVESTIGATIVE CRICKET RESEARCH BRIEF • CONFIDENTIAL', margin, 46);

  doc
    .fillColor('#E2E8F0')
    .fontSize(8)
    .font('Helvetica')
    .text(
      `Generated: ${new Date(dossier.generatedAt || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}   |   Word Target: ~${dossier.estimatedWordCount || 500} words   |   ${dossier.includeMedia ? 'Media: Photos & Links Verified' : 'Verification: Ground Truth'}`,
      margin,
      62
    );

  doc.y = 115;

  // ── 2. TOPIC TITLE ──────────────────────────────────────────────────────
  doc
    .fillColor(THEME.textMain)
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(dossier.topic || 'Cricket Research Dossier', { lineGap: 2 });

  doc.moveDown(0.3);
  doc
    .strokeColor(THEME.divider)
    .lineWidth(1)
    .moveTo(margin, doc.y)
    .lineTo(pageWidth - margin, doc.y)
    .stroke();

  doc.moveDown(0.8);

  // ── 3. EXECUTIVE SUMMARY ────────────────────────────────────────────────
  if (report.executiveSummary) {
    drawSectionHeader(doc, '1. Executive Summary', margin, pageWidth);
    doc
      .fillColor(THEME.textBody)
      .fontSize(9.5)
      .font('Helvetica')
      .text(report.executiveSummary, {
        lineGap: 4,
        paragraphGap: 6,
        align: 'justify',
      });
    doc.moveDown(1);
  }

  // ── 4. PRE-MATCH CONTEXT ────────────────────────────────────────────────
  if (report.preMatchContext && report.preMatchContext.length > 0) {
    checkPageSpace(doc, 100);
    drawSectionHeader(doc, '2. Pre-Match Context & Historical Stakes', margin, pageWidth);

    report.preMatchContext.forEach((item) => {
      checkPageSpace(doc, 45);
      const startY = doc.y;

      // Small card background
      doc
        .roundedRect(margin, startY, contentWidth, 36, 4)
        .fillAndStroke(THEME.cardBg, THEME.cardBorder);

      doc
        .fillColor(THEME.accent)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(`▸ ${item.angle.toUpperCase()}`, margin + 10, startY + 6);

      doc
        .fillColor(THEME.textBody)
        .fontSize(8.5)
        .font('Helvetica')
        .text(item.detail, margin + 10, startY + 18, {
          width: contentWidth - 20,
          lineGap: 2,
        });

      doc.y = startY + 42;
    });

    doc.moveDown(0.8);
  }

  // ── 5. KEY CHRONOLOGY & TURNING POINTS ──────────────────────────────────
  if (report.keyChronology && report.keyChronology.length > 0) {
    checkPageSpace(doc, 120);
    drawSectionHeader(doc, '3. Key Chronology & Match Turning Points', margin, pageWidth);

    report.keyChronology.forEach((item, index) => {
      checkPageSpace(doc, 50);

      // Bullet dot in green
      doc.circle(margin + 6, doc.y + 5, 3.5).fill(THEME.primary);

      // Over/Timestamp
      doc
        .fillColor(THEME.accent)
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .text(item.timestampOrDate, margin + 16, doc.y, { continued: true });

      doc
        .fillColor(THEME.textMain)
        .font('Helvetica-Bold')
        .text(` — ${item.eventDescription}`);

      doc.moveDown(0.2);

      // Significance
      doc
        .fillColor(THEME.textMuted)
        .fontSize(8.5)
        .font('Helvetica-Oblique')
        .text(`Why this mattered: ${item.significance}`, margin + 16, doc.y, {
          lineGap: 2,
        });

      doc.moveDown(0.6);
    });

    doc.moveDown(0.6);
  }

  // ── 6. TACTICAL & ANALYTICAL BREAKDOWN ──────────────────────────────────
  if (report.tacticalBreakdown && report.tacticalBreakdown.length > 0) {
    checkPageSpace(doc, 100);
    drawSectionHeader(doc, '4. Tactical & Analytical Breakdown', margin, pageWidth);

    report.tacticalBreakdown.forEach((item) => {
      checkPageSpace(doc, 60);

      doc
        .fillColor(THEME.primaryDark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(item.subheading);

      doc.moveDown(0.2);

      doc
        .fillColor(THEME.textBody)
        .fontSize(9)
        .font('Helvetica')
        .text(item.analysis, { lineGap: 3 });

      if (item.supportingData) {
        doc.moveDown(0.2);
        doc
          .fillColor(THEME.accent)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(`[DATA]: ${item.supportingData}`);
      }

      doc.moveDown(0.6);
    });

    doc.moveDown(0.6);
  }

  // ── 7. VERIFIED QUOTES ──────────────────────────────────────────────────
  if (report.verifiedQuotes && report.verifiedQuotes.length > 0) {
    checkPageSpace(doc, 100);
    drawSectionHeader(doc, '5. Verified Quotes & Post-Match Admissions', margin, pageWidth);

    report.verifiedQuotes.forEach((q) => {
      checkPageSpace(doc, 50);

      const quoteStartY = doc.y;

      // Vertical line on left
      doc
        .rect(margin, quoteStartY, 3, 34)
        .fill(THEME.primary);

      doc
        .fillColor(THEME.textMain)
        .fontSize(9)
        .font('Helvetica-Oblique')
        .text(`"${q.quote}"`, margin + 12, quoteStartY + 2, {
          width: contentWidth - 20,
          lineGap: 2,
        });

      doc
        .fillColor(THEME.accent)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(`— ${q.speaker}`, margin + 12, doc.y + 2, { continued: true });

      doc
        .fillColor(THEME.textMuted)
        .font('Helvetica')
        .text(`  (${q.context || 'Press Conference / Broadcast'})`);

      doc.y += 12;
    });

    doc.moveDown(0.8);
  }

  // ── 8. STATISTICAL ANOMALIES TABLE ──────────────────────────────────────
  if (report.statHighlights && report.statHighlights.length > 0) {
    checkPageSpace(doc, 100);
    drawSectionHeader(doc, '6. Statistical Highlights & Anomalies', margin, pageWidth);

    // Table Header
    const col1 = margin + 10;
    const col2 = margin + 180;
    const col3 = margin + 270;
    const tableTop = doc.y;

    doc.rect(margin, tableTop, contentWidth, 20).fill(THEME.cardBg);

    doc
      .fillColor(THEME.textMain)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text('METRIC', col1, tableTop + 5);

    doc.text('VALUE', col2, tableTop + 5);
    doc.text('HISTORICAL CONTEXT', col3, tableTop + 5);

    doc.y = tableTop + 24;

    report.statHighlights.forEach((s) => {
      checkPageSpace(doc, 30);
      const rowY = doc.y;

      // Subtle bottom line
      doc
        .strokeColor(THEME.cardBorder)
        .lineWidth(0.5)
        .moveTo(margin, rowY + 18)
        .lineTo(pageWidth - margin, rowY + 18)
        .stroke();

      doc
        .fillColor(THEME.textBody)
        .fontSize(8.5)
        .font('Helvetica')
        .text(s.metric, col1, rowY, { width: 160 });

      doc
        .fillColor(THEME.accent)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text(s.value, col2, rowY, { width: 80 });

      doc
        .fillColor(THEME.textMuted)
        .fontSize(8)
        .font('Helvetica')
        .text(s.historicalContext || '—', col3, rowY, { width: 190 });

      doc.y = rowY + 22;
    });

    doc.moveDown(0.8);
  }

  // ── 9. SOURCES ──────────────────────────────────────────────────────────
  if (report.sources && report.sources.length > 0) {
    checkPageSpace(doc, 80);
    drawSectionHeader(doc, '7. Ground-Truth Verified Sources', margin, pageWidth);

    report.sources.slice(0, 6).forEach((src, idx) => {
      checkPageSpace(doc, 22);

      doc
        .fillColor(THEME.primary)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text(`${idx + 1}. ${src.title}`, margin, doc.y, {
          link: src.url,
          underline: true,
          continued: false,
        });

      doc
        .fillColor(THEME.textMuted)
        .fontSize(7.5)
        .font('Helvetica')
        .text(src.url, margin + 14, doc.y + 1, { lineBreak: true });

      doc.moveDown(0.3);
    });

    doc.moveDown(0.8);
  }

  // ── 10. VISUAL ARCHIVES & PHOTO REFERENCES (IF ENABLED) ──────────────────
  if (dossier.collectedImages && dossier.collectedImages.length > 0) {
    checkPageSpace(doc, 80);
    drawSectionHeader(doc, '8. Verified Archival Photography & Visual References', margin, pageWidth);

    dossier.collectedImages.slice(0, 6).forEach((img, idx) => {
      checkPageSpace(doc, 24);

      doc
        .fillColor(THEME.accent)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text(`📸 Photo Reference [${idx + 1}]: ${img.title || 'Archival Match Moment'}`, margin, doc.y, {
          link: img.url,
          underline: true,
        });

      doc
        .fillColor(THEME.textMuted)
        .fontSize(7.5)
        .font('Helvetica')
        .text(img.url, margin + 14, doc.y + 1, { lineBreak: true });

      doc.moveDown(0.3);
    });
  }

  // ── 11. MULTI-PAGE NUMBERING & FOOTERS ──────────────────────────────────
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    // Skip banner area on page 0
    const footerY = doc.page.height - 30;

    doc
      .strokeColor(THEME.divider)
      .lineWidth(0.5)
      .moveTo(margin, footerY - 5)
      .lineTo(pageWidth - margin, footerY - 5)
      .stroke();

    doc
      .fillColor(THEME.textMuted)
      .fontSize(7.5)
      .font('Helvetica')
      .text(
        'CricScript AI — Personal Cadence-RAG & Documentary Research Studio',
        margin,
        footerY,
        { align: 'left' }
      );

    doc.text(
      `Page ${i + 1} of ${pages.count}`,
      pageWidth - margin - 70,
      footerY,
      { align: 'right' }
    );
  }

  doc.end();
};

// ── Helpers ────────────────────────────────────────────────────────────────
function drawSectionHeader(doc, title, margin, pageWidth) {
  doc
    .fillColor(THEME.primaryDark)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(title.toUpperCase());

  doc
    .strokeColor(THEME.accent)
    .lineWidth(1.5)
    .moveTo(margin, doc.y + 2)
    .lineTo(margin + 40, doc.y + 2)
    .stroke();

  doc
    .strokeColor(THEME.cardBorder)
    .lineWidth(0.5)
    .moveTo(margin + 42, doc.y + 2)
    .lineTo(pageWidth - margin, doc.y + 2)
    .stroke();

  doc.moveDown(0.6);
}

function checkPageSpace(doc, requiredHeight) {
  if (doc.y + requiredHeight > doc.page.height - 60) {
    doc.addPage();
  }
}
