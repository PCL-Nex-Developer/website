<script setup lang="ts">
import AppleIcon from '@modrinth/assets/external/apple.svg?component'
import LinuxIcon from '@modrinth/assets/external/linux.svg?component'
import WindowsIcon from '@modrinth/assets/external/windows.svg?component'
import ArrowDownIcon from '@modrinth/assets/icons/arrow-down.svg?component'
import BoxesIcon from '@modrinth/assets/icons/boxes.svg?component'
import DownloadIcon from '@modrinth/assets/icons/download.svg?component'
import GaugeIcon from '@modrinth/assets/icons/gauge.svg?component'
import GitGraphIcon from '@modrinth/assets/icons/git-graph.svg?component'
import IssuesIcon from '@modrinth/assets/icons/issues.svg?component'
import Accordion from '@modrinth/ui/src/components/base/Accordion.vue'
import ButtonStyled from '@modrinth/ui/src/components/base/ButtonStyled.vue'
import IntlFormatted from '@modrinth/ui/src/components/base/IntlFormatted.vue'
import { defineMessages, useVIntl } from '@modrinth/ui/src/composables/i18n.ts'

import AppleLogo from '~/components/landing/AppleLogo.vue'
import CommunitySection from '~/components/landing/CommunitySection.vue'
import ImportGradientIcon from '~/components/landing/ImportGradientIcon.vue'
import LinuxLogo from '~/components/landing/LinuxLogo.vue'
import MultiplayerIcon from '~/components/landing/MultiplayerIcon.vue'
import OfflineModeIcon from '~/components/landing/OfflineModeIcon.vue'
import PluginShowcase from '~/components/landing/PluginShowcase.vue'
import WindowsLogo from '~/components/landing/WindowsLogo.vue'
import DownloadOptionsModal from '~/components/ui/DownloadOptionsModal.vue'

type OSType = 'Mac' | 'Windows' | 'Linux' | null

const downloadWindows = ref<HTMLAnchorElement | null>(null)
const downloadMac = ref<HTMLAnchorElement | null>(null)
const downloadSection = ref<HTMLElement | null>(null)
const hero = ref<HTMLElement | null>(null)

const updateHeroGlow = (event: PointerEvent) => {
	if (!hero.value) return

	const bounds = hero.value.getBoundingClientRect()
	const x = Math.max(
		0,
		Math.min(1, (event.clientX - bounds.left) / bounds.width),
	)
	const y = Math.max(
		0,
		Math.min(1, (event.clientY - bounds.top) / bounds.height),
	)

	hero.value.style.setProperty('--pointer-x', `${x * 100}%`)
	hero.value.style.setProperty('--pointer-y', `${y * 100}%`)
}

const resetHeroGlow = () => {
	if (!hero.value) return

	hero.value.style.removeProperty('--pointer-x')
	hero.value.style.removeProperty('--pointer-y')
}

const RELEASES_URL =
	'https://github.com/PCL-Nex-Developer/PCL2-Nex/releases/latest'
const { selectedSource, setDownloadSource } = useDownloadSource()
const {
	state: downloadState,
	release,
	resolvedChannel,
	hasStableRelease,
	hasBetaRelease,
	hasModelScopeMirror,
	resolveDownload,
	setReleaseChannel,
} = useReleaseDownloads()
const activeDownloadSource = computed(() =>
	selectedSource.value === 'modelscope' && hasModelScopeMirror.value
		? 'modelscope'
		: 'github',
)
const windowsLink = computed(
	() =>
		resolveDownload('win-x64', 'exe', activeDownloadSource.value) ??
		RELEASES_URL,
)
const windowsArm64Link = computed(
	() =>
		resolveDownload('win-arm64', 'exe', activeDownloadSource.value) ??
		RELEASES_URL,
)
const linuxLinks = computed(() => ({
	appImage:
		resolveDownload('linux-x64', 'appimage', activeDownloadSource.value) ??
		RELEASES_URL,
	deb:
		resolveDownload('linux-x64', 'deb', activeDownloadSource.value) ??
		RELEASES_URL,
	rpm:
		resolveDownload('linux-x64', 'rpm', activeDownloadSource.value) ??
		RELEASES_URL,
}))
const macLinks = computed(() => ({
	x64:
		resolveDownload('osx-x64', 'dmg', activeDownloadSource.value) ??
		RELEASES_URL,
	arm64:
		resolveDownload('osx-arm64', 'dmg', activeDownloadSource.value) ??
		RELEASES_URL,
}))
const currentDownloadSourceUrl = computed(
	() =>
		(activeDownloadSource.value === 'modelscope'
			? release.value?.modelscope_url
			: release.value?.release_url) ?? RELEASES_URL,
)
const downloadOptionsOpen = ref(false)
const selectedReleaseChannel = computed({
	get: () => resolvedChannel.value,
	set: setReleaseChannel,
})
const selectedDownloadSource = computed({
	get: () => activeDownloadSource.value,
	set: setDownloadSource,
})
const linkUnavailableLabel = 'Open GitHub Releases'

const platform = ref('')

onMounted(() => {
	platform.value = navigator.userAgent || ''
})
const os = computed<OSType>(() => {
	if (/(iPhone|iPad|Android|Mobile)/.test(platform.value)) {
		return null
	} else if (platform.value.includes('Mac')) {
		return 'Mac'
	} else if (platform.value.includes('Win')) {
		return 'Windows'
	} else if (platform.value.includes('Linux')) {
		return 'Linux'
	} else {
		return null
	}
})

const downloadLauncher = computed(() => {
	if (os.value === 'Windows') {
		return () => {
			downloadWindows.value?.click()
		}
	} else if (os.value === 'Mac') {
		return () => {
			downloadMac.value?.click()
		}
	} else {
		return () => {
			scrollToSection()
		}
	}
})

const handleDownload = () => {
	downloadLauncher.value()
}

const scrollToSection = () => {
	nextTick(() => {
		if (downloadSection.value) {
			window.scrollTo({
				top: downloadSection.value.offsetTop,
				behavior: 'smooth',
			})
		}
	})
}

const { formatMessage, locale } = useVIntl()

