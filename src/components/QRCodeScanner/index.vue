<template>
  <div class="scanner-container">
    <div
      id="reader"
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<script setup>
import { Html5Qrcode } from "html5-qrcode";
const showInfo = ref(false);
const html5QrCode = ref(null);
const emit = defineEmits(["success"]);
const startScanner = () => {
  showInfo.value = true;
  html5QrCode.value
    .start(
      { facingMode: "environment" }, // 使用后置摄像头
      {
        fps: 10, // 每秒扫描10次
        qrbox: { width: 250, height: 250 }, // 扫码框的大小
      },
      (decodedText, decodedResult) => {
        showInfo.value = false;
        stopQrCode();
        // 扫码成功的回调
        emit("success", decodedText);
        console.log(`二维码内容: ${decodedText}`);
        // 在此处理扫码结果，例如跳转页面或显示信息
      },
      (errorMessage) => {
        // 扫码失败的回调
        console.error(`扫码失败: ${errorMessage}`);
      }
    )
    .catch((err) => {
      console.error(`启动扫码失败: ${err}`);
    });
};
const stopQrCode = () => {
  // 组件销毁前停止扫码
  html5QrCode.value
    .stop()
    .then((ignore) => {
      // QR Code scanning is stopped.
    })
    .catch((err) => {
      // Stop failed, handle it.
    });
};
defineExpose({ startScanner, stopQrCode });
onMounted(() => {
  html5QrCode.value = new Html5Qrcode("reader");
});
onUnmounted(() => {
  stopQrCode();
});
</script>

<style scoped>
.scanner-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

#reader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 2px solid #fff;
  border-radius: 10px;
}
</style>
