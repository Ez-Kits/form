---
title: Home
layout: home

hero:
  name: Ez Form
  text: Modern Form Package.
  tagline: Powerful, type-safe, ease of use form package.
  image:
    src: /logo.png
    alt: Ez Form
  actions:
    - theme: brand
      text: Get Started
      link: /react/guide/why-ez-form
    - theme: alt
      text: View on GitHub
      link: https://github.com/Ez-Kits/form

features:
  - icon: ⚡️
    title: Fast and Ease of use.
    details: Fast and easy to build your form.
  - icon: 🖖
    title: Validation
    details: Ez Form comes with modern validators like Zod, Validbot, Yup, Async validator.
  - icon: 🛠️
    title: Simple and minimal.
    details: Starting build your form with no configuration.
  - icon: ◫
    title: Multi-step form.
    details: Ez Form comes with built-in multi-step form, which helps you to build complex form.
---

<script setup>
import { VPTeamMembers,VPTeamPageSection } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/niku98.png',
    name: 'Niku',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/niku98' },
    ]
  },
]
</script>
<style scoped>
 :deep(.VPTeamPageSection) {
  margin-top: 3rem
 }
 
 :deep(.VPTeamMembers.medium.count-1) .container {
  margin: 0 auto !important;
 }
</style>

<VPTeamPageSection>
    <template #title>Author</template>
    <template #members>
      <VPTeamMembers :members="members" />
    </template>
  </VPTeamPageSection>
