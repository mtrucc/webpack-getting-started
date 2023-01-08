import { Utils } from './utils';
import * as tf from '@tensorflow/tfjs';
// 使用 require 引入 tf

const MOBILENET_MODEL_PATH = 'm4/model.json';

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

async function LoadPdf(url, wokerUrl, mobilenetUrl) {
  let printList = [];
  var pdfJS = window['pdfjs-dist/build/pdf'];
  pdfJS.GlobalWorkerOptions.workerSrc = wokerUrl;
  const pdf = await pdfJS.getDocument(url).promise;
  const mobilenet = await tf.loadGraphModel(mobilenetUrl);

  // const opencvUtils = await new Promise((resolve, reject) => {
  //   if (window.opencvUtilsFlag) {
  //     resolve && resolve();
  //   } else {
  //     let utils = new Utils('errorMessage');
  //     utils.loadOpenCv(() => {
  //       resolve && resolve(utils);
  //       window.opencvUtilsFlag = true;
  //     });
  //   }
  // });

  // console.log('opencvUtils', opencvUtils);

  return {
    pdf,
    pdfJS,
    pageNumber: pdf.numPages,
    mobilenet,
  };
}

async function getImage(pdf, pageNumber) {
  const imageList = [];

  const getPageData = async (page) => {
    const scale = 4;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('CANVAS');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const canvasContext = canvas.getContext('2d');
    const renderContext = { canvasContext, viewport };
    await page.render(renderContext).promise;
    const dataURL = canvas.toDataURL('image/jpeg', 1.0);
    const img = new Image();
    img.src = dataURL;
    return img;
  };

  const pagePromises = [];
  for (let i = 1; i <= pageNumber; i++) {
    const page = await pdf.getPage(i);
    pagePromises.push(getPageData(page));
  }

  const pagesData = await Promise.all(pagePromises);
  // imageList.push(...pagesData);
  return pagesData;
}

// 裁剪图片
function cutImage(image, minY, minX, maxY, maxX) {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = maxX - minX + 50;
  newCanvas.height = maxY - minY + 50;

  const newCanvasContext = newCanvas.getContext('2d');
  newCanvasContext.drawImage(
    image,
    minX - 25,
    minY - 25,
    maxX - minX + 50,
    maxY - minY + 50,
    0,
    0,
    maxX - minX,
    maxY - minY
  );

  const dataURL = newCanvas.toDataURL('image/png', 1);
  return dataURL;
}

// 处理图片
function handleImage(image, results) {
  let out = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    const { minY, minX, maxY, maxX } = result;

    let cut = cutImage(image, minY, minX, maxY, maxX);

    out.push(cut);
  }

  return out;
}

// 处理图片列表
function handleImageList(imageList, resultList) {
  let out = [];
  for (let i = 0; i < resultList.length; i++) {
    const result = resultList[i];
    const image = imageList[i];

    let handle = handleImage(image, result);

    out.push(handle);
  }
  return out;
}

// 格式化baes64图片, 输出图片宽高比例1.4的图片，不足的地方用白色填充，如果图片宽高比例大于1，旋转90度后不足的地方用白色填充
function formatImage(base64, targetAspectRatio = 1.4) {
  return new Promise((resolve, reject) => {
    const tempImg = new Image();
    tempImg.onload = () => {
      const { width, height } = tempImg;
      // Calculate the aspect ratio of the original image
      const originalAspectRatio = width / height;

      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Set the width and height of the canvas based on the aspect ratio
      if (originalAspectRatio > targetAspectRatio) {
        // Original image has a wider aspect ratio, so set the width of the canvas and calculate the height based on the target aspect ratio
        canvas.width = width;
        canvas.height = width / targetAspectRatio;
      } else {
        // Original image has a taller aspect ratio, so set the height of the canvas and calculate the width based on the target aspect ratio
        canvas.width = height * targetAspectRatio;
        canvas.height = height;
      }

      // Get the context of the canvas
      const ctx = canvas.getContext('2d');

      // Set the background color of the canvas to white
      ctx.fillStyle = '#fff';
      // Fill the canvas with white
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate the x and y positions of the image on the canvas
      let x, y;
      if (originalAspectRatio > targetAspectRatio) {
        // Original image has a wider aspect ratio, so center the image vertically
        x = 0;
        y = (canvas.height - height) / 2;
      } else {
        // Original image has a taller aspect ratio, so center the image horizontally
        x = (canvas.width - width) / 2;
        y = 0;
      }

      // Draw the image on the canvas
      ctx.drawImage(tempImg, x, y);

      // Rotate the canvas by 90 degrees if the original aspect ratio is greater than 1
      if (originalAspectRatio > 1) {
        ctx.rotate(Math.PI / 2);
      }

      // Convert the canvas to a base64 image
      const formattedBase64Image = canvas.toDataURL();

      // Return the formatted base64 image
      resolve(formattedBase64Image);
    };
    tempImg.src = base64;
  });
}

