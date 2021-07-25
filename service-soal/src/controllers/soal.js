const docx = require("docx");
const downloadFile = require("../util/docxExtractorFromTemplate");
const shuffle = require("shuffle-array");
const fs = require("fs");
var AdmZip = require("adm-zip");
const MessageBroker = require("../util/rabbitmq/MessageBroker");
const axios = require("axios").default;
const uuid = require("uuid")
const path = require("path");
const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } =
  docx;

const columnWidth = [612, 2091, 6111];

exports.generateTemplate = async (jumlahSoal, jumlahPilihan, email) => {
  try {
    const tabel = [];
    const pilihan = [];

    console.log("Jumlah pilihan adalah " + jumlahPilihan)
    for (let j = 0; j < jumlahPilihan; j++) {
      pilihan.push(
        createRow(
          ``,
          `${String.fromCharCode(65 + j)}`,
          `<Tulis opsi jawaban ${String.fromCharCode(65 + j)}>`
        )
      );
    }
    console.log("Jumlah soal adalah " + jumlahSoal)
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
      path.join(
        __dirname,
        `../../public/docx/template-soal/template-soal(${uuid.v4()}).docx`
      ),
      buffer
    );

    const broker = await MessageBroker.getInstance();
    await broker.sendMessage(
      "emailService/template-soal",
      Buffer.from(
        JSON.stringify({
          urlFile: `https://service-soal.nfadhil.me/template/template-soal(${uuid.v4()}).docx`,
          email: email
        })
      )
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
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

exports.acakSoal = async (email, docxURL, jumlahAcakan) => {
  try {
    const defaultSoal = await downloadFile.extractDocxFromURL(docxURL);
    const finalResult = [];
    for (let i = 0; i < jumlahAcakan; i++) {
      const shuffleResult = shuffle(defaultSoal).map((value) => {
        value.pilihan = shuffle(value.pilihan);
        return value;
      });
      // console.log(shuffleResult);
      finalResult.push(shuffleResult);
    }
    const listFileName = await generateRandomizeResult(finalResult, email);

    const zip = new AdmZip();

    for (const fileName of listFileName) {
      zip.addLocalFile(
        path.join(__dirname, `../../public/docx/hasil-acak/${fileName}`)
      );
    }

    zip.writeZip(
      path.join(
        __dirname,
        `../../public/docx/hasil-acak/hasil-acak-soal(${email}).zip`
      )
    );

    console.log("mengirim acak soal");

    const broker = await MessageBroker.getInstance();
    await broker.sendMessage(
      "emailService/acak-soal",
      Buffer.from(
        JSON.stringify({
          urlFile: `https://service-soal.nfadhil.me/docx/hasil-acak-soal(${email}).zip`,
          email: email
        })
      )
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const generateRandomizeResult = async (soalCollection, email) => {
  try {
    const listNameFile = [];
    // ini iterasi untuk kumpulan soal nya (1 array 1 docx)
    for (const [l, soal] of soalCollection.entries()) {
      //ini iterasi untuk butir soalnya
      let tabel = [];
      for (const [m, noSoal] of soal.entries()) {
        let pilihan = [];
        let kunjaw = "";

        for (let j = 0; j < noSoal.pilihan.length; j++) {
          pilihan.push(
            createRow(
              ``,
              `${String.fromCharCode(65 + j)}`,
              noSoal.pilihan[j].pilihan
            )
          );
          if (noSoal.kunjaw === noSoal.pilihan[j].kunciPilihan) {
            kunjaw = `${String.fromCharCode(65 + j)}`;
          }
        }

        tabel.push(
          new Table({
            columnWidths: columnWidth,
            rows: [
              createRow(`${m + 1}`, "Pertanyaan", noSoal.soal),
              ...pilihan,
              createRow(``, "Kunci", kunjaw)
            ]
          })
        );
        tabel.push(new Paragraph(""));
      }

      let doc = new Document({
        sections: [
          {
            children: tabel
          }
        ]
      });

      let buffer = await Packer.toBuffer(doc);

      let docName = `hasil-acak-paket${l + 1}(${email}).docx`;

      listNameFile.push(docName);

      fs.writeFileSync(
        path.join(__dirname, `../../public/docx/hasil-acak/${docName}`),
        buffer
      );
    }
    return listNameFile;
  } catch (error) {
    console.log(error);
  }
};
