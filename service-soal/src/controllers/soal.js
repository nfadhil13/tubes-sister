const docx = require("docx");
const downloadFile = require("../util/docxExtractorFromTemplate");
const shuffle = require("shuffle-array");
const fs = require("fs");
const axios = require("axios").default;
const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } =
  docx;

const columnWidth = [612, 2091, 6111];

exports.generateTemplate = async (req, res, next) => {
  try {
    const jumlahSoal = req.body.jumlahSoal || 40;
    const jumlahPilihan = req.body.pilihanJawaban || 5;
    const email = req.body.email;

    const tabel = [];
    const pilihan = [];

    for (let j = 0; j < jumlahPilihan; j++) {
      pilihan.push(
        createRow(
          ``,
          `${String.fromCharCode(65 + j)}`,
          `<Tulis opsi jawaban ${String.fromCharCode(65 + j)}>`
        )
      );
    }

    for (let i = 0; i < jumlahSoal; i++) {
      tabel.push(
        new Table({
          columnWidths: columnWidth,
          rows: [
            createRow(`${i + 1}`, "Pertanyaan", "<Tulis pertanyaan di sini>"),
            ...pilihan,
            createRow(``, "Kunci", "<Tulis kunci jawaban (abjad nya saja)>")
          ]
        })
      );
      tabel.push(new Paragraph(""));
    }

    const doc = new Document({
      sections: [
        {
          children: tabel
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync(
      `public/docx/template-soal/template-soal(${email}).docx`,
      buffer
    );

    const result = await axios.post(
      process.env.BASE_SERVICE_EMAIL + "/email/send-template",
      {
        urlFile: `http://localhost:5002/template/template-soal(${email}).docx`,
        email: email
      }
    );

    res.status(200).json({
      message: "Sukses generate template",
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const createRow = (contentCol1, contentCol2, contentCol3) => {
  try {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: columnWidth[0],
            type: WidthType.DXA
          },
          children: [new Paragraph(contentCol1)]
        }),
        new TableCell({
          width: {
            size: columnWidth[1],
            type: WidthType.DXA
          },
          children: [new Paragraph(contentCol2)]
        }),
        new TableCell({
          width: {
            size: columnWidth[2],
            type: WidthType.DXA
          },
          children: [new Paragraph(contentCol3)]
        })
      ]
    });
  } catch (error) {
    console.log(error);
  }
};

exports.acakSoal = async (req, res, next) => {
  try {
    const email = req.body.email;
    const docxURL = req.body.docxURL;
    const jumlahAcakan = req.body.totalAcak;
    const defaultSoal = await downloadFile.extractDocxFromURL(docxURL);
    const finalResult = [];
    for (let i = 0; i < jumlahAcakan; i++) {
      const shuffleResult = shuffle(defaultSoal).map((value) => {
        value.pilihan = shuffle(value.pilihan);
        return value;
      });
      console.log(shuffleResult);
      finalResult.push(shuffleResult);
    }
    res.json({
      finalResult
    });
  } catch (e) {
    next(e);
  }
};
