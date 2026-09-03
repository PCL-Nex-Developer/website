<script setup lang="ts">
import PclNexFooter from '~/components/ui/PclNexFooter.vue'
import PclNexHeader from '~/components/ui/PclNexHeader.vue'
import SiteSettingsModal from '~/components/ui/SiteSettingsModal.vue'

const settingsOpen = ref(false)
</script>

<template>
	<div class="site-layout">
		<PclNexHeader @open-settings="settingsOpen = true" />
		<main id="main">
			<slot />
		</main>
		<PclNexFooter />
		<SiteSettingsModal v-model="settingsOpen" />
	</div>
</template>

<style lang="scss">
@import '~/assets/styles/global.scss';

html.accent-pcl.light-mode {
	--surface-1: #f4f7f8;
	--surface-2: #f8fafb;
	--surface-3: #fbfdfe;
	--surface-4: #ffffff;
	--surface-5: #d8e3e7;
	--color-text-primary: #142329;
	--color-text-default: #31464d;
	--color-text-tertiary: #60757d;
	--color-brand: #28758a;
	--color-brand-highlight: rgb(88 168 192 / 16%);
	--color-brand-shadow: rgb(48 96 96 / 28%);
	--color-brand-inverted: #ffffff;
	--landing-color-heading: #10242b;
	--landing-color-subheading: #49616a;
	--landing-transition-gradient-end: #f4f7f8;
	--landing-border-color: rgb(48 96 96 / 28%);
}

html.accent-pcl.dark-mode {
	--surface-1: #0e1317;
	--surface-2: #141a20;
	--surface-3: #192128;
	--surface-4: #202a32;
	--surface-5: #304049;
	--color-text-primary: #f3fbfc;
	--color-text-default: #d2e0e4;
	--color-text-tertiary: #96aab1;
	--color-brand: #80d0e0;
	--color-brand-highlight: rgb(88 168 192 / 20%);
	--color-brand-shadow: rgb(128 208 224 / 30%);
	--color-brand-inverted: #10252b;
	--landing-color-heading: #f5fcfd;
	--landing-color-subheading: #acbec4;
	--landing-transition-gradient-end: #0e1317;
	--landing-border-color: rgb(112 184 200 / 26%);
}

html.accent-pcl.oled-mode {
	--color-brand: #80d0e0;
	--color-brand-highlight: rgb(88 168 192 / 20%);
	--color-brand-shadow: rgb(128 208 224 / 30%);
	--color-brand-inverted: #10252b;
}

html {
	scroll-behavior: smooth;
	scroll-padding-top: 5rem;
}

.site-layout {
	min-height: 100vh;
	background:
		linear-gradient(rgb(255 255 255 / 1%) 1px, transparent 1px), var(--color-bg);
	background-size: 100% 8rem;
}

.site-layout > main {
	min-height: calc(100vh - 4.5rem);
}

.reduced-effects * {
	backdrop-filter: none !important;
}

.reduced-motion,
.reduced-motion * {
	scroll-behavior: auto !important;
	animation-duration: 0.001ms !important;
	animation-iteration-count: 1 !important;
	transition-duration: 0.001ms !important;
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		scroll-behavior: auto !important;
		animation-duration: 0.001ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.001ms !important;
	}
}
</style>