const messages = defineMessages({
	openSourceBadge: {
		id: 'pcl-nex-marketing.hero.open-source',
		defaultMessage: '.NET 10 - WPF - Community maintained',
	},
	downloadPclNex: {
		id: 'pcl-nex-marketing.hero.download',
		defaultMessage: 'PCL Nex',
	},
	downloadPclNexForOs: {
		id: 'pcl-nex-marketing.hero.download-for-os',
		defaultMessage: 'PCL Nex for {os}',
	},
	description: {
		id: 'app-marketing.hero.description',
		defaultMessage:
			'PCL Nex is a free, open-source, ad-free community launcher for Minecraft: Java Edition, continuously developed from PCL. It brings instance, game download, mod, Java, and account management into one client, lets you search, install, and update mods, modpacks, resource packs, and shaders from Modrinth and CurseForge, and continues to deliver features and improvements not yet available in the mainline launcher. Windows is fully supported, while cross-platform builds for macOS and Linux are in testing.',
	},
	heroScreenshotAlt: {
		id: 'pcl-nex-marketing.hero.screenshot-alt',
		defaultMessage: 'PCL Nex brand and launcher content preview.',
	},
	builtOnModrinth: {
		id: 'pcl-nex-marketing.highlights.eyebrow',
		defaultMessage: 'Continuously improved for players',
	},
	highlightsTitle: {
		id: 'pcl-nex-marketing.highlights.title',
		defaultMessage: 'Manage every instance',
	},
	highlightsTitleSecond: {
		id: 'pcl-nex-marketing.highlights.title-second',
		defaultMessage: 'with clarity and speed',
	},
	highlightsDescription: {
		id: 'pcl-nex-marketing.highlights.description',
		defaultMessage:
			'Create and import Minecraft instances, search Modrinth and CurseForge, and manage Java, accounts, mods, and launch settings in one place.',
	},
	adFree: {
		id: 'pcl-nex-marketing.highlights.ad-free.title',
		defaultMessage: 'Community maintained, source available',
	},
	adFreeDescription: {
		id: 'pcl-nex-marketing.highlights.ad-free.description',
		defaultMessage:
			'PCL Nex is independently developed from PCL, with its commits, issues, source, and releases available publicly on GitHub.',
	},
	localized: {
		id: 'pcl-nex-marketing.highlights.localized.title',
		defaultMessage: 'Content management that stays organized',
	},
	localizedDescription: {
		id: 'pcl-nex-marketing.highlights.localized.description',
		defaultMessage:
			'Install and manage modpacks alongside individual projects. Some CurseForge files have distribution limits and may require a manual download.',
	},
	downloadPclNexButton: {
		id: 'pcl-nex-marketing.hero.download-button',
		defaultMessage: 'Download PCL Nex',
	},
	fetchingDownloadLinks: {
		id: 'pcl-nex-marketing.download.fetching-links',
		defaultMessage: 'Fetching download links…',
	},
	downloadLinksFailed: {
		id: 'pcl-nex-marketing.download.links-failed',
		defaultMessage: 'Could not fetch the latest download links.',
	},
	manualDownloadFallback: {
		id: 'pcl-nex-marketing.download.manual-fallback',
		defaultMessage: 'Download manually from GitHub Releases',
	},
	downloadVersion: {
		id: 'pcl-nex-marketing.download.version',
		defaultMessage: '{channel} · Current version {version}',
	},
	downloadChannel: {
		id: 'pcl-nex-marketing.download.channel',
		defaultMessage: 'Release channel',
	},
	downloadChannelStable: {
		id: 'pcl-nex-marketing.download.channel.stable',
		defaultMessage: 'Stable',
	},
	downloadChannelBeta: {
		id: 'pcl-nex-marketing.download.channel.beta',
		defaultMessage: 'Beta',
	},
	downloadSource: {
		id: 'pcl-nex-marketing.download.source',
		defaultMessage: 'Download source: {source}',
	},
	downloadSourceGithub: {
		id: 'pcl-nex-marketing.download.source.github',
		defaultMessage: 'GitHub',
	},
	downloadSourceModelScope: {
		id: 'pcl-nex-marketing.download.source.modelscope',
		defaultMessage: 'ModelScope mirror',
	},
	downloadSourceModelScopeUnavailable: {
		id: 'pcl-nex-marketing.download.source.modelscope-unavailable',
		defaultMessage: 'The current release is not mirrored to ModelScope yet',
	},
	viewAllFiles: {
		id: 'pcl-nex-marketing.download.view-all-files',
		defaultMessage: 'View all files',
	},
	chooseDownloadOptions: {
		id: 'pcl-nex-marketing.download.choose-options',
		defaultMessage: 'Choose download options',
	},
	archX64: {
		id: 'pcl-nex-marketing.download.arch-x64',
		defaultMessage: 'x64',
	},
	archArm64: {
		id: 'pcl-nex-marketing.download.arch-arm64',
		defaultMessage: 'ARM64',
	},
	moreDownloadOptions: {
		id: 'app-marketing.hero.more-download-options',
		defaultMessage: 'More Download Options',
	},
	crossPlatformFeature: {
		id: 'pcl-nex-marketing.features.cross-platform.title',
		defaultMessage: 'PCL, now beyond Windows',
	},
	crossPlatformFeatureDescription: {
		id: 'pcl-nex-marketing.features.cross-platform.description',
		defaultMessage:
			'PCL Nex takes the familiar PCL experience beyond Windows to macOS and Linux. Windows is fully supported, with macOS and Linux builds in active testing.',
	},
	crossPlatformLabel: {
		id: 'pcl-nex-marketing.features.cross-platform.label',
		defaultMessage: 'Cross-platform',
	},
	crossPlatformVisualAlt: {
		id: 'pcl-nex-marketing.features.cross-platform.alt',
		defaultMessage: 'PCL Nex availability on Windows, macOS, and Linux.',
	},
	platformStable: {
		id: 'pcl-nex-marketing.features.cross-platform.stable',
		defaultMessage: 'Fully supported',
	},
	platformTesting: {
		id: 'pcl-nex-marketing.features.cross-platform.testing',
		defaultMessage: 'Testing build',
	},
	performant: {
		id: 'app-marketing.features.performance.title',
		defaultMessage: 'Performant',
	},
	performantDescription: {
		id: 'app-marketing.features.performance.description',
		defaultMessage:
			'PCL Nex stays out of your way with a responsive interface and a lightweight desktop core.',
	},
	profileImporting: {
		id: 'app-marketing.features.importing.title',
		defaultMessage: 'Profile importing',
	},
	profileImportingDescription: {
		id: 'app-marketing.features.importing.description',
		defaultMessage:
			'Import your existing profiles from PCL2, HMCL, or any launcher you like with one click, and keep playing without rebuilding everything by hand.',
	},
	offlineMode: {
		id: 'app-marketing.features.offline.title',
		defaultMessage: 'Useful around every world',
	},
	offlineModeDescription: {
		id: 'app-marketing.features.offline.description',
		defaultMessage:
			'Chinese search and project translation, drag-and-drop import, Java management, offline mode, and skin management are ready when you need them.',
	},
	followProjects: {
		id: 'app-marketing.features.follow.title',
		defaultMessage: 'Multiplayer support',
	},
	followProjectsDescription: {
		id: 'app-marketing.features.follow.description',
		defaultMessage:
			'Terracotta-powered multiplayer networking, jump in with a single click.',
	},
	downloadOptions: {
		id: 'app-marketing.download.options-title',
		defaultMessage: 'Download options',
	},
	downloadPclNexTitle: {
		id: 'pcl-nex-marketing.download.title',
		defaultMessage: 'Download PCL Nex',
	},
	downloadDescription: {
		id: 'app-marketing.download.description',
		defaultMessage:
			'Windows is fully supported. macOS and Linux packages are available as testing builds.',
	},
	windows: {
		id: 'app-marketing.download.windows',
		defaultMessage: 'Windows',
	},
	mac: {
		id: 'app-marketing.download.mac',
		defaultMessage: 'Mac',
	},
	linux: {
		id: 'app-marketing.download.linux',
		defaultMessage: 'Linux',
	},
	downloadInstaller: {
		id: 'pcl-nex-marketing.download.installer',
		defaultMessage: 'Download installer',
	},
	downloadAppImage: {
		id: 'pcl-nex-marketing.download.appimage',
		defaultMessage: 'Download the AppImage',
	},
	showOtherPackages: {
		id: 'app-marketing.show-other-packages',
		defaultMessage: 'Show other packages',
	},
	hideOtherPackages: {
		id: 'app-marketing.hide-other-packages',
		defaultMessage: 'Hide other packages',
	},
	notRecommended: {
		id: 'app-marketing.not-recommended',
		defaultMessage:
			'Choose the package format that matches your Linux distribution.',
	},
	downloadTheDEB: {
		id: 'app-marketing.download.download-deb',
		defaultMessage: 'Download the DEB',
	},
	downloadTheRPM: {
		id: 'app-marketing.download.download-rpm',
		defaultMessage: 'Download the RPM',
	},
	downloadTerms: {
		id: 'app-marketing.download.terms',
		defaultMessage:
			'Downloading means you understand the PCL Nex <terms-link>licensing and usage notes</terms-link>. Read the <privacy-link>Privacy Policy</privacy-link> before installing.',
	},
	linuxDisclaimer: {
		id: 'app-marketing.download.linux-disclaimer',
		defaultMessage:
			'Linux packages are published with every release. Check the <issues-link>release page</issues-link> for architecture details or <prism-link>report an issue</prism-link> if your distribution needs extra setup.',
	},
	seoTitle: {
		id: 'pcl-nex-site.seo.title',
		defaultMessage: 'PCL Nex - Community Minecraft Java Edition Launcher',
	},
	seoDescription: {
		id: 'pcl-nex-site.seo.description',
		defaultMessage:
			'Download PCL Nex, a community edition based on PCL with Minecraft instance, content, Java, and account management. Windows is fully supported; macOS and Linux builds are in testing.',
	},
	socialImageAlt: {
		id: 'pcl-nex-site.seo.social-image-alt',
		defaultMessage: 'PCL Nex brand and launcher feature preview.',
	},
	faqEyebrow: {
		id: 'pcl-nex-site.faq.eyebrow',
		defaultMessage: 'Frequently asked questions',
	},
	faqTitle: {
		id: 'pcl-nex-site.faq.title',
		defaultMessage: 'Everything you need to know about PCL Nex',
	},
	faqDescription: {
		id: 'pcl-nex-site.faq.description',
		defaultMessage:
			'Learn about supported platforms, accounts, content, and downloads.',
	},
	faqPlatformsQuestion: {
		id: 'pcl-nex-site.faq.platforms.question',
		defaultMessage: 'Which operating systems does PCL Nex support?',
	},
	faqPlatformsAnswer: {
		id: 'pcl-nex-site.faq.platforms.answer',
		defaultMessage:
			'Windows 10 version 1809 or newer is fully supported. Windows 8 through older Windows 10 builds may run with limited community support. macOS and Linux support is in testing and requires .NET 10.',
	},
	faqFreeQuestion: {
		id: 'pcl-nex-site.faq.free.question',
		defaultMessage: 'Is PCL Nex free, and where is its source?',
	},
	faqFreeAnswer: {
		id: 'pcl-nex-site.faq.free.answer',
		defaultMessage:
			'PCL Nex is free to download, and its source and release history are public on GitHub. The launcher directory follows the PCL custom licensing guide; the remaining repository uses Apache License 2.0.',
	},
	faqAccountsQuestion: {
		id: 'pcl-nex-site.faq.accounts.question',
		defaultMessage: 'Can I use Microsoft and offline Minecraft accounts?',
	},
	faqAccountsAnswer: {
		id: 'pcl-nex-site.faq.accounts.answer',
		defaultMessage:
			'Yes. PCL Nex supports Microsoft Minecraft accounts, local offline accounts, and third-party Yggdrasil authentication, including LittleSkin presets and custom servers.',
	},
	faqContentQuestion: {
		id: 'pcl-nex-site.faq.content.question',
		defaultMessage: 'Where does PCL Nex get mods and other Minecraft content?',
	},
	faqContentAnswer: {
		id: 'pcl-nex-site.faq.content.answer',
		defaultMessage:
			'PCL Nex helps you search, inspect, choose versions for, install, update, and manage content from Modrinth and CurseForge. Files with CurseForge distribution restrictions may require a manual download.',
	},
	faqDownloadQuestion: {
		id: 'pcl-nex-site.faq.download.question',
		defaultMessage: 'Where should I download PCL Nex?',
	},
	faqDownloadAnswer: {
		id: 'pcl-nex-site.faq.download.answer',
		defaultMessage:
			'Use the download section on this website or the official PCL Nex GitHub Releases page. Avoid unofficial download sources.',
	},
	appScreenshotAlt: {
		id: 'app-marketing.hero.app-screenshot-alt',
		defaultMessage: `PCL Nex instance content preview.`,
	},
	structuredFeatureContentSources: {
		id: 'pcl-nex-site.structured-data.feature.content-sources',
		defaultMessage:
			'Search, install, and update mods, modpacks, resource packs, and shaders from Modrinth and CurseForge',
	},
	structuredFeatureLab: {
		id: 'pcl-nex-site.structured-data.feature.lab',
		defaultMessage: 'Windows support with experimental macOS and Linux builds',
	},
	structuredFeatureInstances: {
		id: 'pcl-nex-site.structured-data.feature.instances',
		defaultMessage:
			'Instance, world, screenshot, log, Java, and modpack management',
	},
	structuredFeatureAccounts: {
		id: 'pcl-nex-site.structured-data.feature.accounts',
		defaultMessage:
			'Microsoft, offline, LittleSkin, and custom Yggdrasil account support',
	},
	faqLabQuestion: {
		id: 'pcl-nex-site.faq.lab.question',
		defaultMessage: 'How is PCL Nex related to the PCL mainline?',
	},
	faqLabAnswer: {
		id: 'pcl-nex-site.faq.lab.answer',
		defaultMessage:
			'PCL Nex is an independently developed community edition based on PCL. Its version numbers do not directly match mainline PCL; report PCL Nex issues to the PCL Nex repository.',
	},
	faqProjectDisclaimerQuestion: {
		id: 'pcl-nex-site.faq.project-disclaimer.question',
		defaultMessage: 'Where should I report PCL Nex issues?',
	},
	faqProjectDisclaimerAnswer: {
		id: 'pcl-nex-site.faq.project-disclaimer.answer',
		defaultMessage:
			'Use GitHub Issues in PCL-Nex-Developer/PCL2-Nex. PCL Nex is a separate community edition, so do not report its issues to the PCL mainline repository.',
	},
	seoKeywords: {
		id: 'pcl-nex-site.seo.keywords',
		defaultMessage:
			'PCL Nex, Plain Craft Launcher, PCL, Minecraft Launcher, Modrinth, CurseForge, Minecraft Java Edition',
	},
})

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const canonicalUrl = `${siteUrl}/`
const socialImageUrl = `${siteUrl}/pcl-nex.png`
const githubUrl = 'https://github.com/PCL-Nex-Developer/PCL2-Nex'
const licenseUrl = `${githubUrl}/blob/dev/Plain%20Craft%20Launcher%202/LICENCE`

