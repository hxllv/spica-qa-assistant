<template>
  <div class="list-group">
    <router-link
      to="/qateamurlfixer"
      class="list-group-item list-group-item-action"
    >
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">QA Team URL fixer</h5>
      </div>
      <p class="mb-1">
        Replace "&amp;amp;" with "&amp;" for URLs in received mails
      </p>
    </router-link>
    <router-link
      to="/postmantestupdater"
      class="list-group-item list-group-item-action"
    >
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">Postman Test updater</h5>
      </div>
      <p class="mb-1">Quickly update Postman tests to new syntax</p>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
