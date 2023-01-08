import * as tf from '@tensorflow/tfjs';

const MOBILENET_MODEL_PATH = 'saved_model/model.json';

// 加载模型
export async function loadModel() {
  const mobilenet = await tf.loadGraphModel(MOBILENET_MODEL_PATH);
  return mobilenet;
}