const title = computed(() => formatMessage(messages.seoTitle))
const description = computed(() => formatMessage(messages.seoDescription))
const socialImageAlt = computed(() => formatMessage(messages.socialImageAlt))
const faqItems = computed(() => [
	{
		question: formatMessage(messages.faqPlatformsQuestion),
		answer: formatMessage(messages.faqPlatformsAnswer),
	},
	{
		question: formatMessage(messages.faqFreeQuestion),
		answer: formatMessage(messages.faqFreeAnswer),
	},
	{
		question: formatMessage(messages.faqAccountsQuestion),
		answer: formatMessage(messages.faqAccountsAnswer),
	},
	{
		question: formatMessage(messages.faqContentQuestion),
		answer: formatMessage(messages.faqContentAnswer),
	},
	{
		question: formatMessage(messages.faqDownloadQuestion),
		answer: formatMessage(messages.faqDownloadAnswer),
	},
	{
		question: formatMessage(messages.faqLabQuestion),
		answer: formatMessage(messages.faqLabAnswer),
	},
	{
		question: formatMessage(messages.faqProjectDisclaimerQuestion),
		answer: formatMessage(messages.faqProjectDisclaimerAnswer),
	},
])
const keywords = computed(() => formatMessage(messages.seoKeywords))

const structuredData = computed(() => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${canonicalUrl}#website`,
			url: canonicalUrl,
			name: 'PCL Nex',
			description: description.value,
			inLanguage: locale.value,
			publisher: { '@id': `${canonicalUrl}#organization` },
		},
		{
			'@type': 'Organization',
			'@id': `${canonicalUrl}#organization`,
			name: 'PCL Nex Developer Team',
			url: canonicalUrl,
			logo: {
				'@type': 'ImageObject',
				url: `${siteUrl}/pcl-nex.png`,
				width: 512,
				height: 512,
			},
			sameAs: [githubUrl],
		},
		{
			'@type': 'SoftwareApplication',
			'@id': `${canonicalUrl}#software`,
			name: 'PCL Nex',
			alternateName: ['Plain Craft Launcher Nex', 'PCL2 Nex'],
			sameAs: [githubUrl],
			description: description.value,
			url: canonicalUrl,
			downloadUrl: `${canonicalUrl}#download`,
			image: socialImageUrl,
			applicationCategory: 'GameApplication',
			applicationSubCategory: 'Minecraft Launcher',
			operatingSystem: 'Windows 10/11; experimental macOS and Linux builds',
			isAccessibleForFree: true,
			license: licenseUrl,
			softwareHelp: `${githubUrl}#readme`,
			author: { '@id': `${canonicalUrl}#organization` },
			inLanguage: ['zh-CN', 'en-US'],
			featureList: [
				formatMessage(messages.structuredFeatureContentSources),
				formatMessage(messages.structuredFeatureLab),
				formatMessage(messages.structuredFeatureInstances),
				formatMessage(messages.structuredFeatureAccounts),
			],
		},
		{
			'@type': 'FAQPage',
			'@id': `${canonicalUrl}#faq`,
			inLanguage: locale.value,
			mainEntity: faqItems.value.map((item) => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.answer,
				},
			})),
		},
	],
}))

