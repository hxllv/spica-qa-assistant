<template>
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
