// services/pdf.service.js
// Generates a beautifully formatted PDF from the Research Dossier JSON.
// Uses PDFKit to stream bytes directly — no temp files.

import PDFDocument from 'pdfkit';

// ── Colour palette ─────────────────────────────────────────────────────────
const C = {
  bg:         '#0F172A',  // Dark navy background
  heading:    '#38BDF8',  // Sky blue for section headings
  subheading: '#7DD3FC',  // Lighter blue for sub-headings
  body:       '#CBD5E1',  // Slate gray for body text
  accent:     '#F59E0B',  // Amber for timestamps / highlights
  muted:      '#475569',  // Muted gray for metadata
  white:      '#F8FAFC',  // Near white for main text
};

export const streamDossierAsPDF = (dossier, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: dossier.topic || 'CricScript Research Dossier',
      Author: 'CricScript AI',
    },
  });

  // Pipe stream directly into the HTTP response
  doc.pipe(res);

  const report = dossier.synthesizedReport || {};

  // ── PAGE HEADER ────────────────────────────────────────────────────────
  doc
    .rect(0, 0, doc.page.width, 90)
    .fill(C.bg);

  doc
    .fillColor(C.heading)
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('🏏 CricScript AI — Research Dossier', 50, 25, { align: 'center' });

  doc
    .fillColor(C.muted)
    .fontSize(9)
    .font('Helvetica')
    .text(`Generated: ${new Date(dossier.generatedAt).toLocaleString('en-IN')}   |   Est. words: ${dossier.estimatedWordCount || '—'}`, 50, 60, { align: 'center' });

  doc.moveDown(2);

  // ── TOPIC TITLE ────────────────────────────────────────────────────────
  sectionHeading(doc, dossier.topic || 'Research Topic');

  // ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────
  if (report.executiveSummary) {
    subheading(doc, 'Executive Summary');
    bodyText(doc, report.executiveSummary);
    doc.moveDown(1);
  }

  // ── PRE-MATCH CONTEXT ─────────────────────────────────────────────────
  if (report.preMatchContext?.length > 0) {
    subheading(doc, 'Pre-Match Context');
    report.preMatchContext.forEach(item => {
      doc.fillColor(C.accent).fontSize(10).font('Helvetica-Bold').text(`▸ ${item.angle}`);
      doc.fillColor(C.body).fontSize(9).font('Helvetica').text(item.detail, { indent: 14, lineGap: 3 });
      doc.moveDown(0.4);
    });
    doc.moveDown(1);
  }

  // ── KEY CHRONOLOGY ────────────────────────────────────────────────────
  if (report.keyChronology?.length > 0) {
    subheading(doc, 'Key Chronology & Turning Points');
    report.keyChronology.forEach((item, i) => {
      doc.fillColor(C.accent).fontSize(10).font('Helvetica-Bold').text(`${item.timestampOrDate}`);
      doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold').text(item.eventDescription);
      doc.fillColor(C.muted).fontSize(9).font('Helvetica-Oblique').text(`Why it mattered: ${item.significance}`, { lineGap: 2 });
      doc.moveDown(0.6);
    });
    doc.moveDown(0.5);
  }

  // ── TACTICAL BREAKDOWN ────────────────────────────────────────────────
  if (report.tacticalBreakdown?.length > 0) {
    subheading(doc, 'Tactical Breakdown');
    report.tacticalBreakdown.forEach(item => {
      doc.fillColor(C.subheading).fontSize(10).font('Helvetica-Bold').text(item.subheading);
      doc.fillColor(C.body).fontSize(9).font('Helvetica').text(item.analysis, { lineGap: 3 });
      if (item.supportingData) {
        doc.fillColor(C.accent).fontSize(8).font('Helvetica-Oblique').text(`Data: ${item.supportingData}`);
      }
      doc.moveDown(0.6);
    });
    doc.moveDown(0.5);
  }

  // ── VERIFIED QUOTES ───────────────────────────────────────────────────
  if (report.verifiedQuotes?.length > 0) {
    subheading(doc, 'Verified Quotes');
    report.verifiedQuotes.forEach(q => {
      doc.fillColor(C.white).fontSize(10).font('Helvetica-BoldOblique').text(`"${q.quote}"`);
      doc.fillColor(C.accent).fontSize(9).font('Helvetica-Bold').text(`— ${q.speaker}`);
      doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(q.context);
      doc.moveDown(0.8);
    });
    doc.moveDown(0.5);
  }

  // ── STAT HIGHLIGHTS ───────────────────────────────────────────────────
  if (report.statHighlights?.length > 0) {
    subheading(doc, 'Statistical Highlights');
    report.statHighlights.forEach(s => {
      doc.fillColor(C.accent).fontSize(12).font('Helvetica-Bold').text(s.value, { continued: true });
      doc.fillColor(C.body).fontSize(9).font('Helvetica').text(`   ${s.metric}`);
      doc.fillColor(C.muted).fontSize(8).font('Helvetica-Oblique').text(s.historicalContext, { lineGap: 2 });
      doc.moveDown(0.5);
    });
    doc.moveDown(0.5);
  }

  // ── SOURCES ───────────────────────────────────────────────────────────
  if (report.sources?.length > 0) {
    subheading(doc, 'Sources & References');
    report.sources.forEach((src, i) => {
      doc.fillColor(C.subheading).fontSize(9).font('Helvetica').text(`${i + 1}. ${src.title}`, { link: src.url, underline: true });
      doc.fillColor(C.muted).fontSize(7).font('Helvetica').text(src.url);
      doc.moveDown(0.3);
    });
  }

  doc.end();
};


// ── PDF Helpers ─────────────────────────────────────────────────────────────

const sectionHeading = (doc, text) => {
  doc
    .fillColor(C.heading)
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(text, { underline: false });
  doc.moveDown(0.8);
};

const subheading = (doc, text) => {
  doc
    .fillColor(C.subheading)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(text.toUpperCase());
  doc
    .moveTo(doc.x, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke(C.muted);
  doc.moveDown(0.6);
};

const bodyText = (doc, text) => {
  doc
    .fillColor(C.body)
    .fontSize(9)
    .font('Helvetica')
    .text(text, { lineGap: 4, paragraphGap: 6 });
};