useSeoMeta({
	title: () => title.value,
	description: () => description.value,
	robots:
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
	author: 'PCL Nex Developer Team',
	applicationName: 'PCL Nex',
	themeColor: '#80d0e0',
	colorScheme: 'dark light',
	ogTitle: () => title.value,
	ogDescription: () => description.value,
	ogType: 'website',
	ogUrl: canonicalUrl,
	ogSiteName: 'PCL Nex',
	ogLocale: () => locale.value.replace('-', '_'),
	ogLocaleAlternate: () => (locale.value === 'zh-CN' ? 'en_US' : 'zh_CN'),
	ogImage: socialImageUrl,
	ogImageAlt: () => socialImageAlt.value,
	ogImageWidth: 512,
	ogImageHeight: 512,
	twitterCard: 'summary_large_image',
	twitterTitle: () => title.value,
	twitterDescription: () => description.value,
	twitterImage: socialImageUrl,
	twitterImageAlt: () => socialImageAlt.value,
})

useHead(() => ({
	link: [{ rel: 'canonical', href: canonicalUrl }],
	meta: [
		{
			name: 'keywords',
			content: keywords.value,
		},
	],
	script: [
		{
			key: 'pcl-nex-structured-data',
			type: 'application/ld+json',
			innerHTML: JSON.stringify(structuredData.value).replace(/</g, '\\u003c'),
		},
	],
}))
</script>

