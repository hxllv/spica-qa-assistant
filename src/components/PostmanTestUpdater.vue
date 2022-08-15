<template>
  <div class="w-75 p-1">
    <p class="lead text-center">
      Easily and quickly convert Postman tests to new syntax.
    </p>
    <p>Copy and paste the test with the old syntax into the input field.</p>
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
    <p>It is advised to double check the converted test if everything is OK.</p>
  </div>

  <div class="row d-flex flex-column align-items-center w-75">
    <div class="form-group p-1 row">
      <label for="input">Input</label>
      <textarea
        v-model="input"
        class="form-control"
        name=""
        id=""
        cols="80"
        rows="20"
      ></textarea>
    </div>
    <div class="form-group p-1 row">
      <label for="output">Output</label>
      <br />
      <small class="form-text">Click on text area to copy</small>
      <textarea
        v-model="output"
        class="form-control"
        name=""
        id=""
        cols="80"
        rows="20"
        readonly
        @click="$emit('copyToClip', output)"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      output: "",
      regexs: {
        testName: /("|')[a-zA-Z 0-9]+("|')/g,
        responseCode: {
          whole:
            /tests\[("|')[a-zA-Z 0-9]+("|')\] *= *responseCode.code *=== *[0-9]{3}/g,
          code: /= *[0-9]{3}/g,
        },
        schema: /var +schema *=/g,
        tinyValid: /tests\[("|')[a-zA-Z 0-9]+("|')\] *= *result\.valid/g,
        setEnvVarParams: /\(("|')[A-Za-z0-9]+("|'), *[a-zA-Z0-9 ._]+\)/g,
        getEnvVarParams: /\(("|')[A-Za-z0-9]+("|')\)/g,
      },
    };
  },
  methods: {},
  watch: {
    input() {
      let splitInput = this.input.split("\n");
      const regexs = this.regexs;
      let inSchema = false;
      let schemaIndentDepth = 1;

      splitInput.forEach((ln, i) => {
        //schema
        if (inSchema) {
          if (
            schemaIndentDepth === 1 &&
            ln.includes("}") &&
            !ln.includes("{")
          ) {
            inSchema = false;
            splitInput[i] = ln.trim();
            return;
          }

          if (!ln.includes("{") && ln.includes("}")) schemaIndentDepth--;

          splitInput[i] = "\t".repeat(schemaIndentDepth) + ln.trim();

          if (ln.includes("{") && !ln.includes("}")) schemaIndentDepth++;
        } else if (ln.match(regexs.schema)) {
          inSchema = true;
        }
        //response code
        else if (ln.match(regexs.responseCode.whole)) {
          const testName = ln.match(regexs.testName)[0];
          const code = ln
            .match(regexs.responseCode.code)[0]
            .split("=")[1]
            .trim();

          splitInput[
            i
          ] = `pm.test(${testName}, () => {\n\tpm.response.to.have.status(${code});\n});`;
        }
        //response body parsing
        else if (ln.includes("JSON.parse(responseBody)")) {
          splitInput[i] = "var data = pm.response.json()\n";
        }
        //schema result
        else if (ln.includes("tv4.validateResult")) {
          let tempI = i + 1;
          let testName = "";
          const T = true;

          while (T) {
            if (splitInput[tempI].match(regexs.tinyValid)) {
              testName = splitInput[tempI].match(regexs.testName)[0];
              splitInput[tempI] = "//DELET";
            } else if (splitInput[tempI].includes("tv4.error")) {
              splitInput[tempI] = "//DELET";
              break;
            }

            tempI++;
          }

          splitInput[
            i
          ] = `pm.test(${testName}, function () {\n\tpm.expect(tv4.validate(data, schema)).to.be.true;\n});\nif (tv4.error) console.log("Validation failed: ", tv4.error)`;
        }
        //set env var
        else if (ln.includes("setEnvironmentVariable")) {
          const params = ln.match(regexs.setEnvVarParams)[0];
          splitInput[i] = `pm.environment.set${params}`;
        }
        //get env var
        else if (ln.includes("getEnvironmentVariable")) {
          const params = ln.match(regexs.getEnvVarParams)[0];
          splitInput[i] = `pm.environment.get${params}`;
        }
        //response body contains
        else if (ln.includes("responseBody.has")) {
          const testName = ln.match(regexs.testName)[0];
          const params = ln.match(regexs.getEnvVarParams)[0];
          splitInput[
            i
          ] = `pm.test(${testName}, function () {\n\tpm.expect(pm.response.text()).to.include${params};\n});`;
        }
      });

      this.output = splitInput.filter((ln) => ln != "//DELET").join("\n");
    },
  },
};
</script>

<style></style>
