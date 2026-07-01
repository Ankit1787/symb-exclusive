<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb"><NuxtLink to="/">Home</NuxtLink><span>/</span><strong>Contact</strong></div>
      <div class="contact-grid">
        <aside class="contact-card">
          <div class="contact-block">
            <div class="contact-icon">
              <img src="/assets/callus.svg" alt="Call icon" />
            </div>
            <div class="contact-copy">
              <h3>Call To Us</h3>
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: +8801611112222</p>
            </div>
          </div>
          <div class="contact-block">
            <div class="contact-icon">
              <img src="/assets/writetous.svg" alt="Write icon" />
            </div>
            <div class="contact-copy">
              <h3>Write To Us</h3>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </div>
          </div>
        </aside>
        <form class="message-card">
          <div class="message-fields">
            <input class="field" placeholder="Your Name *" />
            <input class="field" placeholder="Your Email *" />
            <input class="field" placeholder="Your Phone *" />
          </div>
          <textarea class="field" placeholder="Your Message"></textarea>
          <div class="form-submit"><button class="btn" type="button">Send Massage</button></div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>