<template>
	<div>
		<div
			ref="hero"
			class="landing-hero"
			@pointerleave="resetHeroGlow"
			@pointermove="updateHeroGlow"
		>
			<div class="hero-grid" aria-hidden="true" />
			<div class="hero-content">
				<div class="flex items-center gap-3">
					<div class="hero-kicker">
						{{ formatMessage(messages.openSourceBadge) }}
					</div>
				</div>
				<h1
					class="main-header mb-8 mt-4 max-w-[52rem] text-balance text-[5.25rem] font-semibold leading-none text-[var(--color-contrast)]"
				>
					{{ formatMessage(messages.downloadPclNex) }}
				</h1>
				<p class="main-subheader">
					{{ formatMessage(messages.description) }}
				</p>
				<div class="button-group mt-3 flex flex-wrap justify-end gap-2">
					<ButtonStyled v-if="os" color="brand" size="large">
						<button
							class="hero-download-button"
							:disabled="downloadState === 'loading'"
							@click="handleDownload"
						>
							<LinuxIcon v-if="os === 'Linux'" />
							<WindowsIcon v-else-if="os === 'Windows'" />
							<AppleIcon v-else-if="os === 'Mac'" />
							{{
								downloadState === 'loading'
									? formatMessage(messages.fetchingDownloadLinks)
									: formatMessage(messages.downloadPclNexButton)
							}}
						</button>
					</ButtonStyled>
					<ButtonStyled type="outlined" size="large">
						<button @click="scrollToSection">
							<ArrowDownIcon />
							{{ formatMessage(messages.moreDownloadOptions) }}
						</button>
					</ButtonStyled>
				</div>
			</div>
			<div class="hero-product">
				<img
					src="/pcl-nex-launcher-preview.png"
					:alt="formatMessage(messages.heroScreenshotAlt)"
					width="1778"
					height="1014"
					decoding="async"
					fetchpriority="high"
				/>
			</div>
			<div class="hero-scroll-mark" aria-hidden="true"><span /></div>
			<div class="bottom-transition" />
		</div>
		<section
			id="features"
			class="pcl-nex-highlights"
			aria-labelledby="pcl-nex-highlights-title"
		>
			<div class="highlights-intro">
				<span
					class="text-xs font-extrabold uppercase tracking-[0.1em] text-brand"
					>{{ formatMessage(messages.builtOnModrinth) }}</span
				>
				<h2 id="pcl-nex-highlights-title">
					{{ formatMessage(messages.highlightsTitle) }}<br />
					{{ formatMessage(messages.highlightsTitleSecond) }}
				</h2>
				<p>{{ formatMessage(messages.highlightsDescription) }}</p>
			</div>

			<div class="modrinth-feature-grid">
				<article
					class="feature gradient-border promise-card col-span-2 min-h-[12.5rem] p-6"
					data-number="01"
				>
					<div class="promise-meta"><GitGraphIcon /><span>01</span></div>
					<h3>{{ formatMessage(messages.adFree) }}</h3>
					<p>{{ formatMessage(messages.adFreeDescription) }}</p>
				</article>
				<article
					class="feature gradient-border promise-card col-span-2 min-h-[12.5rem] p-6"
					data-number="02"
				>
					<div class="promise-meta"><BoxesIcon /><span>02</span></div>
					<h3>{{ formatMessage(messages.localized) }}</h3>
					<p>{{ formatMessage(messages.localizedDescription) }}</p>
				</article>
				<article
					class="feature gradient-border promise-card col-span-2 min-h-[12.5rem] p-6"
					data-number="03"
				>
					<div class="promise-meta"><GaugeIcon /><span>03</span></div>
					<h3>{{ formatMessage(messages.performant) }}</h3>
					<p>{{ formatMessage(messages.performantDescription) }}</p>
				</article>
				<article class="feature gradient-border plugin-market-feature">
					<PluginShowcase />
				</article>

				<article
					class="feature gradient-border showcase-card showcase-card-wide cross-platform-feature flex min-w-0 flex-col overflow-hidden p-0"
				>
					<div class="showcase-copy px-7 pb-6 pt-7">
						<span>{{ formatMessage(messages.crossPlatformLabel) }}</span>
						<h3>{{ formatMessage(messages.crossPlatformFeature) }}</h3>
						<p>{{ formatMessage(messages.crossPlatformFeatureDescription) }}</p>
					</div>
					<div
						class="compact-platform-art"
						role="img"
						:aria-label="formatMessage(messages.crossPlatformVisualAlt)"
					>
						<div class="compact-platform-item is-stable">
							<WindowsIcon aria-hidden="true" />
							<strong>Windows</strong>
							<span>{{ formatMessage(messages.platformStable) }}</span>
						</div>
						<div class="compact-platform-item">
							<AppleIcon aria-hidden="true" />
							<strong>macOS</strong>
							<span>{{ formatMessage(messages.platformTesting) }}</span>
						</div>
						<div class="compact-platform-item">
							<LinuxIcon aria-hidden="true" />
							<strong>Linux</strong>
							<span>{{ formatMessage(messages.platformTesting) }}</span>
						</div>
					</div>
				</article>
			</div>
			<div class="feature-row">
				<div class="point">
					<div class="title">
						<ImportGradientIcon />
						<h3>{{ formatMessage(messages.profileImporting) }}</h3>
					</div>
					<div class="description">
						{{ formatMessage(messages.profileImportingDescription) }}
					</div>
				</div>
				<div class="point">
					<div class="title">
						<OfflineModeIcon />
						<h3>{{ formatMessage(messages.offlineMode) }}</h3>
					</div>
					<div class="description">
						{{ formatMessage(messages.offlineModeDescription) }}
					</div>
				</div>
				<div class="point">
					<div class="title">
						<MultiplayerIcon />
						<h3>{{ formatMessage(messages.followProjects) }}</h3>
					</div>
					<div class="description">
						{{ formatMessage(messages.followProjectsDescription) }}
					</div>
				</div>
			</div>
		</section>
		<section id="faq" class="faq-section" aria-labelledby="faq-title">
			<div class="faq-intro">
				<span
					class="text-xs font-extrabold uppercase tracking-[0.1em] text-brand"
					>{{ formatMessage(messages.faqEyebrow) }}</span
				>
				<h2 id="faq-title">{{ formatMessage(messages.faqTitle) }}</h2>
				<p>{{ formatMessage(messages.faqDescription) }}</p>
			</div>
			<div class="faq-list flex flex-col gap-3">
				<details
					v-for="item in faqItems"
					:key="item.question"
					class="faq-item rounded-2xl border border-divider bg-surface-2"
				>
					<summary>{{ item.question }}</summary>
					<p>{{ item.answer }}</p>
				</details>
			</div>
		</section>
		<CommunitySection />
		<div
			id="download"
			ref="downloadSection"
			class="footer relative flex flex-col items-center justify-center gap-6 overflow-hidden bg-[var(--color-accent-contrast)] px-6 py-[clamp(4rem,8vw,7rem)] text-center text-[var(--color-contrast)]"
		>
			<div class="section-badge">
				{{ formatMessage(messages.downloadOptions) }}
			</div>
			<div class="section-subheader">
				<div class="section-subheader-title">
					{{ formatMessage(messages.downloadPclNexTitle) }}
				</div>
				<div class="section-subheader-description">
					{{ formatMessage(messages.downloadDescription) }}
				</div>
			</div>
			<div class="download-release-bar">
				<div class="download-release-status" role="status">
					<strong v-if="release">
						{{
							formatMessage(messages.downloadVersion, {
								channel: formatMessage(
									resolvedChannel === 'stable'
										? messages.downloadChannelStable
										: messages.downloadChannelBeta,
								),
								version: release.tag,
							})
						}}
					</strong>
					<span>
						{{
							formatMessage(messages.downloadSource, {
								source: formatMessage(
									activeDownloadSource === 'modelscope'
										? messages.downloadSourceModelScope
										: messages.downloadSourceGithub,
								),
							})
						}}
					</span>
				</div>
				<div class="download-release-actions">
					<button
						type="button"
						class="download-options-trigger"
						@click="downloadOptionsOpen = true"
					>
						<DownloadIcon aria-hidden="true" />
						{{ formatMessage(messages.chooseDownloadOptions) }}
					</button>
					<a :href="currentDownloadSourceUrl" target="_blank" rel="noopener">
						{{ formatMessage(messages.viewAllFiles) }}
					</a>
				</div>
			</div>
			<DownloadOptionsModal
				v-model="downloadOptionsOpen"
				v-model:channel="selectedReleaseChannel"
				v-model:source="selectedDownloadSource"
				:has-stable-release="hasStableRelease"
				:has-beta-release="hasBetaRelease"
				:has-model-scope-mirror="hasModelScopeMirror"
			/>
			<p v-if="downloadState === 'error'" class="download-manifest-error">
				{{ formatMessage(messages.downloadLinksFailed) }}
				<a :href="RELEASES_URL">{{
					formatMessage(messages.manualDownloadFallback)
				}}</a>
			</p>
			<div class="download-section">
				<div class="download-card">
					<div class="title">
						<WindowsLogo />
						{{ formatMessage(messages.windows) }}
					</div>
					<div class="description">
						<a
							v-if="windowsLink"
							ref="downloadWindows"
							:href="windowsLink"
							download=""
						>
							<DownloadIcon />
							<span
								>{{ formatMessage(messages.downloadInstaller) }} ·
								{{ formatMessage(messages.archX64) }}</span
							>
						</a>
						<a :href="windowsArm64Link" download="">
							<DownloadIcon />
							<span
								>{{ formatMessage(messages.downloadInstaller) }} ·
								{{ formatMessage(messages.archArm64) }}</span
							>
						</a>
					</div>
				</div>
				<div class="divider" />
				<div class="download-card">
					<div class="title">
						<AppleLogo />
						{{ formatMessage(messages.mac) }}
					</div>
					<div class="description apple">
						<a
							v-if="macLinks.x64"
							ref="downloadMac"
							:href="macLinks.x64"
							download=""
						>
							<DownloadIcon />
							<span
								>{{ formatMessage(messages.downloadInstaller) }} ·
								{{ formatMessage(messages.archX64) }}</span
							>
						</a>
						<a :href="macLinks.arm64" download="">
							<DownloadIcon />
							<span
								>{{ formatMessage(messages.downloadInstaller) }} ·
								{{ formatMessage(messages.archArm64) }}</span
							>
						</a>
					</div>
				</div>
				<div class="divider" />
				<div class="download-card">
					<div class="title">
						<LinuxLogo />
						<div class="flex">
							{{ formatMessage(messages.linux)
							}}<span class="text-sm text-secondary">*</span>
						</div>
					</div>
					<div class="description apple">
						<a
							v-if="linuxLinks.appImage"
							:href="linuxLinks.appImage"
							download=""
						>
							<DownloadIcon />
							<span>{{ formatMessage(messages.downloadAppImage) }}</span>
						</a>
						<span v-else class="download-unavailable">
							{{ linkUnavailableLabel }}
						</span>
						<Accordion
							class="mt-2 flex flex-col items-center"
							content-class="flex flex-col items-start gap-2 mt-2 text-sm"
							button-class="text-sm text-secondary bg-transparent p-0 w-fit text-left m-0 active:scale-[0.98] transition-transform"
						>
							<template #title="{ open }">
								{{
									formatMessage(
										open
											? messages.hideOtherPackages
											: messages.showOtherPackages,
									)
								}}
							</template>
							<span
								class="grid grid-cols-[auto_1fr] gap-2 text-left text-orange"
								><IssuesIcon class="mt-1" />
								{{ formatMessage(messages.notRecommended) }}</span
							>
							<a
								v-if="linuxLinks.deb"
								:href="linuxLinks.deb"
								download=""
								class="text-primary"
							>
								<DownloadIcon />
								<span>{{ formatMessage(messages.downloadTheDEB) }}</span>
							</a>
							<span v-else class="download-unavailable text-primary">
								{{ linkUnavailableLabel }}
							</span>
							<a
								v-if="linuxLinks.rpm"
								:href="linuxLinks.rpm"
								download=""
								class="text-primary"
							>
								<DownloadIcon />
								<span>{{ formatMessage(messages.downloadTheRPM) }}</span>
							</a>
							<span v-else class="download-unavailable text-primary">
								{{ linkUnavailableLabel }}
							</span>
						</Accordion>
					</div>
				</div>
			</div>
			<p class="terms">
				<IntlFormatted :message-id="messages.downloadTerms">
					<template #terms-link="{ children }">
						<a
							href="https://github.com/PCL-Nex-Developer/PCL2-Nex/blob/dev/Plain%20Craft%20Launcher%202/LICENCE"
							target="_blank"
							rel="noopener"
						>
							<component :is="() => children" />
						</a>
					</template>
					<template #privacy-link="{ children }">
						<NuxtLink to="/privacy">
							<component :is="() => children" />
						</NuxtLink>
					</template>
				</IntlFormatted>
			</p>
			<p class="max-w-[50rem] text-xs text-secondary">
				*<IntlFormatted :message-id="messages.linuxDisclaimer">
					<template #issues-link="{ children }">
						<a
							class="underline hover:brightness-[--hover-brightness]"
							href="https://github.com/PCL-Nex-Developer/PCL2-Nex/releases/latest"
							target="_blank"
							rel="noopener"
						>
							<component :is="() => children" />
						</a>
					</template>
					<template #prism-link="{ children }">
						<a
							class="underline hover:brightness-[--hover-brightness]"
							href="https://github.com/PCL-Nex-Developer/PCL2-Nex/issues"
							target="_blank"
							rel="noopener"
						>
							<component :is="() => children" />
						</a>
					</template>
				</IntlFormatted>
			</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
