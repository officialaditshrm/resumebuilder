import express from 'express'
import { updateResume, addResume, deleteResume, listResumes, displayResume } from '../controllers/resumeController.js'
import fs from 'fs'
import puppeteer, { executablePath } from 'puppeteer'
import dotenv from 'dotenv'

dotenv.config()

const resumeRouter = express.Router()

resumeRouter.post("/", addResume)
resumeRouter.put("/:id", updateResume)
resumeRouter.delete("/:id", deleteResume)
resumeRouter.get("/", listResumes)
resumeRouter.get("/:id", displayResume)
resumeRouter.post("/export-pdf", async (req, res) => {
  const { html } = req.body;

  const css = fs.readFileSync("./HiddenResume.css", "utf8");

  const fullHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.NODE_ENV === "production" 
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {top: "0.3in", bottom: "0.3in", left: 0, right: 0},
  });

  await browser.close();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.send(pdfBuffer);
});

export default resumeRouter