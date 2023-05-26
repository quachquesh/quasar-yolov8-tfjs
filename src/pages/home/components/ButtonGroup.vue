<script setup lang="ts">
const props = defineProps<{
  imageSrc?: string;
  videoSrc?: string;
  streaming: 'image' | 'video' | null;
}>();

const emits = defineEmits({
  changeImageSrc: (data: string) => data,
  changeVideoSrc: (data: string) => data,
  'update:streaming': (data: 'image' | 'video' | null) => data,
});

const inputImageRef = ref<HTMLInputElement>();
const inputVideoRef = ref<HTMLInputElement>();

function onClickImage() {
  if (props.streaming === null) inputImageRef.value?.click();
  else if (props.streaming === 'image') {
    closeImage();
  } else {
    alert('Hãy đóng luồng hiện tại trước');
  }
}

function closeImage() {
  const url = props.imageSrc;
  emits('changeImageSrc', '#');
  if (url) URL.revokeObjectURL(url);

  emits('update:streaming', null);
  if (inputImageRef.value) inputImageRef.value.value = '';
}

function onChangeImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    emits('changeImageSrc', url);
    emits('update:streaming', 'image');
  }
}

function onClickVideo() {
  if (props.streaming === null || props.streaming === 'image') {
    inputVideoRef.value?.click();
  } else if (props.streaming === 'video') {
    const url = props.videoSrc;
    emits('changeVideoSrc', '');
    if (url) URL.revokeObjectURL(url);
    emits('update:streaming', null);
    if (inputVideoRef.value) inputVideoRef.value.value = '';
  } else {
    alert('Hãy đóng luồng hiện tại trước');
  }
}

function onChangeVideo(event: Event) {
  if (props.streaming === 'image') closeImage();
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    emits('changeVideoSrc', url);
    emits('update:streaming', 'video');
  }
}
</script>
<template>
  <div class="flex items-center justify-center q-mt-md" style="gap: 8px">
    <input
      ref="inputImageRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onChangeImage"
    />
    <input
      ref="inputVideoRef"
      type="file"
      accept="video/*"
      class="hidden"
      @change="onChangeVideo"
    />
    <q-btn color="primary" @click="onClickImage">
      {{ $props.streaming !== 'image' ? 'Open' : 'Close' }} Image
    </q-btn>
    <q-btn color="primary" @click="onClickVideo">
      {{ $props.streaming !== 'video' ? 'Open' : 'Close' }} Video
    </q-btn>
    <!-- <button class="btn-primary">Open Webcam</button> -->
  </div>
</template>
