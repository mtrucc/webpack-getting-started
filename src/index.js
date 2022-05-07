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

  const opencvUtils = await new Promise((resolve, reject) => {
    if (window.opencvUtilsFlag) {
      resolve && resolve();
    } else {
      let utils = new Utils('errorMessage');
      utils.loadOpenCv(() => {
        resolve && resolve(utils);
        window.opencvUtilsFlag = true;
      });
    }
  });

  console.log('opencvUtils', opencvUtils);

  // PrintImage(printList);
  return {
    pdf,
    pdfJS,
    pageNumber: pdf.numPages,
  };
}

function getImage(page, filename) {
  return new Promise((resolve, reject) => {
    page.objs.get(filename, async (arg) => {
      const { width, height } = arg;
      // console.log('arg', arg)
      if (width / height > 1.6 && width / height < 1.9) {
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
        // console.log('第二页', dataURL);
        resolve && resolve(dataURL);
      }
    });
  });
}

async function getPage1(pdf) {
  const page = await pdf.getPage(1);
  const scale = 4;
  const viewport = page.getViewport({
    scale,
  });
  const canvas = document.createElement('CANVAS');
  const canvasContext = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  // canvas.id = 'canvasInput';
  // document.body.appendChild(canvas);
  const renderContext = {
    canvasContext,
    viewport,
  };
  page.getTextContent().then((textContent) => {
    console.log('textContent', textContent);
  });

  const dataURL = await new Promise((resolve, reject) => {
    page.render(renderContext).promise.then((data) => {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = 530 * scale;
      newCanvas.height = 200 * scale;
      // newCanvas.id = 'canvasInput';
      // newCanvas.style.display = 'none';
      const outCanvas = document.createElement('canvas');
      outCanvas.id = 'canvasOutput';
      outCanvas.style.display = 'none';
      document.body.appendChild(outCanvas);
      // document.body.appendChild(newCanvas)

      // 裁剪一半
      const cutCanvas = document.createElement('canvas');
      cutCanvas.width = viewport.height * 0.7;
      cutCanvas.height = viewport.width;
      cutCanvas.id = 'canvasInput';
      cutCanvas.style.display = 'none';
      document.body.appendChild(cutCanvas);

      const cutCanvasContext = cutCanvas.getContext('2d');
      cutCanvasContext.drawImage(
        canvas,
        0,
        0,
        viewport.width,
        viewport.height * 0.7,
        0,
        0,
        viewport.width,
        viewport.height * 0.7
      );

      let src = cv.imread(cutCanvas);
      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      let lines = new cv.Mat();
      let color = new cv.Scalar(255, 0, 0);
      let low = new cv.Mat(src.rows, src.cols, src.type(), [200, 200, 200, 0]);
      let high = new cv.Mat(
        src.rows,
        src.cols,
        src.type(),
        [240, 240, 240, 255]
      );
      // You can try more different parameters
      cv.inRange(src, low, high, dst);
      cv.imshow('canvasOutput', dst);

      let src2 = cv.imread('canvasOutput');
      let dst2 = cv.Mat.zeros(src2.rows, src2.cols, cv.CV_8UC3);
      let lines2 = new cv.Mat();
      let color2 = new cv.Scalar(255, 0, 0);
      cv.cvtColor(src2, src2, cv.COLOR_RGBA2GRAY, 0);
      cv.Canny(src2, src2, 50, 200, 3);

      // // You can try more different parameters
      cv.HoughLinesP(src2, lines2, 5, Math.PI / 180, 100, 100, 0);
      // // draw l  ines
      let ponintList = [];
      for (let i = 0; i < lines2.rows; ++i) {
        let startPoint = new cv.Point(
          lines2.data32S[i * 4],
          lines2.data32S[i * 4 + 1]
        );
        let endPoint = new cv.Point(
          lines2.data32S[i * 4 + 2],
          lines2.data32S[i * 4 + 3]
        );
        console.log('startPoint, endPoint', startPoint, endPoint);
        ponintList.push(startPoint);
        ponintList.push(endPoint);
        cv.line(dst2, startPoint, endPoint, color);
      }

      const ponintListX = ponintList.map((item) => item.x);
      const ponintListXMin = Math.min(...ponintListX);
      const ponintListXMax = Math.max(...ponintListX);
      const ponintListY = ponintList.map((item) => item.y);
      const ponintListYMin = Math.min(...ponintListY);
      const ponintListYMax = Math.max(...ponintListY);

      console.log(
        'ponintListXMin, ponintListXMax',
        ponintListXMin,
        ponintListXMax,
        ponintListXMax - ponintListXMin
      );
      console.log(
        'ponintListYMin, ponintListYMax',
        ponintListYMin,
        ponintListYMax,
        ponintListYMax - ponintListYMin
      );

      // cv.imshow('canvasOutput2', dst2);

      src.delete();
      dst.delete();
      lines.delete();
      src2.delete();
      dst2.delete();
      lines2.delete();
      low.delete();
      high.delete();

      const newCanvasContext = newCanvas.getContext('2d');
      if (
        ponintListXMax - ponintListXMin > 1500 &&
        ponintListYMax - ponintListYMin > 200 &&
        ponintListYMax - ponintListYMin < 800
      ) {
        newCanvasContext.drawImage(
          canvas,
          ponintListXMin,
          ponintListYMin - 80 * scale,
          ponintListXMax - ponintListXMin,
          ponintListYMax - ponintListYMin + 80 * scale,
          0,
          0,
          ponintListXMax - ponintListXMin,
          ponintListYMax - ponintListYMin + 80 * scale
        );
        console.log('1111', 1111);
      } else {
        newCanvasContext.drawImage(
          canvas,
          20 * scale,
          210 * scale,
          550 * scale,
          160 * scale,
          0,
          0,
          530 * scale,
          160 * scale
        );
      }

      const dataURL = newCanvas.toDataURL('image/png', 1);
      // console.log('dataURL', dataURL);
      // printList.push(dataURL);
      resolve && resolve(dataURL);
      return dataURL;
    });
  });

  return dataURL;
}

