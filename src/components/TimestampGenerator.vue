<template>
  <div class="w-75 p-1">
    <p class="lead text-center">Generate OnTime like timestamps for DevOps.</p>
  </div>

  <div class="row d-flex flex-column align-items-center w-75">
    <div class="form-group p-1 col-auto">
      <label for="name">Name</label>
      <div class="input-group">
        <input
          v-model="username"
          type="text"
          name=""
          id="name"
          class="form-control"
        />
        <button class="btn btn-primary input-group-text">Set name</button>
      </div>
    </div>
    <div class="form-check p-1 col-auto">
      <label class="form-check-label" for="12h">Use 12 hour clock?</label>
      <input
        v-model="h12c"
        type="checkbox"
        name=""
        id="12h"
        class="form-check-input"
      />
    </div>
    <div class="form-check p-1 col-auto">
      <label class="form-check-label" for="dow">Add day of week?</label>
      <input
        v-model="dow"
        type="checkbox"
        name=""
        id="dow"
        class="form-check-input"
      />
    </div>
    <div class="form-group p-1 row">
      <label for="output">Output</label>
      <br />
      <small class="form-text"
        >Clicking on input generates new timestamp and copies it</small
      >
      <input
        v-model="output"
        class="form-control"
        type="text"
        name=""
        id="output"
        readonly
        @click="generateAndCopy"
      />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["copyToClip"],
  mounted() {
    if (!localStorage.username) localStorage.username = "Default Name";
    if (!localStorage.h12c) localStorage.h12c = false;
    if (!localStorage.dow) localStorage.dow = false;

    this.username = localStorage.username;
    this.h12c = localStorage.h12c === "true" ? true : false;
    this.dow = localStorage.dow === "true" ? true : false;
  },
  data() {
    return {
      username: "",
      h12c: false,
      dow: false,
      output: "",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      dowArr: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    };
  },
  methods: {
    generateTimestamp() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = this.months[today.getMonth()];
      const yyyy = today.getFullYear();
      let hh = String(today.getHours()).padStart(2, "0");
      const mi = String(today.getMinutes()).padStart(2, "0");
      const UTC = -today.getTimezoneOffset() / 60;

      let dow = "";
      let time = `${hh}:${mi}`;

      if (this.dow == true) {
        dow = `${this.dowArr[today.getDay()]}, `;
      }

      if (this.h12c == true) {
        const amOrPm = Number(hh) >= 12 ? "PM" : "AM";
        hh = Number(hh) % 12 || 12;

        time = `${String(hh).padStart(2, "0")}:${mi} ${amOrPm}`;
      }

      this.output = `Edited by ${
        this.username
      } on ${dow}${dd} ${mm} ${yyyy} at ${time} (UTC ${
        UTC >= 0 ? "+" + UTC : UTC
      })`;
    },
    generateAndCopy() {
      this.generateTimestamp();
      this.$emit("copyToClip", this.output);
    },
  },
  watch: {
    username(newName) {
      localStorage.username = newName;
      this.generateTimestamp();
    },
    h12c(newH12c) {
      localStorage.h12c = newH12c;
      this.generateTimestamp();
    },
    dow(newDow) {
      localStorage.dow = newDow;
      this.generateTimestamp();
    },
  },
};
</script>

<style></style>
