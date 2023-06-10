<script setup lang="ts">
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import type { IModel } from '@/types/interfaces/model';
import ButtonGroup from './components/ButtonGroup.vue';

const imageRef = ref<HTMLImageElement>();
// const cameraRef = ref<HTMLVideoElement>();
const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();
const streaming = ref<'image' | 'video' | null>(null);

const { progress, modelName } = storeToRefs(useModelStore());
const { setProgress } = useModelStore();
const modelNameLoading = ref('yolov8n');
const model: IModel = {
  net: null,
  inputShape: [1, 0, 0, 3],
};

async function loadModel() {
  // load model
  const yolov8 = await tf.loadGraphModel(
    `models/${modelNameLoading.value}_web_model/model.json`,
    {
      onProgress: (value) => {
        setProgress(true, value);
      },
    }
  );

  // warming up model
  if (yolov8 && yolov8.inputs[0] && yolov8.inputs[0].shape) {
    const dummyInput = tf.ones(yolov8.inputs[0].shape);
    const warmupResults = yolov8.execute(dummyInput);

    setProgress(false, 1);
    modelName.value = modelNameLoading.value;
    // set model & input shape
    model.net = yolov8;
    model.inputShape = yolov8.inputs[0].shape;
    if (canvasRef.value) {
      canvasRef.value.width = model.inputShape[1];
      canvasRef.value.height = model.inputShape[2];
    }

    // cleanup memory
    tf.dispose([warmupResults, dummyInput]);
  } else {
    setProgress(false, 0);
  }
}

function onEndedVideo() {
  if (videoRef.value) {
    const url = videoRef.value.src;
    videoRef.value.src = '';

    URL.revokeObjectURL(url);
    streaming.value = null;
  }
}
</script>

<template>
  <div class="h-screen flex justify-center q-mt-lg">
    <div>
      <div v-if="progress.loading" class="mb-2 font-medium text-center">
        Loading model... {{ (progress.value * 100).toFixed(2) }}%
      </div>
      <form
        class="flex items-center justify-center"
        @submit.prevent="loadModel"
      >
        <q-input
          class="q-mr-sm"
          outlined
          v-model="modelNameLoading"
          label="Tên model"
          :dense="true"
        />
        <q-btn color="positive" label="Load model" type="submit" glossy />
      </form>
      <div class="q-mt-sm text-center">
        <div v-if="model.net">
          <span class="mr-2 font-medium">Model áp dụng:</span>
          <q-chip square color="teal" text-color="white">
            {{ modelName }}
          </q-chip>
        </div>
      </div>
      <div className="content my-8">
        <img
          v-show="streaming === 'image'"
          src="#"
          ref="imageRef"
          @load="
            imageRef &&
              canvasRef &&
              useDetect(imageRef, model as IModel, canvasRef)
          "
        />
        <!-- <video autoPlay muted ref="cameraRef" /> -->
        <video
          v-show="streaming === 'video'"
          autoPlay
          muted
          controls
          ref="videoRef"
          @play="() => videoRef && canvasRef && useDetectVideo(videoRef, model as IModel, canvasRef)"
          @ended="onEndedVideo"
        />
        <canvas id="canvas-box" ref="canvasRef" />
      </div>
      <ButtonGroup
        v-model:streaming="streaming"
        @change-image-src="
          (value: string) => {
            if (imageRef) imageRef.src = value;
          }
        "
        @change-video-src="
          (value: string) => {
            if (videoRef) videoRef.src = value;
          }
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  position: relative;
}

.content > img {
  width: 100%;
  max-width: 720px;
  max-height: 500px;
  border-radius: 10px;
}

.content > video {
  width: 100%;
  max-width: 720px;
  max-height: 500px;
  border-radius: 10px;
}

.content > canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
