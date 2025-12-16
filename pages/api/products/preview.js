import formidable from "formidable";
import xlsx from "xlsx";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const form = formidable({ uploadDir: "./uploads", keepExtensions: true });
    const [fields, files] = await form.parse(req);

    if (!files.file || !files.file[0])
      return res.status(400).json({ message: "No file uploaded" });

    const filePath = files.file[0].filepath;

    const workbook = xlsx.readFile(filePath);

    const sheets = workbook.SheetNames;
    const sheetIndex = Number(fields.sheetIndex ?? 0);

    const sheet = workbook.Sheets[sheets[sheetIndex]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    return res.status(200).json({
      message: "Preview generated",
      filePath,
      sheets,
      sheetIndex,
      rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Preview error" });
  }
}