.faq-section {
	display: grid;
	grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
	gap: 4rem;
	width: min(76rem, calc(100% - 3rem));
	margin: 0 auto;
	padding: 7rem 0;
}

.faq-intro {
	h2 {
		margin: 0.75rem 0 1rem;
		color: var(--color-contrast);
		font-size: clamp(2rem, 4vw, 3.25rem);
		line-height: 1.08;
	}

	p {
		max-width: 32rem;
		margin: 0;
		color: var(--color-secondary);
		font-size: 1.05rem;
		line-height: 1.7;
	}
}

.faq-item {
	summary {
		padding: 1.15rem 1.25rem;
		color: var(--color-contrast);
		font-weight: 700;
		line-height: 1.4;
		cursor: pointer;
	}

	p {
		margin: 0;
		padding: 0 1.25rem 1.25rem;
		color: var(--color-secondary);
		line-height: 1.7;
	}
}

@media (max-width: 800px) {
	.faq-section {
		grid-template-columns: 1fr;
		gap: 2rem;
		width: calc(100% - 2rem);
		padding: 5rem 0;
	}
}

.landing-hero {
	--pointer-x: 50%;
	--pointer-y: 40%;
	position: relative;
	display: flex;
	min-height: min(63rem, calc(100svh + 8rem));
	align-items: center;
	flex-direction: column;
	overflow: hidden;
	padding: clamp(10rem, 12vw, 11.5rem) 1.5rem 0;
	margin-top: -5.25rem;
	background:
		radial-gradient(
			circle at var(--pointer-x) var(--pointer-y),
			rgb(128 208 224 / 22%),
			transparent 20rem
		),
		radial-gradient(
			circle at 12% 46%,
			rgb(88 168 192 / 11%),
			transparent 26rem
		),
		linear-gradient(155deg, #0e1317 0%, #10161b 52%, #111a1f 100%);
	isolation: isolate;

	&::before,
	&::after {
		position: absolute;
		z-index: -1;
		content: '';
		pointer-events: none;
	}

	&::before {
		inset: 0;
		background: linear-gradient(
			90deg,
			rgb(255 255 255 / 3%) 1px,
			transparent 1px
		);
		background-size: min(9vw, 9rem) 100%;
		mask-image: linear-gradient(180deg, black, transparent 72%);
	}

	&::after {
		inset: 9.25rem 7% auto;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgb(128 208 224 / 38%),
			transparent
		);
	}
}

@media (max-width: 1023px) {
	.landing-hero::after {
		inset: 8.5rem 7% auto;
	}
}

.hero-grid {
	position: absolute;
	inset: 0;
	z-index: -1;
	background-image: linear-gradient(rgb(255 255 255 / 3%) 1px, transparent 1px);
	background-size: 100% min(9vw, 9rem);
	mask-image: linear-gradient(180deg, black, transparent 70%);
	pointer-events: none;
}

.hero-content {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: min(100%, 59rem);
	text-align: center;
}

.hero-kicker {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	height: fit-content;
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand) 12%, transparent);
	color: var(--color-brand);
	font-size: 0.875rem;
	font-weight: 700;
	line-height: 1;
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	box-shadow: 0 0.75rem 2.5rem
		color-mix(in srgb, var(--color-brand) 12%, transparent);
}

.landing-hero .main-subheader {
	max-width: 46rem;
	margin: 0;
	color: var(--landing-color-subheading);
	font-size: clamp(1rem, 1.6vw, 1.25rem);
	font-weight: 450;
	line-height: 1.65;
	text-wrap: balance;
}

.landing-hero .button-group {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.75rem;
	margin: 2rem 0 0;
	mask-image: none;

	.hero-download-button {
		&:disabled {
			opacity: 0.65;
			cursor: wait;
		}
	}
}

.hero-product {
	position: relative;
	width: min(79rem, 112%);
	margin-top: clamp(3.25rem, 7vw, 5.5rem);

	> img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--landing-border-color);
		border-radius: 0.5rem 0.5rem 0 0;
		box-shadow: 0 2rem 5rem rgb(0 0 0 / 32%);
	}
}

