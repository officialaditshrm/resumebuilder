import express from 'express'
import { updateResume, addResume, deleteResume, listResumes, displayResume } from '../controllers/resumeController.js'
import generatePDF from '../controllers/pdfController.js'

const resumeRouter = express.Router()

resumeRouter.post("/", addResume)
resumeRouter.put("/:id", updateResume)
resumeRouter.delete("/:id", deleteResume)
resumeRouter.get("/", listResumes)
resumeRouter.get("/:id", displayResume)
resumeRouter.post('/export-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'Missing HTML content' });

    const pdfBuffer = await generatePDF(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default resumeRouter