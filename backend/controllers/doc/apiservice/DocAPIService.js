import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import User from "../../../models/UserModel.js";

export const DocAPIService = async (req, res) => {
  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.resolve(
      "./controllers/doc/apiservice",
      "template_checklist_promote_api_service.docx"
    ),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  // Render the document
  doc.render({
    nama_project: req.body.nama_project,
    sisi_project: req.body.sisi_project,
    project_code: req.body.project_code,
    tanggal_promote: req.body.tanggal_promote,
    new_existing: req.body.new_existing,
    changes: req.body.changes,
    unit_pengguna: req.body.unit_pengguna,
    week_request: req.body.week_request,
    week_eksekusi: req.body.week_eksekusi,
    isian_credential: req.body.isian_credential,
    durasi_isi_credential: req.body.durasi_isi_credential,
    durasi_restart_gate: req.body.durasi_restart_gate,
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  fs.writeFileSync(
    path.resolve(
      "./controllers/doc/apiservice",
      `Checklist Promote ${req.body.nama_project} Sisi ${req.body.sisi_project}.docx`
    ),
    buf
  );
  // Set the headers for the response
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename= Checklist Promote ${req.body.nama_project} Sisi ${req.body.sisi_project}.docx`
  );

  // Send the file content in the response
  const filepath = path.resolve(
    `./controllers/doc/apiservice`,
    `Checklist Promote ${req.body.nama_project} Sisi ${req.body.sisi_project}.docx`
  );

  res.download(filepath);

  const user = await User.findOne({
    where: {
      id: req.session.userId,
    },
  });
  try {
    const transporter = nodemailer.createTransport({
      secure: true, // Sensitive
      requireTLS: true, // Sensitive
      host: "smtp.gmail.com",
      port: "587",
      auth: {
        user: `${process.env.EMAIL_API}`,
        pass: `${process.env.PASSWORD_API}`,
      }, // Sensitive
    });

    let message = ` <tr><td><h1>Hello ${user.name}/${user.username},</h1></td></tr>
    <tr><td><h2>This is from Bank BTN E-Report Management System</h2></td></tr>
    <h2>Here are the document ${req.body.nama_project} that you've generated</h2>`;

    transporter
      .sendMail({
        from: `${process.env.EMAIL_API}`,
        to: `${user.email}`,
        subject:
          "Generated Middleware Checklist Promote - BTN E-Report Management System",
        html: message,
        attachments: [
          {
            filename: `Checklist Promote ${req.body.nama_project} Sisi ${req.body.sisi_project}.docx`,
            path: `./controllers/doc/apiservice/Checklist Promote ${req.body.nama_project} Sisi ${req.body.sisi_project}.docx`,
          },
        ],
      })
      .then(console.info)
      .catch(console.error);
  } catch (error) {}
};