.hero-scroll-mark {
	position: absolute;
	bottom: 2.25rem;
	left: 50%;
	display: flex;
	width: 1px;
	height: 3rem;
	justify-content: flex-start;
	overflow: hidden;
	background: rgb(255 255 255 / 14%);
	transform: translateX(-50%);

	span {
		width: 100%;
		height: 45%;
		background: var(--color-brand);
		animation: scroll-mark 2.3s ease-in-out infinite;
	}
}

@keyframes scroll-mark {
	0%,
	100% {
		transform: translateY(-110%);
	}
	55% {
		transform: translateY(220%);
	}
}

.pcl-nex-highlights {
	position: relative;
	padding: clamp(5rem, 10vw, 9rem) 1.5rem 3rem;
	background: var(--landing-transition-gradient-end);

	&::before {
		position: absolute;
		top: 0;
		left: 50%;
		width: min(76rem, calc(100% - 3rem));
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--landing-border-color),
			transparent
		);
		content: '';
		transform: translateX(-50%);
	}
}

.highlights-intro {
	max-width: 52rem;
	margin: 0 auto clamp(2.75rem, 6vw, 5rem);
	text-align: center;

	h2 {
		margin: 0.7rem 0 1rem;
		color: var(--color-contrast);
		font-size: clamp(2.5rem, 5.5vw, 4.75rem);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.04;
	}

	p {
		margin: 0;
		color: var(--color-secondary);
		font-size: 1.05rem;
		line-height: 1.65;
	}
}

.modrinth-feature-grid {
	width: min(100%, 68.5rem);
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(6, minmax(0, 1fr));
	gap: 1rem;
}

.modrinth-feature-grid .feature {
	padding: var(--gap-xl);
	z-index: 1;
	background: rgb(25 33 40 / 78%);
	box-shadow:
		0 1.25rem 3rem rgb(0 0 0 / 12%),
		0 0 4rem rgb(57 61 94 / 20%) inset;
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	overflow: hidden;
}

.promise-card {
	.promise-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--color-brand);

		svg {
			width: 1.35rem;
			height: 1.35rem;
		}

		span {
			color: var(--color-brand);
			font-size: 0.75rem;
			font-weight: 800;
			letter-spacing: 0.09em;
		}
	}

	h3 {
		margin: 2.2rem 0 0.65rem;
		color: var(--color-contrast);
		font-size: 1.2rem;
		letter-spacing: -0.025em;
	}

	p {
		margin: 0;
		color: var(--color-secondary);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	&::after {
		position: absolute;
		right: -1.75rem;
		bottom: -2.25rem;
		z-index: -1;
		color: rgb(255 255 255 / 4%);
		content: attr(data-number);
		font-size: 8rem;
		font-weight: 800;
		line-height: 1;
	}
}

.showcase-card-wide {
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: minmax(17rem, 0.78fr) minmax(0, 1.22fr);
	align-items: center;
}

.showcase-copy {
	span {
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	h3 {
		margin: 0.55rem 0 0.65rem;
		color: var(--color-contrast);
		font-size: clamp(1.35rem, 2.4vw, 1.8rem);
		letter-spacing: -0.035em;
		line-height: 1.1;
	}

	p {
		margin: 0;
		color: var(--color-secondary);
		font-size: 0.9rem;
		line-height: 1.6;
	}
}

:global(html.light-mode) .pcl-nex-highlights {
	background: #f4f7f8;
}

:global(html.light-mode) .promise-card::after {
	color: rgb(0 0 0 / 5%);
}

.cross-platform-feature {
	min-height: 13.5rem;
}

.compact-platform-art {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	align-items: center;
	gap: 0.75rem;
	min-height: 13.5rem;
	padding: 1.5rem;
	border-left: 1px solid var(--landing-border-color);
	background: var(--surface-2);
}

.compact-platform-item {
	display: flex;
	min-width: 0;
	min-height: 8.5rem;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.45rem;
	padding: 0.85rem 0.5rem;
	border: 1px solid var(--landing-border-color);
	border-radius: 0.45rem;
	background: rgb(255 255 255 / 3%);
	text-align: center;

	svg {
		width: 1.65rem;
		height: 1.65rem;
		margin-bottom: 0.2rem;
		color: var(--color-secondary);
	}

	strong {
		color: var(--color-contrast);
		font-size: 0.82rem;
	}

	span {
		color: var(--color-secondary);
		font-size: 0.68rem;
		white-space: nowrap;
	}

	&.is-stable {
		border-color: color-mix(in srgb, var(--color-brand) 50%, transparent);
		background: color-mix(in srgb, var(--color-brand) 9%, transparent);

		svg,
		span {
			color: var(--color-brand);
		}
	}
}

:global(html.light-mode) .compact-platform-item {
	background: rgb(0 0 0 / 3%);
}

.plugin-market-feature {
	grid-column: 1 / -1;
	text-align: center;
	padding: 0 !important;
	position: relative;
}

.feature-row {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--gap-lg);
	max-width: 1096px;
	margin: 0 auto;
	padding: calc(var(--gap-xl) * 2) 1rem;

	@media (max-width: 1024px) {
		grid-template-columns: repeat(1, 1fr);

		.point {
			text-align: center;

			.title {
				justify-content: center;
			}
		}
	}

	.point {
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
		padding: 1rem 0;

		.title {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		h3 {
			font-size: var(--font-size-lg);
			font-weight: normal;
			color: var(--landing-color-heading);
			margin: 0;
		}

		p {
			color: var(--landing-color-subheading);
			margin: 0;
		}

		a {
			text-decoration: underline;
		}
	}
}

.table {
	display: grid;
	border: 1px solid rgba(#a8b1ddbf, 0.25);
	gap: 0.25rem;
	overflow: hidden;
	font-size: var(--font-size-sm);
	background: rgba(59, 63, 85, 0.15);
	box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.16);

	.first {
		border-top: none !important;
	}

	.row {
		&:not(.header) {
			border-top: 1px solid rgba(#a8b1ddbf, 0.25);
		}
	}
}

.mod-row-leave-active {
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

.mod-row-leave-to {
	opacity: 0;
	transform: translateX(-0.5rem);
}

// 表格是真实文本（模组名、版本），允许选中复制；projects 滚动区保持禁选
.table .row {
	user-select: text;
}

.footer {
	&::before {
		position: absolute;
		top: 0;
		left: 50%;
		width: min(50rem, 90%);
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-brand),
			transparent
		);
		content: '';
		transform: translateX(-50%);
	}

	.section-badge {
		border: 1px solid color-mix(in srgb, var(--color-brand) 40%, transparent);
		background-color: var(--color-brand-highlight);
		color: var(--color-brand);
		border-radius: 0;
		width: min-content;
		padding: var(--gap-lg) var(--gap-xl);
		white-space: nowrap;
	}

	.section-subheader {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-sm);
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		margin: 2rem 0;

		.section-subheader-title {
			font-size: clamp(2rem, 4vw, 3.75rem);
			font-weight: 700;
			letter-spacing: 0;
			line-height: 1;
			margin: 0;
		}

		.section-subheader-description {
			color: var(--color-base);
			margin: 0;
		}
	}

	.download-section {
		display: grid;
		grid-template-columns: 1fr 1px 1fr 1px 1fr;
		height: 100%;
		gap: var(--gap-lg);
		max-width: 1096px;
		margin: 0 auto;

		@media (max-width: 1024px) {
			grid-template-columns: repeat(1, 1fr);
			max-width: 340px;

			.divider {
				display: none;
			}
		}

		.divider {
			height: 13rem;
			width: 1px;
			background: var(--landing-border-color);
			margin: 0;
		}

		.download-card {
			display: flex;
			flex-direction: column;
			gap: calc(var(--gap-lg) * 2);
			padding: calc(var(--gap-lg) * 2);
			height: min-content;

			.title {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: var(--font-size-2xl);
				gap: var(--gap-sm);
				border-radius: var(--radius-md) var(--radius-md) 0 0;
				color: var(--color-contrast);
			}

			.description {
				display: flex;
				flex-direction: column;
				align-items: center;
				border-top: none;
				font-size: var(--font-size-md);
				color: var(--color-brand);
				gap: var(--gap-sm);

				a {
					display: flex;
					align-items: center;
					gap: var(--gap-sm);
					justify-content: center;

					&:hover {
						cursor: pointer;
					}

					span {
						text-align: left;
					}
				}

				.download-unavailable {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: var(--gap-sm);
					min-height: 2.25rem;
					color: var(--color-secondary);
					font-size: var(--font-size-sm);
					text-align: center;
					cursor: default;
				}
			}

			:deep(.animated-dropdown) {
				color: var(--color-brand);
				width: 16rem;
				white-space: nowrap;

				.selected {
					border: 1px solid var(--color-brand);
					background-color: var(--color-accent-contrast);
				}

				.options {
					border: 1px solid var(--color-brand);
					border-radius: 0 0 var(--radius-md) var(--radius-md);
				}

				.option {
					background-color: var(--color-accent-contrast);
				}

				.selected-option {
					background-color: var(--color-brand);
				}
			}
		}
	}

	.download-release-bar {
		display: flex;
		width: min(100%, 68.5rem);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 0;
		border-block: 1px solid var(--landing-border-color);

		@media (max-width: 680px) {
			flex-direction: column;
		}
	}

	.download-release-status {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		font-size: 0.8rem;
		text-align: left;

		strong {
			color: var(--color-contrast);
		}

		span {
			color: var(--color-secondary);
		}
	}

	.download-release-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.85rem;

		> a {
			color: var(--color-brand);
			font-size: 0.875rem;
			font-weight: 600;
		}

		@media (max-width: 680px) {
			justify-content: center;
		}
	}

	.download-options-trigger {
		display: inline-flex;
		min-height: 2.5rem;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--landing-border-color);
		border-radius: 0.375rem;
		background: var(--surface-2);
		color: var(--color-contrast);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 650;
		cursor: pointer;

		&:hover {
			border-color: var(--color-brand);
			color: var(--color-brand);
		}

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	.download-manifest-error {
		margin: -0.5rem 0 0;
		color: var(--color-secondary);
		font-size: 0.8rem;

		a {
			margin-left: 0.35rem;
			color: var(--color-brand);
		}
	}

	.download-error-banner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		width: min(100%, 68.5rem);
		margin: 0 auto;
		padding: 0.75rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--color-brand) 40%, transparent);
		border-radius: var(--radius-md);
		background: var(--color-brand-highlight);
		color: var(--color-contrast);
		font-size: var(--font-size-sm);
		text-align: center;

		.download-error-links {
			display: inline-flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.5rem 1rem;

			a {
				color: var(--color-brand);
				font-weight: 700;
				text-decoration: underline;
				text-underline-offset: 0.15rem;
			}

			a + a::before {
				content: '·';
				margin-right: 1rem;
				color: var(--color-secondary);
				font-weight: 400;
			}
		}
	}

	.terms {
		margin: var(--gap-xl);
		font-size: var(--font-size-lg);
		color: var(--landing-color-subheading);
		text-align: center;
		line-height: 1.5;

		a {
			text-decoration: underline;
		}
	}
}

