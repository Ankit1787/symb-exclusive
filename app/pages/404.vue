<template>
  <NuxtLayout>
    <div class="container">
      <div class="breadcrumb error-breadcrumb"><NuxtLink to="/">Home</NuxtLink><span>/</span><strong>404 Error</strong></div>
      <section class="error-page">
        <div>
          <h1>404 Not Found</h1>
          <p>Your visited page not found. You may go home page.</p>
          <NuxtLink class="btn error-action" to="/">Back to home page</NuxtLink>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
