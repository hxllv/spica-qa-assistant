<template>
  <div class="w-75 p-1">
    <p class="lead text-center">Generate OnTime like timestamps for DevOps.</p>
    <!-- <p>Copy and paste the test with the old syntax into the input field.</p>
    <p>
      The "TEST RESPONSE BODY DATA VALUE" segment of the
      <a
        href="https://dev.azure.com/Spica-International/Spica%20Common/_git/QA?path=/Postman/How%20to%20write%20Postman%20tests%20with%20new%20syntax.md"
      >
        internal postman testing guidelines
      </a>
      is <strong>NOT</strong> supported, because checking and converting those
      is a bit tricky. It will hopefully be added in the future.
    </p>
    <p>It is advised to double check the converted test if everything is OK.</p> -->
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
      <small class="form-text">Click on input to copy</small>
      <input
        v-model="output"
        class="form-control"
        type="text"
        name=""
        id="output"
        readonly
        @click="$emit('copyToClip', output)"
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
    this.h12c = localStorage.h12c;
    this.dow = localStorage.dow;
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

      if (this.dow) {
        dow = `${this.dowArr[today.getDay()]}, `;
      }

      if (this.h12c) {
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