.gradient-border {
	position: relative;
	border-radius: var(--radius-lg);

	&:before {
		content: '';
		position: absolute;
		inset: 0;
		padding: 1px;
		z-index: -1;
		border-radius: 1rem;
		background: var(--landing-border-gradient);

		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}
}

.bottom-transition {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 30rem;
	background: linear-gradient(
		0deg,
		var(--landing-transition-gradient-end) 0%,
		var(--landing-transition-gradient-start) 100%
	);
	pointer-events: none;
}

@media screen and (max-width: 1024px) {
	.cross-platform-feature,
	.plugin-market-feature {
		grid-column: 1 / -1 !important;
	}

	.main-header {
		font-size: 4rem !important;
	}

	.main-subheader {
		font-size: 1.25rem !important;
	}
}

@media screen and (max-width: 746px) {
	.landing-hero {
		padding-inline: 1rem;
	}

	.hero-product {
		width: 108%;
		margin-top: 3rem;
	}

	.pcl-nex-highlights {
		padding: 0 1rem 1rem;
	}

	.highlights-intro {
		margin-bottom: 2rem;

		p {
			font-size: 0.95rem;
		}
	}

	.modrinth-feature-grid {
		grid-template-columns: 1fr;
	}

	.promise-card,
	.showcase-card,
	.cross-platform-feature,
	.plugin-market-feature {
		grid-column: auto;
	}

	.promise-card {
		min-height: auto;
		padding: 1.25rem;

		h3 {
			margin-top: 1.5rem;
		}
	}

	.showcase-card-wide {
		grid-column: auto;
		grid-template-columns: 1fr;
	}

	.compact-platform-art {
		min-height: auto;
		padding: 1rem;
		border-top: 1px solid var(--landing-border-color);
		border-left: 0;
	}

	.compact-platform-item {
		min-height: 7.5rem;
	}

	.showcase-copy {
		padding: 1.35rem 1.25rem 1.15rem;
	}

	.main-header {
		font-size: 3rem !important;
	}

	.main-subheader {
		font-size: 1.1rem !important;
	}
}

.light-mode {
	.footer {
		background: #f4f7f8;
	}

	.feature {
		background: rgb(255 255 255 / 88%) !important;
		box-shadow:
			2px 2px 64px 0px rgba(255, 255, 255, 0.45) inset,
			2px 2px 12px 0px rgba(0, 0, 0, 0.16) !important;
		border: none !important;
	}

	.gradient-border {
		&:before {
			background: var(--landing-border-gradient-light);
		}
	}

	.search-bar {
		background: var(--color-raised-bg) !important;
		border: 2px solid var(--color-brand) !important;

		.mini-input {
			background: var(--color-raised-bg) !important;
			border: 2px solid var(--color-bg);
		}
	}

	.landing-hero {
		background:
			radial-gradient(
				circle at var(--pointer-x) var(--pointer-y),
				rgb(88 168 192 / 20%),
				transparent 28rem
			),
			radial-gradient(
				circle at 82% 36%,
				rgb(48 96 96 / 10%),
				transparent 32rem
			),
			linear-gradient(180deg, #f8fbfc 0%, #f3f7f8 58%, #eef3f5 100%);

		.hero-grid {
			background-image: linear-gradient(
				rgb(48 96 96 / 5%) 1px,
				transparent 1px
			);
		}

		&::after {
			background: linear-gradient(
				90deg,
				transparent,
				rgb(48 96 96 / 22%),
				transparent
			);
		}
	}

	.hero-product > img {
		box-shadow: 0 2rem 5rem rgb(31 55 64 / 16%);
	}

	.table {
		background: white;
	}
}
</style>
