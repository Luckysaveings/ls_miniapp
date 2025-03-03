<template>
  <van-overlay
    :show="showInfo"
    class="scanner-overlay"
  >
    <van-icon
      name="arrow-left"
      color="#fff"
      size="24px"
      class="icon-back"
      @click="onClickLeft"
    />
    <div class="scanner-container">
      <div
        id="reader"
        style="width: 100%; height: 100%"
      />
    </div>
  </van-overlay>
</template>

<script setup name="QrCodeScanner">
import { Html5Qrcode } from "html5-qrcode";
const showInfo = ref(false);
const html5QrCode = ref(null);
const emit = defineEmits(["success"]);
const onClickLeft = () => {
  stopQrCode();
  nextTick(() => {
    showInfo.value = false;
  });
};
const startScanner = () => {
  showInfo.value = true;
  nextTick(() => {
    if (html5QrCode.value) {
      html5QrCode.value.clear();
    } else {
      html5QrCode.value = new Html5Qrcode("reader");
    }
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
          // console.error(`扫码失败: ${errorMessage}`);
        }
      )
      .catch((err) => {
        console.error(`启动扫码失败: ${err}`);
      });
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
  const ele = document.getElementById("reader");
  if (!ele) return;
  html5QrCode.value = new Html5Qrcode("reader");
});
onUnmounted(() => {
  stopQrCode();
});
</script>

<style scoped lang="scss">
.scanner-overlay {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  background: rgba(24, 24, 27, 0.8);
}
.icon-back {
  width: 100%;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
}
.scanner-container {
  position: relative;
  width: 300px;
  height: 300px;

  #reader {
    :deep(video) {
      border-radius: 10px;
      // border: 2px solid #fff;
    }
  }
}
</style>
