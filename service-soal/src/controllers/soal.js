const docx = require("docx");
const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } =
  docx;

const columnWidth = [612, 2091, 6111];

exports.generateTemplate = async (req, res, next) => {
  try {
    const jumlahSoal = req.body.jumlahSoal || 40;

    const tabel = [];

    for (let i = 0; i < jumlahSoal; i++) {
      tabel.push(
        new Table({
          columnWidths: columnWidth,
          rows: [
            createRow(`${i + 1}`, "Pertanyaan", "<Tulis pertanyaan di sini>"),
            createRow(``, "A", "<Tulis opsi jawaban A>"),
            createRow(``, "B", "<Tulis opsi jawaban B>"),
            createRow(``, "C", "<Tulis opsi jawaban C>"),
            createRow(``, "D", "<Tulis opsi jawaban D>"),
            createRow(``, "E", "<Tulis opsi jawaban E>"),
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

    const b64string = await Packer.toBase64String(doc);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=template-soal.docx"
    );
    res.send(Buffer.from(b64string, "base64"));
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
