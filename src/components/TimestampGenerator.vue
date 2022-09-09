<template>
  <div class="w-75 p-1">
    <p class="lead text-center">Generate OnTime like timestamps for DevOps.</p>
  </div>

  <div class="row d-flex flex-column align-items-center w-75">
    <div class="form-group p-1 col-auto">
      <label for="name">Name</label>

      <input
        v-model="username"
        type="text"
        name=""
        id="name"
        class="form-control"
      />
    </div>
    <div class="form-group p-1 col-auto">
      <label for="emoji">Emoji / prefix & suffix</label>
      <input
        v-model="emoji"
        type="text"
        name=""
        id="emoji"
        class="form-control"
      />
    </div>
    <div class="form-check p-1 col-auto">
      <label class="form-check-label" for="12h">Use 12 hour clock?</label>
      <input
        v-model="hour12"
        type="checkbox"
        name=""
        id="12h"
        class="form-check-input"
      />
    </div>
    <div class="form-group p-1 col-5">
      <label class="form-check-label" for="date-style">Date style</label>
      <select v-model="dateStyle" id="date-style" class="form-select">
        <option value="full">Full</option>
        <option value="long">Long</option>
        <option value="medium">Medium</option>
        <option value="short">Short</option>
      </select>
    </div>
    <div class="form-group p-1 col-5">
      <label class="form-check-label" for="time-style">Time style</label>
      <select v-model="timeStyle" id="time-style" class="form-select">
        <option value="full">Full</option>
        <option value="long">Long</option>
        <option value="medium">Medium</option>
        <option value="short">Short</option>
      </select>
    </div>
    <div class="form-group p-1 row">
      <label for="output">Output</label>
      <br />
      <small class="form-text"
        >Clicking on input generates new timestamp and copies it</small
      >
      <div
        class="my-3"
        ref="output"
        style="font-weight: bold; font-size: 14px"
        @click="generateAndCopy"
      >
        {{ output }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["copyToClip", "showToast"],
  mounted() {
    if (!localStorage.username) localStorage.username = "Default Name";
    if (!localStorage.hour12) localStorage.hour12 = false;
    if (!localStorage.timeStyle) localStorage.timeStyle = "long";
    if (!localStorage.dateStyle) localStorage.dateStyle = "long";
    if (!localStorage.emoji) localStorage.emoji = "🔴";

    this.username = localStorage.username;
    this.hour12 = localStorage.hour12 === "true" ? true : false;
    this.timeStyle = localStorage.timeStyle;
    this.dateStyle = localStorage.dateStyle;
    this.emoji = localStorage.emoji;
  },
  data() {
    return {
      username: "",
      hour12: false,
      timeStyle: "long",
      dateStyle: "long",
      output: "",
      emoji: "🔴",
    };
  },
  methods: {
    generateTimestamp() {
      const hourCycle = this.hour12 ? "h12" : "h23";

      let date = new Intl.DateTimeFormat("en-GB", {
        dateStyle: this.dateStyle,
        timeStyle: this.timeStyle,
        hourCycle: hourCycle,
      }).format(new Date());

      this.output = `${this.emoji} Edited by ${this.username} on ${date} ${this.emoji}`;
    },
    fallbackCopyTextToClipboard() {
      const listener = (e) => {
        try {
          e.clipboardData.setData(
            "text/html",
            `<div style="font-weight: bold;">${this.output}</div>`
          );
          this.$emit("showToast", { text: "Copied to clipboard", code: 0 });
        } catch (err) {
          this.$emit("showToast", { text: err, code: 1 });
        }
        e.preventDefault();
      };
      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);
    },
    generateAndCopy() {
      this.generateTimestamp();

      console.log(!window.ClipboardItem);

      if (!navigator.clipboard || !window.ClipboardItem) {
        this.fallbackCopyTextToClipboard();
        return;
      }

      console.log("Clipboard API present");

      const blob = new Blob(
        [`<div style="font-weight: bold;">${this.output}</div>`],
        { type: "text/html" }
      );
      const clipboardItem = new window.ClipboardItem({ "text/html": blob });
      navigator.clipboard.write([clipboardItem]).then(
        () => {
          this.$emit("showToast", { text: "Copied to clipboard", code: 0 });
        },
        (err) => {
          this.$emit("showToast", { text: err, code: 1 });
        }
      );
    },
  },
  watch: {
    username(newName) {
      localStorage.username = newName;
      this.generateTimestamp();
    },
    hour12(newHour12) {
      localStorage.hour12 = newHour12;
      this.generateTimestamp();
    },
    timeStyle(newTimeStyle) {
      localStorage.timeStyle = newTimeStyle;
      this.generateTimestamp();
    },
    dateStyle(newDateStyle) {
      localStorage.dateStyle = newDateStyle;
      this.generateTimestamp();
    },
    emoji(newEmoji) {
      localStorage.emoji = newEmoji;
      this.generateTimestamp();
    },
  },
};
</script>

<style></style>
