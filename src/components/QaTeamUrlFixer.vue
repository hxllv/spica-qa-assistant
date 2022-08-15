<template>
  <div class="w-75 p-1">
    <p class="lead text-center">
      Replace "&amp;amp;" with "&amp;" in received QA Team URLs
    </p>
    <p>Copy and paste the URL into the input field.</p>
    <p>
      When using <a href="https://qa.team/">QA Team</a> for receiving app
      related emails, the URLs within them get "corrupted", with all instances
      of "&amp;" being replaced with "&amp;amp;", which makes it an invalid URL
      (e.g. URLs in "You have been invited to join X at All Hours" email).
    </p>
  </div>
  <div class="row d-flex flex-column align-items-center w-75">
    <div class="form-group p-1 row">
      <label for="input">Input</label>
      <input
        v-model="input"
        class="form-control"
        type="text"
        name=""
        id="input"
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
  data() {
    return {
      input: "",
      output: "",
    };
  },
  watch: {
    input() {
      this.output = this.input.replaceAll("&amp;", "&");
    },
  },
};
</script>
