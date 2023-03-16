import nextConnect from "next-connect";
const _ = require("lodash");
const { PDFDocument } = require("pdf-lib");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const multer = require("multer");
const upload = multer();

type Data = {
  name: string;
};

const apiRoute = nextConnect({
  onError(error, req, res: any) {
    res.json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req: any, res: any) => {
  try {
    let array = req.query.cod.split(",");

    const pdfFile = req.file;
    const quantity = req.query.qty;

    let finalArayy = [];
    const view = pdfFile.buffer;
    const deep = new Uint8Array(view);
    var pdfBytes = _.cloneDeep(deep);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    for (const ele of array) {
      var quant: boolean = false;
      const pdfDoc1 = await PDFDocument.create();
      const pageCount = pdfDoc.getPageCount();
      const pdfjs = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      let count = 0;
      for (let i = 0; i < pageCount; i++) {
        const page = await pdfjs.getPage(i + 1);
        const content = await page.getTextContent();

        const str = content.items.find((item: any) => item.str.includes(ele));

        if (quantity > 0) {
          let indexOfQty =
            Number(
              content.items.findIndex((id: any) => id.str === "Order No.")
            ) + 6;
          let objOfQty = content.items[indexOfQty];
          quant = objOfQty.str === quantity ? true : false;
        } else {
          quant = true;
        }

        if (str && quant) {
          count += 1;
          const textItem = content.items.find((item: any) =>
            item.str.includes("Fold Here")
          );
          let textX;
          let textY;

          if (!textItem) {
            const firstPage = pdfDoc.getPages()[i];
            const americanFlag = await pdfDoc1.embedPage(firstPage);

            const { width } = firstPage.getSize();

            const newPage = pdfDoc1.addPage([width, 450]);
            newPage.drawPage(americanFlag, { y: -350 });
          } else {
            textX = textItem.transform[4];
            textY =
              page.getViewport({ scale: 1 }).height - textItem.transform[5];
            const height = page.getViewport({ scale: 1 }).height;

            const firstPage = pdfDoc.getPages()[i];
            const americanFlag = await pdfDoc1.embedPage(firstPage);

            const { width } = firstPage.getSize();

            if (textY > 300 && textY < 302) {
              const newPage = pdfDoc1.addPage([width, height - 540]);
              newPage.drawPage(americanFlag, { y: textY - height });
            } else if (textY > 302 && textY < 317) {
              const newPage = pdfDoc1.addPage([width, height - 530]);
              newPage.drawPage(americanFlag, { y: textY - height });
            } else if (textY > 385) {
              const newPage = pdfDoc1.addPage([width, height - 460]);
              newPage.drawPage(americanFlag, { y: textY - height });
            } else {
              const newPage = pdfDoc1.addPage([width, height - 480]);
              newPage.drawPage(americanFlag, { y: textY - height });
            }
          }
        }
      }

      if (count > 0) {
        const modifiedPdfBytes = await pdfDoc1.save();
        let bufferObj = Buffer.from(modifiedPdfBytes, "utf8");
        let base64String = bufferObj.toString("base64");

        let obj: any = {
          fileName: ele,
          pdfData: base64String,
        };

        finalArayy.push(obj);
      }
    }

    return res.status(201).json({
      body: finalArayy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