async function tensorflowImage(model, image) {
  // console.log('tensorflowImage', dataURL);
  // const image = document.createElement('img');
  // image.src = dataURL;
  const pixels = tf.browser.fromPixels(image);

  let data = tf.cast(pixels.reshape([1, ...pixels.shape]), 'float32');
  // // let data = tf.cast(pixels.reshape([1, ...pixels.shape]), 'int32');
  // // let data = tf.cast(pixels.reshape([1, ...pixels.shape]), 'int32');

  console.time('predict2');
  const res = await model.executeAsync(data);
  console.timeEnd('predict2');
  // console.log('res', res);
  const scores = res[0].dataSync();
  const boxes = res[1].dataSync();
  // console.log('boxes', boxes);
  // console.log('scores', scores);

  const [maxScores, classes] = calculateMaxScores(
    scores,
    res[0].shape[1],
    res[0].shape[2]
  );

  // console.log('maxScores, classes', maxScores, classes);

  const prevBackend = tf.getBackend();
  // run post process in cpu
  if (tf.getBackend() === 'webgl') {
    tf.setBackend('cpu');
  }
  const indexTensor = tf.tidy(() => {
    const boxes2 = tf.tensor2d(boxes, [res[1].shape[0], res[1].shape[1]]);
    return tf.image.nonMaxSuppression(boxes2, maxScores, 20, 0.5, 0.5);
  });

  const indexes = indexTensor.dataSync();
  indexTensor.dispose();

  // restore previous backend
  if (prevBackend !== tf.getBackend()) {
    tf.setBackend(prevBackend);
  }

  const result = buildDetectedObjects(
    image.width,
    image.height,
    boxes,
    maxScores,
    indexes,
    classes
  );
  console.log('result', result);

  return result;

  // const c = document.getElementById('canvas');
  // const context = c.getContext('2d');
  // context.drawImage(image, 0, 0);
  // context.font = '10px Arial';

  // console.log('number of detections: ', result.length);
  // for (let i = 0; i < result.length; i++) {
  //   const { score } = result[i];
  //   if (score < 0.5) {
  //     continue;
  //   }
  //   context.beginPath();
  //   context.rect(...result[i].bbox);
  //   context.lineWidth = 8;
  //   context.strokeStyle = 'red';
  //   context.fillStyle = 'red';
  //   context.stroke();
  //   context.fillText(
  //     result[i].score.toFixed(3) + ' ' + result[i].class,
  //     result[i].bbox[0],
  //     result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10
  //   );
  // }
  // console.timeEnd('predict2');
}

function buildDetectedObjects(width, height, boxes, scores, indexes, classes) {
  console.log(
    'buildDetectedObjects',
    width,
    height,
    boxes,
    scores,
    indexes,
    classes
  );
  const count = indexes.length;
  const objects = [];
  for (let i = 0; i < count; i++) {
    const bbox = [];
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indexes[i] * 4 + j];
    }
    const minY = bbox[0] * height;
    const minX = bbox[1] * width;
    const maxY = bbox[2] * height;
    const maxX = bbox[3] * width;
    // const box0 = bbox[0]
    // const box1 = bbox[1]
    // const box2 = bbox[2]
    // const box3 = bbox[3]

    // console.log('box0, box1, box2, box3', box0, box1, box2, box3);
    // console.log('minY, minX, maxY, maxX', minY, minX, maxY, maxX);
    bbox[0] = minX;
    bbox[1] = minY;
    bbox[2] = maxX - minX;
    bbox[3] = maxY - minY;
    objects.push({
      bbox: bbox,
      class: classes[indexes[i]],
      score: scores[indexes[i]],
      minX,
      minY,
      maxX,
      maxY,
    });
  }
  return objects;
}

function calculateMaxScores(scores, numBoxes, numClasses) {
  const maxes = [];
  const classes = [];
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE;
    let index = -1;
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j];
        index = j;
      }
    }
    maxes[i] = max;
    classes[i] = index;
  }
  return [maxes, classes];
}

function previewFile() {
  const input = document.querySelector('input');

  input.addEventListener('change', () => {
    console.log('???');
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
    let { pdf, pdfJS, pageNumber, mobilenet } = await LoadPdf(
      url,
      window.location.origin + '/dist/pdf.worker.js',
      MOBILENET_MODEL_PATH
    );
    // 获取页码
    console.log('pageNumber', pageNumber);

    // 获取所有的图片
    let imageList = await getImage(pdf, pageNumber);

    console.log('imageList', imageList);

    // 识别所有图片
    let tensorflowResultPromise = await Promise.all(
      imageList.map((item) => tensorflowImage(mobilenet, item))
    );

    console.log('tensorflowResultPromise', tensorflowResultPromise);

    // 处理所有图片
    const outList = handleImageList(imageList, tensorflowResultPromise);

    console.log('outList', outList);

    const printList = [];
    for (let i = 0; i < outList.length; i++) {
      const element = outList[i];
      if (element.length > 0) {
        printList.push(element);
      }
    }

    // 格式化打印
    const formatPrintList = await Promise.all(
      printList.map((item) => formatImage(item, 1.6))
    );
    console.log('formatPrintList', formatPrintList);
    PrintImage(formatPrintList);
  } catch (error) {
    console.log('PDF文件加载失败', error);
    // 这儿执行你要执行的代码 针对123
  }
}

// async function Run() {
//   // // 加载对应的PDF文件
//   try {
//     let { pdf, pdfJS, pageNumber } = await LoadPdf(
//       'look1.pdf',
// async function Run() {
//   // 加载对应的PDF文件
//   try {
//     let { pdf, pdfJS, pageNumber } = await LoadPdf(
//       'look5.pdf',
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
//     console.log('PDF文件加载失败', error);
//     // 这儿执行你要执行的代码 针对123
//   }
// }
// Run();

window.LoadPdf = LoadPdf;
window.PrintImage = PrintImage;
window.formatImage = formatImage;
window.tensorflowImage = tensorflowImage;
window.handleImageList = handleImageList;
window.getImage = getImage;
