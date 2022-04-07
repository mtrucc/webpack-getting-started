import { Utils } from './utils';

const PrintImage = async (array) => {
  if (typeof window !== 'undefined') {
    // browser code
    let { default: printJS } = await import('print-js');

    printJS({
      printable: array,
      type: 'image',
    });
  }
};

async function LoadPdf(url, wokerUrl) {
  console.log('url', url);
  let printList = [];
  var pdfJS = window['pdfjs-dist/build/pdf'];
  console.log('window.location.origin', window.location.origin);
  pdfJS.GlobalWorkerOptions.workerSrc = wokerUrl;
  const pdf = await pdfJS.getDocument(url).promise;
  const page = await pdf.getPage(2);
  const scale = 4;
  const viewport = page.getViewport({
    scale,
  });
  const canvas = document.createElement('CANVAS');
  const canvasContext = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext,
    viewport,
  };
  await page.render(renderContext).promise.then((data) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 530 * scale;
    newCanvas.height = 200 * scale;
    const newCanvasContext = newCanvas.getContext('2d');
    newCanvasContext.drawImage(
      canvas,
      20 * scale,
      210 * scale,
      550 * scale,
      190 * scale,
      0,
      0,
      530 * scale,
      190 * scale
    );
    const dataURL = canvas.toDataURL('image/png', 1);
    console.log('dataURL', dataURL)
    printList.push(dataURL);
    return dataURL;
  });

  const page2 = await pdf.getPage(2);
  const viewport2 = page2.getViewport({
    scale: 2,
  });
  const canvas2 = document.createElement('CANVAS');
  const canvasContext2 = canvas2.getContext('2d');
  canvas2.height = viewport2.height;
  canvas2.width = 1060;

  const renderContext2 = {
    canvasContext: canvasContext2,
    viewport: viewport2,
  };

  const operators = await page2.getOperatorList();

  const rawImgOperator = operators.fnArray
    .map((f, index) => (f === pdfJS.OPS.paintImageXObject ? index : null))
    .filter((n) => n !== null);

  const filename = operators.argsArray[rawImgOperator[1]][0];

  console.log('rawImgOperator', rawImgOperator);

  console.log('operators.argsArray', operators.argsArray);

  rawImgOperator.forEach((index) => {
    const filename = operators.argsArray[index][0];
    getImage(page2, filename, (data) => {
      console.log('data', data);
    });
  });
  // console.log('printList', printList)

  // page2.objs.get(filename, async (arg) => {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = arg.width;
  //   canvas.height = arg.height;
  //   const ctx = canvas.getContext('2d');

  //   const data = new Uint8ClampedArray(arg.width * arg.height * 4);
  //   let k = 0;
  //   let i = 0;
  //   while (i < arg.data.length) {
  //     data[k] = arg.data[i];
  //     data[k + 1] = arg.data[i + 1];
  //     data[k + 2] = arg.data[i + 2];
  //     data[k + 3] = 255;

  //     i += 3;
  //     k += 4;
  //   }
  //   const imgData = ctx.createImageData(arg.width, arg.height);
  //   imgData.data.set(data);
  //   ctx.putImageData(imgData, 0, 0);
  //   const newCanvas = document.createElement('canvas');
  //   newCanvas.width = (arg.height * 1000) / 665;
  //   newCanvas.height = arg.height;
  //   const newCanvasContext = newCanvas.getContext('2d');
  //   newCanvasContext.drawImage(
  //     canvas,
  //     0,
  //     0,
  //     newCanvas.width,
  //     newCanvas.height,
  //     0,
  //     0,
  //     newCanvas.width,
  //     newCanvas.height
  //   );

  //   const dataURL = newCanvas.toDataURL('image/png', 1);
  //   printList.push(dataURL);
  // });

  // PrintImage(printList);
}

function getImage(page, filename, callback) {
  page.objs.get(filename, async (arg) => {
    console.log('arg', arg)
    const canvas = document.createElement('canvas');
    canvas.width = arg.width;
    canvas.height = arg.height;
    const ctx = canvas.getContext('2d');

    const data = new Uint8ClampedArray(arg.width * arg.height * 4);
    let k = 0;
    let i = 0;
    while (i < arg.data.length) {
      data[k] = arg.data[i];
      data[k + 1] = arg.data[i + 1];
      data[k + 2] = arg.data[i + 2];
      data[k + 3] = 255;

      i += 3;
      k += 4;
    }
    const imgData = ctx.createImageData(arg.width, arg.height);
    imgData.data.set(data);
    ctx.putImageData(imgData, 0, 0);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = (arg.height * 1000) / 665;
    newCanvas.height = arg.height;
    const newCanvasContext = newCanvas.getContext('2d');
    newCanvasContext.drawImage(
      canvas,
      0,
      0,
      newCanvas.width,
      newCanvas.height,
      0,
      0,
      newCanvas.width,
      newCanvas.height
    );

    const dataURL = newCanvas.toDataURL('image/png', 1);
    console.log('dataURL', dataURL)
    // printList.push(dataURL);
  });
}

LoadPdf('test.pdf', window.location.origin + '/dist/pdf.worker.js');

let utils = new Utils('errorMessage');
utils.loadOpenCv(() => {
  console.log('testOpenCv')
});

window.LoadPdf = LoadPdf;
window.PrintImage = PrintImage;
