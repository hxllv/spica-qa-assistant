<template>
  <router-link to="/" v-if="$route.path != '/'" class="back-button"
    ><font-awesome-icon icon="fa-solid fa-arrow-left"
  /></router-link>

  <div class="toast fixed-top m-auto" ref="toast">
    <div
      :class="
        toast.toastCode == 0
          ? 'toast-header bg-success'
          : 'toast-header bg-danger'
      "
    ></div>
    <div class="toast-body">{{ toast.toastText }}</div>
  </div>
  <router-link to="/" class="spica-logo w-75 my-3">
    <img class="img-fluid" src="spica.png" alt="SPICA INTERNATIONAL" />
  </router-link>
  <router-view @copy-to-clip="copyToClip"></router-view>
</template>

<script>
import { Toast } from "bootstrap/dist/js/bootstrap.js";

export default {
  mounted() {
    this.toast.el = new Toast(this.$refs.toast);
  },
  data() {
    return {
      toast: {
        el: null,
        toastText: "",
        toastCode: 0,
      },
    };
  },
  methods: {
    showToast(data) {
      this.toast.toastText = data.text;
      this.toast.toastCode = data.code;
      this.toast.el.show();
    },
    fallbackCopyTextToClipboard(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
        this.showToast({ code: 0, text: "Copied to clipboard" });
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        this.showToast({
          code: 1,
          text: "Error copying to clipboard",
        });
      }

      document.body.removeChild(textArea);
    },
    copyToClip(text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          this.showToast({ code: 0, text: "Copied to clipboard" });
          console.log("Async: Copying to clipboard was successful!");
        },
        (err) => {
          console.error("Async: Could not copy text: ", err);
          this.showToast({
            code: 1,
            text: "Error copying to clipboard",
          });
        }
      );
    },
  },
};
</script>

<style>
.back-button {
  position: absolute;
  left: 1em;
  top: 1em;
  transform: scale(1.5);
  transform-origin: top left;
}

.spica-logo {
  max-width: 500px;
}
</style>