async function getPage2(pdf, pdfJS, pageNumber) {
  const page2 = await pdf.getPage(pageNumber);
  const operators = await page2.getOperatorList();

  const dataURL = await new Promise((resolve, reject) => {
    const rawImgOperator = operators.fnArray
      .map((f, index) => (f === pdfJS.OPS.paintImageXObject ? index : null))
      .filter((n) => n !== null);
    const filename = operators.argsArray[rawImgOperator[1]][0];
    rawImgOperator.forEach((index) => {
      const filename = operators.argsArray[index][0];
      getImage(page2, filename).then((dataURL) => {
        resolve && resolve(dataURL);
      });
    });
  });

  return dataURL;
}

async function getPage3(pdf) {
  const page = await pdf.getPage(1);
  const scale = 4;
  const viewport = page.getViewport({
    scale,
  });
  const canvas = document.createElement('CANVAS');
  const canvasContext = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  // canvas.id = 'canvasInput';
  // canvas.style.display = 'none';
  // document.body.appendChild(canvas);
  const renderContext = {
    canvasContext,
    viewport,
  };

  const dataURL = await new Promise((resolve, reject) => {
    page.render(renderContext).promise.then((data) => {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = 560 * scale;
      newCanvas.height = 270 * scale;

      const newCanvasContext = newCanvas.getContext('2d');
      newCanvasContext.drawImage(
        canvas,
        20 * scale,
        410 * scale,
        550 * scale,
        270 * scale,
        0,
        0,
        550 * scale,
        270 * scale
      );

      const dataURL = newCanvas.toDataURL('image/png', 1);
      resolve && resolve(dataURL);
      return dataURL;
    });
  });

  return dataURL;
}

function previewFile() {
  const input = document.querySelector('input');

  input.addEventListener('change', () => {
    // const preview = document.querySelector('img');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      (e) => {
        // convert image file to base64 string
        // preview.src = reader.result;
        var myData = new Uint8Array(e.target.result);
        var docInitParams = { data: myData };
        console.log('reader.result', docInitParams);
        loadFromFile(docInitParams);
      },
      false
    );

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  });
}

previewFile();
async function loadFromFile(url) {
  // // 加载对应的PDF文件
  try {
    let { pdf, pdfJS, pageNumber } = await LoadPdf(
      url,
      window.location.origin + '/dist/pdf.worker.js'
    );
    // 获取页码
    console.log('pageNumber', pageNumber);
    if (pageNumber == 1) {
      const page2Data = await getPage2(pdf, pdfJS, 1);
      console.log('page2Data', page2Data);
      const page3Data = await getPage3(pdf);
      console.log('page3Data', page3Data);
      PrintImage([page2Data, page3Data]);
    } else {
      const page1Data = await getPage1(pdf, pdfJS);
      console.log('page1Data', page1Data);
      const page2Data = await getPage2(pdf, pdfJS, 2);
      console.log('page2Data', page2Data);
      PrintImage([page2Data, page1Data]);
    }
  } catch (error) {
    console.log('PDF文件加载失败');
    // 这儿执行你要执行的代码 针对123
  }
}
// async function Run() {
//   // // 加载对应的PDF文件
//   try {
//     let { pdf, pdfJS, pageNumber } = await LoadPdf(
//       'look1.pdf',
//       window.location.origin + '/dist/pdf.worker.js'
//     );
//     // 获取页码
//     console.log('pageNumber', pageNumber);
//     if (pageNumber == 1) {
//       const page2Data = await getPage2(pdf, pdfJS, 1);
//       console.log('page2Data', page2Data);
//       const page3Data = await getPage3(pdf);
//       console.log('page3Data', page3Data);
//       PrintImage([page2Data, page3Data]);
//     } else {
//       const page1Data = await getPage1(pdf, pdfJS);
//       console.log('page1Data', page1Data);
//       const page2Data = await getPage2(pdf, pdfJS, 2);
//       console.log('page2Data', page2Data);
//       PrintImage([page2Data, page1Data]);
//     }
//   } catch (error) {
//     console.log('PDF文件加载失败');
//     // 这儿执行你要执行的代码 针对123
//   }
// }
// Run();

window.LoadPdf = LoadPdf;
window.PrintImage = PrintImage;
window.getPage1 = getPage1;
window.getPage2 = getPage2;
window.getPage3 = getPage3;
